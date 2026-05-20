<script setup>
import tinkoffPlugin from '../../plugins/tinkoff';
import {message} from "ant-design-vue";
import {getCurrentInstance, onMounted, ref} from 'vue';
import {useTrips} from '../../stores/trips'
import {useContract} from '../../stores/contract'
import {useAuth} from '../../stores/auth'
import {useRouter} from 'vue-router';


const router = useRouter()

const app = getCurrentInstance();
const htmlToPaper = app.appContext.config.globalProperties.$htmlToPaper;

const tripStore = useTrips()
const userStore = useAuth()
const contractStore = useContract()
const sellerInn = ''

// все чеки
let bought = ref([])
// индикатор загрузки
let loading = ref(false)
// диалоговое окно
let buyDialog = ref(false)
// оплатить -> выводится инфа по этому чеку
let currentBill = ref({})


const getSellerContract = async (shopCode) => {

  return await contractStore.getContractByShopCode(shopCode)

}
const clearData = (dateNumber) => {
  let date = new Date(dateNumber).toLocaleDateString("ru-Ru", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
  if (date !== "Invalid Date" && date) {
    return date;
  }
  return "";
};
let billTotal = (bill) => {
  let result = (bill.cart || []).reduce((accumulator, object) => {
    return accumulator + object.cost * object.count;
  }, 0)
  for (let service of (bill.additionalServices || [])) {
    result += service.count * service.price
  }
  return result
}

// Проверка, используется ли двухэтапная оплата
const isTwoStagePayment = (bill) => {
  const hasPaymentOrder = bill?.tripId?.loyalty?.enabled &&
      bill?.tripId?.loyalty?.type === 'discount' &&
      bill?.tripId?.loyalty?.discount?.paymentOrder;

  if (!hasPaymentOrder) return false;

  // Если скидка зафиксирована и первый платёж не оплачен — один платёж на всю сумму
  if (bill?.tripId?.loyalty?.discount?.isFixed && !(bill.payment?.amount > 0)) {
    return false;
  }

  return true;
}

// Расчет суммы первого платежа
const getFirstPaymentAmount = (bill) => {
  if (!isTwoStagePayment(bill)) {
    return billTotal(bill);
  }

  const paymentOrder = bill.tripId.loyalty.discount.paymentOrder;
  const [firstPart] = paymentOrder.split('/').map(Number);
  const percentage = firstPart / 100;

  return Math.round(billTotal(bill) * percentage);
}

// Расчёт общей скидки по программе лояльности
const getTotalDiscount = (bill) => {
  const discountPerPerson = bill?.tripId?.loyalty?.discount?.fixedDiscountPerPerson || 0
  if (discountPerPerson <= 0) return 0
  const totalParticipants = (bill.cart || []).reduce((sum, item) => sum + (item.count || 0), 0)
  return discountPerPerson * totalParticipants
}

// Расчет суммы второго платежа
const getSecondPaymentAmount = (bill) => {
  if (!isTwoStagePayment(bill)) {
    return 0;
  }

  const totalAmount = billTotal(bill);
  const firstPayment = getFirstPaymentAmount(bill);
  const discount = getTotalDiscount(bill);
  const secondPayment = totalAmount - firstPayment - discount;

  return Math.max(0, secondPayment);
}

// Определить, какой платеж нужно оплатить
const getRemainingPayment = (bill) => {
  if (!isTwoStagePayment(bill)) {
    return billTotal(bill) - (bill.payment?.amount || 0);
  }

  const paidAmount = bill.payment?.amount || 0;
  const firstPayment = getFirstPaymentAmount(bill);

  // Если первый платеж не оплачен полностью
  if (paidAmount < firstPayment) {
    return firstPayment - paidAmount;
  }

  // Иначе оплачиваем второй платеж (уже с учётом скидки)
  const secondPayment = getSecondPaymentAmount(bill);
  return Math.max(0, secondPayment - (paidAmount - firstPayment));
}

async function updateBought() {
  loading.value = true
  let result = []
  let data = await tripStore.getBoughtTrips()
  for (let bill of data) {
    if (bill.tinkoff) {
      let res = await tinkoffPlugin.checkPayment(bill.tinkoff.paymentId, bill.tinkoff.token)
      if (res.data.Status == "CONFIRMED") {
        bill.payment.amount = (bill.payment.amount || 0) + Number(res.data.Amount / 100)
      }
    }
    result.push(bill)
  }
  bought.value = result.reverse()
  loading.value = false
}

async function cancelTrip(bill_id, user_id) {
  let res = await userStore.cancelTrip(bill_id, user_id)
  if (res.status == 200)
    await updateBought()
}

async function buyTrip(cardId) {
  for (let b of bought.value) {
    if (b._id == cardId) {
      currentBill.value = b
      break
    }
  }

  buyDialog.value = true
  const orderId = Date.now().toString()

  // Проверяем предыдущий tinkoff-платёж и сохраняем его сумму, чтобы не потерять при перезаписи
  let confirmedPreviousAmount = 0
  if (currentBill.value.tinkoff?.paymentId) {
    try {
      let prevRes = await tinkoffPlugin.checkPayment(currentBill.value.tinkoff.paymentId, currentBill.value.tinkoff.token)
      if (prevRes.data.Status === "CONFIRMED") {
        confirmedPreviousAmount = Number(prevRes.data.Amount / 100)
      }
    } catch (e) {
      console.log('Ошибка проверки предыдущего платежа:', e)
    }
  }

  // Создаем корзину для оплаты с учетом программы лояльности
  let paymentCart = currentBill.value.cart;
  let additionalServices = currentBill.value.additionalServices?.length ? currentBill.value.additionalServices : [];

  const isLoyaltyDiscount = isTwoStagePayment(currentBill.value);

  if (isLoyaltyDiscount) {
    const totalAmount = billTotal(currentBill.value);
    const remainingPayment = getRemainingPayment(currentBill.value);

    // Рассчитываем пропорцию для уменьшения цен
    const paymentPercentage = remainingPayment / totalAmount;

    // Создаем копию корзины с пропорционально уменьшенными ценами
    paymentCart = currentBill.value.cart.map(item => ({
      ...item,
      cost: Math.round(item.cost * paymentPercentage * 100) / 100
    }));

    // Также уменьшаем цены дополнительных услуг
    additionalServices = additionalServices.map(service => ({
      ...service,
      price: Math.round(service.price * paymentPercentage * 100) / 100
    }));
  }

  let {data, token, success} =
      await tinkoffPlugin.initPayment(orderId, paymentCart, userStore.user.email, currentBill.value.tripId.tinkoffContract, currentBill.value.tripId.name, additionalServices)
  if (!success) {
    message.config({duration: 3, top: "90vh"});
    message.error({content: "Ошибка при оплате"});
    return
  }
  currentBill.value.tinkoff =
      {
        orderId: data.OrderId,
        amount: data.Amount,
        token,
        paymentId: data.PaymentId
      }

  window.open(data.PaymentURL, '_blank')

  userStore
      .payTinkoffBill(currentBill.value, currentBill.value.tinkoff, currentBill.value.tripId.name, currentBill.value.tripId.author.email, confirmedPreviousAmount)
      .then(async (response) => {
        if (response.status == 200) {
          message.config({duration: 3, top: "90vh"});
          message.success({content: "Тур заказан!"});
        }
        buyDialog.value = false;
      })
      .catch((err) => {
        console.log(err);
      });
}

const print = async (BILL) => {
  tripStore.printContractTour = {}
  tripStore.printContractTour = BILL
  tripStore.printContractTour.billTotal = billTotal(BILL)

  tripStore.printContractTour.seller = await getSellerContract(String(BILL?.tripId.tinkoffContract.ShopCode))
  router.push('/print-contract')
  // await htmlToPaper('printMe');
};

let expandedBills = ref({})

function toggleBillExpand(billId) {
  expandedBills.value[billId] = !expandedBills.value[billId]
}

function getCustomersCount(bill) {
  const billIds = bill.tripId?.billsList || []
  const tripId = bill.tripId?._id
  let res = 0

  // Собираем map загруженных bills по _id для быстрого поиска
  const loadedBillsMap = {}
  for (let b of bought.value) {
    if (b.tripId?._id === tripId) {
      loadedBillsMap[b._id] = b
    }
  }

  for (let entry of billIds) {
    const id = typeof entry === 'string' ? entry : entry?._id
    const loadedBill = loadedBillsMap[id]

    if (loadedBill) {
      // Есть полные данные — считаем реальное кол-во людей из cart
      for (let cartItem of (loadedBill.cart || [])) {
        res += cartItem.count || 0
      }
    } else if (typeof entry !== 'string' && entry?.cart) {
      // Объект с cart (populated)
      for (let cartItem of (entry.cart || [])) {
        res += cartItem.count || 0
      }
    } else {
      // Нет данных — считаем как 1 человека (минимум)
      res++
    }
  }

  return res
}

function getMaxDiscount(bill) {
  return bill?.tripId?.loyalty?.discount?.maxDiscountPerPerson || 0
}

function getCurrentDiscount(bill) {
  return bill?.tripId?.loyalty?.discount?.currentDiscountPerPerson || 0
}

function isMaxDiscount(bill) {
  const current = getCurrentDiscount(bill)
  const max = getMaxDiscount(bill)
  return max > 0 && current >= max
}

function getActiveFreeService(bill) {
  if (bill?.tripId?.loyalty?.type !== 'free_services') return null
  const levels = bill?.tripId?.loyalty?.freeServices?.levels || []
  const count = getCustomersCount(bill)
  let active = null
  for (const level of levels) {
    if (count >= Number(level.peopleCount || 0)) {
      active = level
    }
  }
  return active
}

function getDiscountedTotal(bill) {
  const total = billTotal(bill)
  const discount = getTotalDiscount(bill)
  return Math.max(0, total - discount)
}

function isFullyPaid(bill) {
  if (isTwoStagePayment(bill)) {
    return bill.payment.amount >= getFirstPaymentAmount(bill) + getSecondPaymentAmount(bill)
  }
  return billTotal(bill) <= bill.payment.amount
}

onMounted(async () => {
  await updateBought()
})
</script>
<template>
  <a-row v-if="loading">
    <a-col :span="24" class="d-flex justify-center mt-16">
      <img src="../../assets/images/founddog.webp" alt="" style="height: 150px;">
    </a-col>
  </a-row>
  <div v-else class="bt-grid">
    <div v-for="BILL of bought" :key="BILL._id" class="bt-grid__item">
      <div class="bt-card">
        <!-- Header: name + delete + date -->
        <div class="bt-card__header">
          <div class="bt-card__name">
            <a-popconfirm v-if="BILL.payment.amount == 0" title="Удалить?" ok-text="Да" cancel-text="Нет"
                          @confirm="cancelTrip(BILL._id, userStore.user._id)">
              <span class="mdi mdi-delete bt-card__delete-icon"></span>
            </a-popconfirm>
            {{ BILL.tripId?.name }}
          </div>
          <div class="bt-card__date">{{ clearData(BILL?.date) }}</div>
        </div>

        <div v-if="BILL?.isWaitingList" class="bt-card__waiting">Лист ожидания</div>

        <!-- Loyalty: discount -->
        <div v-if="BILL.tripId?.loyalty?.enabled && BILL.tripId?.loyalty?.type === 'discount'" class="bt-card__loyalty">
          <div class="bt-card__loyalty-row">
            <div class="bt-card__loyalty-progress">
              <div class="bt-card__loyalty-label">Количество человек в туре</div>
              <div class="bt-card__progress-wrap">
                <span class="bt-card__progress-text">{{ getCustomersCount(BILL) }} / {{ BILL.tripId?.maxPeople }}</span>
                <a-progress
                    :percent="(getCustomersCount(BILL) / (BILL.tripId?.maxPeople || 1)) * 100"
                    :show-info="false"
                    :strokeWidth="16"
                    strokeColor="#ff6600"
                />
              </div>
            </div>
            <div class="bt-card__loyalty-badge" :class="{ 'bt-card__loyalty-badge--max': isMaxDiscount(BILL) }">
              <span class="bt-card__loyalty-badge-title">{{
                  isMaxDiscount(BILL) ? 'Максимальная скидка' : 'Скидка'
                }}</span>
              <div>
                <span class="bt-card__loyalty-badge-current">{{ getCurrentDiscount(BILL) }}₽</span>
                <span class="bt-card__loyalty-badge-max"> / {{ getMaxDiscount(BILL) }}₽</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Loyalty: free_services -->
        <div v-if="BILL.tripId?.loyalty?.enabled && BILL.tripId?.loyalty?.type === 'free_services'"
             class="bt-card__loyalty">
          <div class="bt-card__loyalty-row">
            <div class="bt-card__loyalty-progress">
              <div class="bt-card__loyalty-label">Количество человек в туре</div>
              <div class="bt-card__progress-wrap">
                <span class="bt-card__progress-text">{{ getCustomersCount(BILL) }} / {{ BILL.tripId?.maxPeople }}</span>
                <a-progress
                    :percent="(getCustomersCount(BILL) / (BILL.tripId?.maxPeople || 1)) * 100"
                    :show-info="false"
                    :strokeWidth="16"
                    strokeColor="#ff6600"
                />
              </div>
            </div>
          </div>
          <div
              v-for="(level, index) in BILL.tripId?.loyalty?.freeServices?.levels"
              :key="index"
          >
            <div
                v-if="getCustomersCount(BILL) >= Number(level.peopleCount || 0)"
                class="bt-card__free-badge"
            >
              Вам доступна бесплатная услуга «{{ level.service }}»
            </div>
            <div
                v-else
                class="bt-card__free-pending"
            >
              При наборе {{ level.peopleCount }} человек, в подарок вы получите услугу <span>«{{
                level.service
              }}»</span>
            </div>
          </div>
        </div>

        <!-- Bottom block: dates, tickets, total, payment info -->
        <div class="bt-card__bottom">
          <!-- Trip dates + print -->
          <div class="bt-card__trip-dates">
            <span>Дата проведения тура: <b style="{font-weight: 600;color: #f60;}">{{ clearData(BILL.tripId?.start) }} - {{
                clearData(BILL.tripId?.end)
              }}</b></span>
            <span class="mdi mdi-printer-outline bt-card__print" @click="print(BILL)"></span>
          </div>

          <!-- Tickets -->
          <div class="bt-card__tickets">
            <div class="bt-card__tickets-header" @click="toggleBillExpand(BILL._id)">
              <span>Билеты</span>
              <span class="bt-card__tickets-toggle">{{ expandedBills[BILL._id] ? 'Скрыть' : 'Показать все' }}</span>
            </div>
            <div v-if="expandedBills[BILL._id]" class="bt-card__tickets-body">
              <div v-for="cartItem of (BILL.cart || [])" :key="cartItem.costType">
                <div v-if="cartItem.count" class="bt-card__ticket-item">
                  {{ cartItem.costType }} &mdash; {{ cartItem.count }} x {{ cartItem.cost }}₽
                </div>
              </div>
              <div v-if="BILL.seats && BILL.seats.length" class="bt-card__ticket-item">
                Места: {{ BILL.seats.join(', ') }}
              </div>
              <div v-if="BILL.additionalServices?.length > 0">
                <div class="bt-card__ticket-divider"></div>
                <div v-for="service of BILL.additionalServices" :key="service.name" class="bt-card__ticket-item">
                  {{ service.name }} &mdash; {{ service.count }} x {{ service.price }}₽
                </div>
              </div>
              <div v-for="doc in BILL.payment?.documents" :key="doc.payDocument" class="bt-card__ticket-item"
                   style="opacity: 0.6;">
                {{ doc.payDocument }} — {{ doc.paySum }}₽
              </div>
            </div>
          </div>

          <!-- Total + Pay -->
          <div class="bt-card__footer">
            <div class="bt-card__totals">
              <div class="bt-card__total-line">
                <span class="bt-card__total-label">Итого:</span>
                <span class="bt-card__total-value">{{
                    getTotalDiscount(BILL) > 0 ? getDiscountedTotal(BILL) : billTotal(BILL)
                  }}₽</span>
                <span v-if="getTotalDiscount(BILL) > 0" class="bt-card__total-old">{{ billTotal(BILL) }}₽</span>
              </div>
              <div class="bt-card__paid-line">
                Оплачено: {{ BILL.payment.amount }}₽
              </div>
            </div>
            <div class="bt-card__pay-actions">
              <span v-if="isFullyPaid(BILL)" class="bt-card__paid-badge">
                <span class="mdi mdi-check-all"></span> оплачен
              </span>
              <template v-else-if="getRemainingPayment(BILL) > 0">
                <a-tooltip
                    v-if="isTwoStagePayment(BILL) && BILL.payment.amount >= getFirstPaymentAmount(BILL) && !BILL.tripId?.loyalty?.discount?.isFixed"
                    title="Скидка ещё не зафиксирована">
                  <a-button type="primary" class="bt-card__pay-btn" disabled>
                    Оплатить
                  </a-button>
                </a-tooltip>
                <a-button v-else @click="buyTrip(BILL._id)" type="primary" class="bt-card__pay-btn">
                  Оплатить
                </a-button>
              </template>
            </div>
          </div>

          <!-- Two-stage payment info -->
          <div v-if="isTwoStagePayment(BILL)" class="bt-card__payment-info">
            Оплата производится в 2 этапа, оплатите часть общей суммы сейчас, оставшуюся часть
            <b v-if="BILL.tripId?.loyalty?.discount?.isFixed"> после фиксации скидки</b>
            <b v-else> с {{ clearData(BILL.tripId?.start) }} по {{ clearData(BILL.tripId?.end) }}</b>,
            оставшаяся сумма будет пересчитана с учетом скидки
          </div>
        </div>

      </div>
    </div>
  </div>
  <!-- <a-modal v-model:open="buyDialog" :footer="null">
      <form @submit.prevent="buyTrip" class="mt-16">
          <a-row :gutter="[4, 8]">
              <a-col :span="24">
                  <div class="d-flex direction-column">
                      Место посадки:<b>
                          {{ currentBill.selectedStartLocation }}
                      </b>
                  </div>
              </a-col>
              <a-col :span="24">
                  <div>Даты: <b>
                          {{ clearData(currentBill.tripId.start) + " - " + clearData(currentBill.tripId.start) }}
                      </b>
                  </div>
              </a-col>
              <a-col :span="24">
                  <div>Цены:</div>
                  <div v-if="currentBill.isWaitingList" style="color: #ff6600">
                      Вы в листе ожидания
                  </div>
                  <a-row v-for="cost of currentBill.cart">
                      <a-col :span="8">
                          {{ cost.costType }}
                      </a-col>

                      <a-col :span="8">{{ cost.cost }} руб.</a-col>
                      <a-col :span="8" class="d-flex justify-end">
                          {{ cost.count }} чел.
                      </a-col>
                  </a-row>
              </a-col>
              <a-col :span="24" class="d-flex justify-end">
                  <b>Итого: {{ billTotal(currentBill) }} руб.</b>
              </a-col>
              <div v-if="currentBill.tripId?.partner">
                  <h4 class="warning">Наличие мест требует уточнения!</h4>
              </div>

              <a-col :span="24">
                  <div class="d-flex space-around">
                      <div class="buy-btn">
                          <div>
                              <a-button html-type="submit" type="primary" class="lets_go_btn">
                                  оплатить
                              </a-button>
                          </div>
                          <div class="d-flex justify-center">
                              <img :src="TinkoffLogo" class="tinkoff-logo">
                          </div>
                      </div>
                  </div>
              </a-col>
          </a-row>
      </Form>
  </a-modal> -->
</template>
<style lang="scss" scoped>
.bt-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 20px;
  border-radius: 40px;
  background: #f3f3f3;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 10px;
  }
}

.bt-card {
  font-family: 'Montserrat', sans-serif;
  border-radius: 20px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.5);
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 8px;
  }

  &__name {
    font-weight: 400;
    font-size: 16px;
    color: #434343;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__delete-icon {
    color: #f60;
    cursor: pointer;
    font-size: 18px;
    opacity: 0.6;

    &:hover {
      opacity: 1;
    }
  }

  &__date {
    font-weight: 600;
    font-size: 16px;
    color: #f60;
    white-space: nowrap;
  }

  &__waiting {
    color: #f60;
    font-weight: 500;
    font-size: 13px;
  }

  // Loyalty section
  &__loyalty {
    display: flex;
    flex-direction: column;
    gap: 5px;
    border-radius: 16px;
  }

  &__loyalty-row {
    display: flex;
    align-items: stretch;

    @media (max-width: 480px) {
      flex-direction: column;
    }
  }

  &__loyalty-progress {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: #fff;
    border-radius: 14px;
    padding: 10px;
  }

  &__loyalty-label {
    font-weight: 500;
    font-size: 13px;
    color: #8c8c8c;
  }

  &__progress-wrap {
    position: relative;
    width: 100%;
  }

  &__progress-text {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 2px;
    left: 2px;
    z-index: 1;
    border-radius: 6px;
    padding: 0 8px;
    min-width: 46px;
    height: 16px;
    background: rgba(255, 255, 255, 0.9);
    font-weight: 600;
    font-size: 10px;
    line-height: 1;
    color: #3d3d3d;
    white-space: nowrap;
  }

  :deep(.ant-progress) {
    margin: 0;

    .ant-progress-outer {
      border-radius: 8px !important;
      padding: 0 !important;
      height: 20px !important;
      background: #efefef !important;
      display: flex;
    }

    .ant-progress-inner {
      border-radius: 6px !important;
      height: 100% !important;
      background: transparent !important;
    }

    .ant-progress-bg {
      border-radius: 6px !important;
      height: 100% !important;
    }
  }

  &__loyalty-badge {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    border-radius: 14px;
    padding: 10px;
    background: #f60;
    color: #fff;
    min-width: 140px;

    &--max {
      background: #f60;
    }
  }

  &__loyalty-badge-title {
    font-weight: 500;
    font-size: 13px;
    color: #fff;
  }

  &__loyalty-badge-current {
    font-weight: 700;
    font-size: 22px;
    color: #fff;
  }

  &__loyalty-badge-max {
    font-weight: 400;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.6);
  }

  &__free-badge {
    border-radius: 10px;
    padding: 4px;
    background: #f60;
    color: #fff;
    font-weight: 500;
    font-size: 14px;
    line-height: 1.2;
  }

  &__free-pending {
    border-radius: 10px;
    padding: 4px;
    background: #fff;
    font-weight: 500;
    font-size: 14px;
    color: #8c8c8c;
    line-height: 1.2;

    span {
      color: #f60;
    }
  }

  // Bottom wrapper block
  &__bottom {
    border-radius: 10px;
    padding: 10px;
    background: #fff;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  // Trip dates
  &__trip-dates {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
    font-size: 14px;
    color: #8c8c8c;
  }

  &__print {
    font-size: 20px;
    color: #363636;
    cursor: pointer;

    &:hover {
      color: #f60;
    }
  }

  // Tickets
  &__tickets {
    border-radius: 10px;
    box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.17);
    background: #fff;
    overflow: hidden;
  }

  &__tickets-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    color: #8c8c8c;
    user-select: none;
  }

  &__tickets-toggle {
    font-weight: 500;
    font-size: 14px;
    color: #f60;
  }

  &__tickets-body {
    padding: 0 4px 4px 4px;
  }

  &__ticket-item {
    font-weight: 500;
    font-size: 14px;
    color: #8c8c8c;
  }

  &__ticket-divider {
    height: 1px;
    background: #f0f0f0;
    margin: 6px 0;
  }

  // Footer: total + pay
  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;

    @media (max-width: 480px) {
      flex-direction: column;
      align-items: stretch;
    }
  }

  &__totals {
    flex: 1;
  }

  &__total-line {
    display: flex;
    align-items: baseline;
    gap: 6px;
    flex-wrap: wrap;
  }

  &__total-label {
    font-weight: 600;
    font-size: 18px;
    color: #f60;
  }

  &__total-value {
    font-weight: 700;
    font-size: 20px;
    color: #f60;
  }

  &__total-old {
    font-weight: 400;
    font-size: 14px;
    color: #b4b4b4;
    text-decoration: line-through;
  }

  &__paid-line {
    font-weight: 500;
    font-size: 14px;
    color: #f60;
  }

  &__pay-actions {
    flex-shrink: 0;
  }

  &__paid-badge {
    color: #bcc662;
    font-weight: 500;
    font-size: 14px;

    .mdi {
      font-size: 18px;
    }
  }

  &__pay-btn {
    border-radius: 30px !important;
    height: 42px !important;
    padding: 0 20px !important;
    font-weight: 600 !important;
    font-size: 16px !important;
    text-transform: capitalize;
  }

  // Payment info
  &__payment-info {
    font-weight: 400;
    font-size: 12px;
    color: #434343;

    b {
      font-weight: 600;
      color: #f60;
    }
  }

}
</style>