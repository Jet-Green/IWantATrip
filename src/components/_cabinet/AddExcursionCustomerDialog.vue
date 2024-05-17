<script setup>
import { ref, toRefs, watch, onMounted, reactive } from "vue"
import _ from "lodash"
import datePlugin from '../../plugins/dates'
import { useExcursion } from "../../stores/excursion";
import { message } from "ant-design-vue";

const excursionStore = useExcursion()

let props = defineProps({
  selectedDate: Object,
  excursion: Object,
})
const emit = defineEmits(['close'])

let fullinfo = reactive({
  fullname: "",
  phone: ""
})

let open = ref(false)

let { selectedDate } = toRefs(props)

let prettyDate = ref()
let prettyTime = ref()
watch(selectedDate, (newValue) => {
  if (!_.isEmpty(newValue)) {
    open.value = true
    prettyDate.value = datePlugin.excursions.getPrettyDate(newValue.date)
    let tmpTime = newValue.time.hours + ':'
    if (newValue.time.minutes < 10) {
      tmpTime += '0' + newValue.time.minutes
    } else {
      tmpTime += newValue.time.minutes
    }
    prettyTime.value = tmpTime
  }
})
let pricesForm = ref([])
async function buy() {
  let toSend = []
  // pricesForm.value
  for (let p of pricesForm.value) {

    if (p.count > 0) {
      toSend.push({
        type: p.type,
        price: p.price,
        count: p.count
      })
    }
  }
  let res = await excursionStore.buyFromCabinet(selectedDate.value.time._id, toSend, fullinfo)
  if (res.status == 200) {
    message.config({ duration: 0.5, top: "70vh" });
    message.success({
      content: "Успешно!",
      onClose: () => {
        open.value = false
        emit('close')
      },
    });
  } else {
    message.config({ duration: 0.5, top: "70vh" });
    message.error({
      content: "Ошибка покупки!",
      onClose: () => {
        console.log(res);
      },
    });
  }
}
let bookingCount = ref()
async function book() {
  if (bookingCount.value > 0) {
    let response = await excursionStore.bookFromCabinet(bookingCount.value, selectedDate.value.time._id, props.excursion._id, fullinfo)
    if (response.status == 200) {
      message.config({ duration: 0.5, top: "70vh" });
      message.success({
        content: "Успешно!",
        onClose: () => {
          open.value = false
          emit('close')
        },
      });
    } else {
      message.config({ duration: 0.5, top: "70vh" });
      message.error({
        content: "Ошибка заказа!",
        onClose: () => {
          console.log(response);
        },
      });
    }
  }
}

onMounted(() => {
  let result = []
  if (props.excursion.prices) {
    for (let p of props.excursion.prices) {
      result.push({
        count: 0,
        price: p.price,
        type: p.type,
      })
    }
  }
  pricesForm.value = result
})
</script>
<template>
  <a-modal v-model:open="open" @cancel="emit('close')" :footer="null">
    <div class="mt-16 mb-16">
      <div>
        ФИО
        <a-input v-model:value="fullinfo.fullname"></a-input>
      </div>
      <div>
        Телефон
        <a-input v-model:value="fullinfo.phone"></a-input>
      </div>
    </div>
    <div class="date">
      <div class="d-flex">
        <div class="large-date">
          {{ prettyDate.day }}
        </div>
        <div class="column">
          <div class="month">{{ prettyDate.month }}</div>
          <div class="weekday">{{ prettyDate.weekday }}</div>
        </div>
      </div>
      <div class="name">
        {{ excursion.name }}
      </div>
    </div>
    <div style="display: flex; justify-content: space-between">
      <div class="large-date">
        {{ prettyTime }}
      </div>
      <div class="d-flex align-center" style="justify-content: end;" v-if="pricesForm.length == 0">
        <a-input-number v-model:value="bookingCount" :min="0" :max="excursion.maxPeople" :controls="false"
          class="ml-8 mr-8">
        </a-input-number> чел.
      </div>
    </div>
    <div v-for="price of pricesForm">
      <div class="price-container">
        <div class="price">{{ price.type }} x <span style="color: #ff6600;">{{ price.price }}₽</span></div>
        <div>
          <a-input-number v-model:value="price.count" :min="0"
           
            :max="excursion.maxPeople" :controls="false">
          </a-input-number>
        </div>
      </div>
    </div>
    <div class="d-flex justify-center">
      <a-button type="primary" class="lets_go_btn" @click="book" v-if="pricesForm.length == 0">заказать</a-button>
    </div>

    <div class="d-flex justify-center mt-16">
      <a-button type="primary" class="lets_go_btn" @click="buy" v-if="pricesForm.length > 0">заказать</a-button>
    </div>
  </a-modal>
</template>
<style scoped lang="scss">
.large-date {
  font-weight: 600;
  font-size: clamp(1.875rem, 1.3778rem + 1.4205vw, 2.5rem);
}

.date {
  display: flex;
  justify-content: space-between;

  .time {
    font-weight: 600;
    font-size: clamp(0.75rem, 0.6009rem + 0.4261vw, 0.9375rem);
  }

  .time-container {
    min-width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.name {
  font-weight: 600;
  font-size: clamp(0.9375rem, 0.6889rem + 0.7102vw, 1.25rem);
  width: 100%;
  text-align: center;
  margin-top: 20px;
  color: #ff6600;
}

.column {
  flex-direction: column;
  margin-left: 4px;

  .month {
    font-weight: 600;
    font-size: clamp(0.9375rem, 0.6889rem + 0.7102vw, 1.25rem);
  }

  .weekday {
    font-weight: 300;
    font-size: clamp(0.625rem, 0.4261rem + 0.5682vw, 0.875rem);
  }
}

.price-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;

  .price {
    font-weight: 600;
    font-size: clamp(0.875rem, 0.6761rem + 0.5682vw, 1.125rem);
  }
}
</style>