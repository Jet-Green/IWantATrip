<script setup>
import { computed, onMounted, ref } from "vue"
import { useRoute, useRouter } from 'vue-router';
import { useExcursion } from '../../stores/excursion';
import datePlugin from '../../plugins/dates'
import { message } from "ant-design-vue";
import ExcursionService from "../../service/ExcursionService";

const excursionStore = useExcursion()
const route = useRoute()
const router = useRouter()
const _id = route.query._id

let excursion = ref({})
let invoiceModalOpen = ref(false)
let invoiceTime = ref(null)
let updateExcursion = async (_id) => {
  const response = await excursionStore.getExcursionBillsById(_id)

  excursion.value = response.data

}

const isPaidExcursion = computed(() => (excursion.value?.prices?.length ?? 0) > 0)
const minPeople = computed(() => Number(excursion.value?.minPeople || 0))
const invoicePeopleCount = computed(() => getPeopleCount(invoiceTime.value?.bills))
const invoiceIsMinPeopleReached = computed(
  () => invoicePeopleCount.value >= minPeople.value
)

function getDate(dateObj) {
  return datePlugin.excursions.getPrettyDate(dateObj)
}
function getTime(timeObj) {
  let result = timeObj.hours + ':'
  if (timeObj.minutes < 10) {
    result += '0' + timeObj.minutes
  } else {
    result += timeObj.minutes
  }
  return result
}
function getBillsSum(bills) {
  let sum = 0
  for (let b of bills) {
    for (let p of b.cart) {
      sum += p.price * p.count
    }
  }
  return sum
}
function getPeopleCount(bills) {
  if (!Array.isArray(bills)) return 0
  let sum = 0
  for (let b of bills) {
    for (let p of b.cart) {
      sum += p.count
    }
  }
  return sum
}

const shouldShowInvoiceAllForTime = computed(() => isPaidExcursion.value)

function canInvoiceAllForTime(time) {
  if (!shouldShowInvoiceAllForTime.value) return false
  return getPeopleCount(time?.bills) >= minPeople.value
}

function isInvoiceAlreadyIssued(time) {
  if (!Array.isArray(time?.bills) || time.bills.length === 0) return false
  return time.bills.some((b) => b?.needPay)
}

function invoiceRemainingCount(time) {
  const have = getPeopleCount(time?.bills)
  return Math.max(0, minPeople.value - have)
}

function openInvoiceModal(time) {
  invoiceTime.value = time
  invoiceModalOpen.value = true
}

function closeInvoiceModal() {
  invoiceModalOpen.value = false
  invoiceTime.value = null
}

function submitInvoice() {
  message.config({ duration: 3, top: "70vh" });
  if (!invoiceTime.value?._id) return

  ExcursionService.issueInvoices(invoiceTime.value._id)
    .then(async (res) => {
      if (res?.status === 200) {
        const status = res.data?.status
        if (status === 'already') {
          message.info({
            content: "Счет уже был выставлен ранее (письма повторно не отправлялись).",
            onClose: () => closeInvoiceModal(),
          });
        } else {
          message.success({
            content: "Счет выставлен. Участникам отправлены письма с оплатой.",
            onClose: () => closeInvoiceModal(),
          });
        }
        await updateExcursion(_id)
      }
    })
    .catch(() => {
      // errors already handled by axios interceptor
    })
}
onMounted(async () => {
  updateExcursion(_id)
})
</script>

<template>
  <a-breadcrumb class="mb-16">
    <a-breadcrumb-item @click="router.push('/cabinet/excursions')" style="cursor: pointer;">
      К экскурсиям
    </a-breadcrumb-item>
    <a-breadcrumb-item style="cursor: pointer;">даты, время, покупатели</a-breadcrumb-item>
  </a-breadcrumb>
  <h3 class="mt-8 mb-8">Информация о <span style="color: #ff6600;">{{ excursion.name }}</span></h3>
  <a-row v-if="excursion?.dates?.length > 0">
    <a-col :span="24" v-for="(date, index) in excursion.dates">
      <div class="date">
        <a-col class="d-flex" :xs="6" :md="4">
          <div class="large-date">
            {{ getDate(date.date).day }}

          </div>
          <div class="column">
            <div class="month">{{ getDate(date.date).month }}</div>
            <div class="weekday">{{ getDate(date.date).weekday }}</div>
          </div>
        </a-col>
        <a-col :xs="18" :md="20" class="d-flex" style="gap: 10px 20px; flex-wrap: wrap;">
          <a-col v-for="time in date.times" class="time-container">
            <div class="time-card"
              @click="router.push(`/cabinet/excursion-customers?excursion_id=${excursion._id}&time_id=${time._id}&date=${getDate(date.date).day + '_' + getDate(date.date).month + '_' + getDate(date.date).weekday}`)">
              <a-tooltip title="Подробнее">
                <a-button type="text" shape="circle" class="details-btn"
                  @click.stop="router.push(`/cabinet/excursion-customers?excursion_id=${excursion._id}&time_id=${time._id}&date=${getDate(date.date).day + '_' + getDate(date.date).month + '_' + getDate(date.date).weekday}`)">
                  <span class="mdi mdi-information-outline"></span>
                </a-button>
              </a-tooltip>
              <div class="row">
                <span class="mdi mdi-clock-outline mr-4 icon"></span>
                <b>
                  {{ getTime(time) }}
                </b>
              </div>
              <div class="row">
                <span class="mdi mdi-account-multiple-outline mr-4 icon"></span>
                <b>{{ getPeopleCount(time.bills) }}</b>&nbsp;чел.
              </div>
              <div class="row">
                <span class="mdi mdi-cash-multiple mr-4 icon"></span>
                <b>{{ getBillsSum(time.bills) }}₽</b>
              </div>
              <div class="d-flex justify-center mt-8" v-if="shouldShowInvoiceAllForTime">
                <a-button
                  v-if="isInvoiceAlreadyIssued(time)"
                  type="primary"
                  size="small"
                  class="lets_go_btn invoice-issued-btn"
                  disabled
                >
                  счет выставлен
                </a-button>
                <a-button
                  v-else
                  type="primary"
                  size="small"
                  class="lets_go_btn"
                  @click.stop="openInvoiceModal(time)"
                >
                  выставить счет
                  <span class="mdi mdi-chevron-right ml-8"></span>
                </a-button>
              </div>
              <div v-if="shouldShowInvoiceAllForTime && !canInvoiceAllForTime(time)" class="d-flex justify-center mt-4"
                style="font-size: 12px; color: rgba(0,0,0,0.55);">
                Нужно ещё {{ invoiceRemainingCount(time) }} чел. до минимального порога
              </div>
            </div>
          </a-col>
        </a-col>
      </div>
      <a-divider />
    </a-col>
  </a-row>

  <a-modal
    v-model:open="invoiceModalOpen"
    title="Выставить счет"
    ok-text="Выставить"
    cancel-text="Отмена"
    :ok-button-props="{ class: 'lets_go_btn' }"
    :cancel-button-props="{ class: 'btn_light' }"
    @ok="submitInvoice"
    @cancel="closeInvoiceModal"
  >
    <div v-if="invoiceTime">
      <div class="mb-8">
        <b>Время:</b> {{ getTime(invoiceTime) }}
      </div>
      <div class="mb-8">
        <b>Записалось:</b> {{ invoicePeopleCount }} чел. (минимум: {{ minPeople }})
      </div>

      <div v-if="!invoiceIsMinPeopleReached" style="color: #faad14;">
        Пороговое количество людей ещё не набрано — счет можно подготовить заранее, но оплатить смогут после набора
        минимума.
      </div>
      <div v-else style="color: rgba(0,0,0,0.75);">
        Всё готово — пороговое количество человек набралось
      </div>
    </div>
  </a-modal>
</template>
<style lang="scss" scoped>
.date {
  display: flex;
  align-items: center;

  .large-date {
    font-weight: 600;
    font-size: clamp(1.875rem, 1.3778rem + 1.4205vw, 2.5rem);
  }

  .time {
    font-weight: 600;
    font-size: clamp(0.75rem, 0.6009rem + 0.4261vw, 0.9375rem);
  }

  .time-container {
    display: flex;
    align-items: center;
    justify-content: center;

    .time-card {
      border: 1px solid #E0E0E0;
      border-radius: 12px;
      padding: 8px 12px;
      cursor: pointer;
      position: relative;

      .icon {
        font-size: 18px;
      }

      .row {
        display: flex;
        align-items: center;
      }
    }
  }
}

.details-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  color: rgba(0, 0, 0, 0.55);
}

.details-btn :deep(.mdi) {
  font-size: 18px;
}

.invoice-issued-btn {
  background: #52c41a !important;
  border-color: #52c41a !important;
  color: #fff !important;
  cursor: default !important;
  pointer-events: none;
}

.column {
  flex-direction: column;

  .month {
    font-weight: 600;
    font-size: clamp(0.9375rem, 0.6889rem + 0.7102vw, 1.25rem);
  }

  .weekday {
    font-weight: 300;
    font-size: clamp(0.625rem, 0.4261rem + 0.5682vw, 0.875rem);
  }
}
</style>