<script setup>
import TinkoffLogo from '../../assets/images/tinkofflogo.svg'
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
  let result = bill.cart.reduce((accumulator, object) => {
    return accumulator + object.cost * object.count;
  }, 0)
  for (let service of bill.additionalServices) {
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

// Расчет суммы второго платежа
const getSecondPaymentAmount = (bill) => {
  if (!isTwoStagePayment(bill)) {
    return 0;
  }

  const totalAmount = billTotal(bill);
  const firstPayment = getFirstPaymentAmount(bill);
  const secondPayment = totalAmount - firstPayment;

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

  // Иначе оплачиваем второй платеж
  return getSecondPaymentAmount(bill);
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
  <a-row v-else :gutter="[8, 8]">
    <a-col :lg="8" :sm="12" :xs="24" v-for="BILL of bought">
      <div>
        <a-card hoverable class="card">
          <div class="d-flex space-between">
            <div>
              {{ BILL.tripId?.name }}
            </div>
            <b>{{ clearData(BILL?.date) }}</b>
          </div>
          <div style="color:#ff6600"><span v-if="BILL?.isWaitingList"> Лист ожидания</span></div>
          <div></div>
          <div v-for="cartItem of BILL.cart">
            <div v-if="cartItem.count">
              {{ cartItem.costType }} {{ cartItem.count }} x {{ cartItem.cost }} руб.
            </div>
          </div>

          <div v-if="BILL.seats && BILL.seats.length">
            Места: {{ BILL.seats.join(', ') }}
          </div>
          <div class="d-flex justify-end" v-if="BILL.additionalServices?.length > 0">
            {{
              BILL.cart.reduce((acc, o) => {
                return acc + o.count * o.cost
              }, 0)
            }} руб.
          </div>
          <div v-if="BILL.additionalServices?.length > 0">
            <hr>
            <div v-for="service of BILL.additionalServices">
              {{ service.name }} {{ service.count }} x {{ service.price }} руб.
            </div>
            <div class="d-flex justify-end">
              {{
                BILL.additionalServices.reduce((acc, o) => {
                  return acc + o.count * o.price
                }, 0)
              }} руб.
            </div>
            <hr>
          </div>
          <!-- Информация о программе лояльности двухэтапной оплаты -->
          <div v-if="isTwoStagePayment(BILL)" class="mb-8" style="border-top: 1px solid #f0f0f0; padding-top: 8px;">
            <div style="opacity: 0.8; font-size: 0.9em; margin-bottom: 4px;">
              Двухэтапная оплата ({{ BILL.tripId.loyalty.discount.paymentOrder }})
            </div>
            <div class="d-flex justify-end" style="font-size: 0.9em;">
              <span>Первый платеж: </span>&nbsp;
              <b>{{ getFirstPaymentAmount(BILL) }} руб.</b>
            </div>
            <div class="d-flex justify-end" style="font-size: 0.9em;">
              <span>Второй платеж: </span>&nbsp;
              <b>{{ getSecondPaymentAmount(BILL) }} руб.</b>
            </div>
          </div>

          <div class="d-flex justify-end">
            <span>Итого: </span>&nbsp;
            <b>
              {{ billTotal(BILL) }}
              руб.
            </b>

          </div>
          <div class="d-flex justify-end">
            <span>Оплачено: </span>&nbsp;
            {{ BILL.payment.amount }}
            руб.
          </div>
          <div v-for="doc in BILL.payment?.documents" class="d-flex justify-end">
            {{ doc.payDocument }} -- {{ doc.paySum }} руб.
          </div>
          <div style="display: flex; align-items: start; justify-content: space-between;">
                        <span v-if="billTotal(BILL) == BILL.payment.amount ||
                                    (isTwoStagePayment(BILL) && BILL.payment.amount >= getFirstPaymentAmount(BILL) + getSecondPaymentAmount(BILL))"
                              style="color: #bcc662">
                            <span class="mdi mdi-check-all" style="font-size: 20px"></span>
                            оплачен
                        </span>
            <span v-else-if="getRemainingPayment(BILL) > 0"
                  style="display: flex; align-items: center">
                            <div class="buy-btn">
                                <div>
                                    <a-tooltip
                                        v-if="isTwoStagePayment(BILL) && BILL.payment.amount >= getFirstPaymentAmount(BILL) && !BILL.tripId?.loyalty?.discount?.isFixed"
                                        title="Скидка ещё не зафиксирована">
                                        <a-button type="primary" class="lets_go_btn" disabled>
                                            оплатить остаток
                                        </a-button>
                                    </a-tooltip>
                                    <a-button v-else @click="buyTrip(BILL._id)" type="primary" class="lets_go_btn">
                                        <span
                                            v-if="isTwoStagePayment(BILL) && BILL.payment.amount >= getFirstPaymentAmount(BILL)">
                                            оплатить остаток
                                        </span>
                                        <span v-else>
                                            оплатить
                                        </span>
                                    </a-button>
                                </div>
                                <div class="d-flex justify-center">
                                    <img :src="TinkoffLogo" class="tinkoff-logo">
                                </div>
                            </div>
                        </span>

            <span class="mdi mdi-24px mdi-printer-outline" @click="print(BILL)"></span>


            <a-popconfirm v-if="BILL.payment.amount == 0" title="Удалить?" ok-text="Да" cancel-text="Нет"
                          @confirm="cancelTrip(BILL._id, userStore.user._id)">
              <span class="mdi mdi-24px mdi-delete" style="color: #ff6600"></span>
            </a-popconfirm>
          </div>

        </a-card>
      </div>

    </a-col>
  </a-row>
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
.buy-btn {
  display: flex;
  flex-direction: column;

  .tinkoff-logo {
    height: 20px;
    width: 90px;
  }

  img {
    -moz-user-select: -moz-none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -o-user-select: none;
    user-select: none;
  }
}
</style>