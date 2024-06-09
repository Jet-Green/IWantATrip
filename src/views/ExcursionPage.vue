<script setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import datePlugin from '../plugins/dates'
import { message } from "ant-design-vue";
import '@vuepic/vue-datepicker/dist/main.css'
import BackButton from "../components/BackButton.vue";
import BuyExcursionDates from "../components/BuyExcursionDates.vue";
import BuyExcursionDialog from "../components/BuyExcursionDialog.vue";
import _ from "lodash"
import { ref, onMounted, reactive } from "vue";

import { useRoute } from "vue-router";
import { useExcursion } from "../stores/excursion.js";
import { useAuth } from "../stores/auth";

const route = useRoute();
const _id = route.query._id;

const excursionStore = useExcursion();
const userStore = useAuth()

let excursion = ref({});
let selectedDate = ref({})
let buy = ref(false)
let open = ref(false)

let fullinfo = reactive({
  fullname: userStore.user.fullinfo?.fullname,
  phone: userStore.user.fullinfo?.phone,
  date: "",
  maxPeople: ""
})

function openBuyDialog(timeInfo) {
  if (selectedDate.value._id) return
  for (let date of excursion.value.dates) {
    for (let t of date.times) {
      if (t._id == timeInfo.time._id) {
        selectedDate.value = {
          date: date.date,
          time: timeInfo.time,
          bookingsCount: timeInfo.bookingsCount      
        }
        break
      }
    }
  }
}
function closeBuyDialog() {
  // selectedDate.value = {}
  buy.value = !buy.value
}

async function order() {
  if (!userStore.user.fullinfo?.fullname) {
      await userStore.updateFullinfo(userStore.user._id, {
        fullname:fullinfo.fullname,
        phone:fullinfo.phone
      })
    }
  let response = await excursionStore.order(fullinfo,excursion.value._id,excursion.value.name,excursion.value.author)
  Object.assign(fullinfo,{
    fullname: userStore.user.fullinfo?.fullname,
    phone: userStore.user.fullinfo?.phone,
    date: "",
    maxPeople: ""
  })
    if (response.status == 200) {
      message.config({ duration: 0.5, top: "70vh" });
      message.success({
        content: "Успешно!",
        onClose: () => {
          open.value = false
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

onMounted(async () => {
  let response = await excursionStore.getExcursionById(_id);
  excursion.value = response.data;
});
</script>
<template>
  <div style="overflow-x: hidden">
    <BackButton :backRoute="{ path: '/excursions' }" />
    <a-row class="justify-center d-flex">
      <a-spin v-if="!excursion._id" size="large"></a-spin>

      <a-col :xs="22" :xl="16" v-else>
        <h2 class="ma-0">{{ excursion.name }}</h2>
        <div>
          {{ excursion.excursionType.type }} | {{ excursion.excursionType.directionType }} | {{
      excursion.excursionType.directionPlace }}
        </div>
        <a-row :gutter="[12, 12]" class="text justify-center d-flex">
          <a-col :xs="24" :md="12">
            <a-carousel arrows dots-class="slick-dots slick-thumb">
              <!-- <template #customPaging="props">
                <a>
                  <img :src="getImg(props.i)" />
                </a>
              </template> -->
              <div v-for="(item, i) in excursion.images" :key="i">
                <img :src="item" alt="" srcset="" />
              </div>
              <template #prevArrow>
                <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
                  <span class="mdi mdi-48px mdi-chevron-left"></span>
                </div>
              </template>
              <template #nextArrow>
                <div class="custom-slick-arrow" style="right: 10px">
                  <span class="mdi mdi-48px mdi-chevron-right"></span>
                </div>
              </template>
            </a-carousel>
          </a-col>

          <a-col :xs="24" :md="12" class="pa-8">
            <div>
              Место начала: <b> {{ excursion.startPlace }}</b>
            </div>
            <div>
              Продолжительность: <b>{{ excursion.duration }}</b>
            </div>

            <!-- <div class="d-flex">
              Гиды: &nbsp
              <div v-for="guide in excursion.guides">
                <b>{{ guide.name }} </b>
              </div>
            </div> -->

            <div class="d-flex">
              Цены:&nbsp
              <div v-if="excursion.prices.length > 0">
                <div v-for="(item, index) in excursion.prices" :key="index">
                  {{ item.type }} - <b>{{ item.price }} руб</b>
                </div>
              </div>
              <div v-else>
                <b>бесплатно</b>
              </div>
            </div>
            <div>
              От <b>{{ excursion.minPeople }}</b> до <b>{{ excursion.maxPeople }} чел.</b>
            </div>
            <div>
              Мин. возраст: <b>{{ excursion.minAge }} </b>
            </div>
            <div v-if="_.isEmpty(excursion.dates)">
              Заявка за: <b>{{ excursion.deadline }} дн.</b>
            </div>
            <div>
              ОВЗ доступность: <b>
                <span v-if="excursion.availability"> доступно</span>
                <span v-else>не доступно</span>

              </b>
            </div>
          </a-col>
        </a-row>
        <a-row class="mt-16">
          <a-col :span="24">
            <div class="text"> {{ excursion.description }}</div>
          </a-col>
        </a-row>
        <a-row style="margin-top: 30px;">
          <a-col :span="24">
            <h3>Расписание</h3>
          </a-col>
          <a-col :span="24">
            <div v-if="_.isEmpty(excursion.dates)" class="month">
              По заявкам
              <div class="d-flex justify-center ma-8">
                <a-button type="primary" class="lets_go_btn" @click="open = !open">заказать</a-button>
              </div>
            </div>
            <BuyExcursionDates v-else :max-people="excursion.maxPeople" :excursionId="excursion._id" :buy="buy"
              @buy-excursion="openBuyDialog" />
            <BuyExcursionDialog :selectedDate="selectedDate" :excursion="excursion" @close="closeBuyDialog" />
          </a-col>
        </a-row>
        <a-modal v-model:open="open" :footer="null">
          <div class="mt-16 mb-16">
            <div>
              ФИО
              <a-input v-model:value="fullinfo.fullname"></a-input>
            </div>
            <div>
              Телефон
              <a-input v-model:value="fullinfo.phone"></a-input>
            </div>
            <div>
              Время экскурсии
              <VueDatePicker v-model="fullinfo.date" locale="ru-Ru" calendar-class-name="dp-custom-calendar"
                placeholder="выберите дату" calendar-cell-class-name="dp-custom-cell" cancel-text="отмена"
                select-text="выбрать" :min-date="new Date()" :enable-time-picker="false" format="dd/MM/yyyy">
                <template #input-icon>
                  <span style="font-size: 20px; color: rgba(95, 95, 95, 0.65);"
                    class="mdi mdi-calendar-outline ml-8"></span>
                </template>
              </VueDatePicker>
            </div>
            <div>
              Количество человек
              <a-input v-model:value="fullinfo.maxPeople"></a-input>
            </div>
            <div class="d-flex justify-center mt-8">
              <a-button type="primary" class="lets_go_btn"
                @click="order">Отправить</a-button>
            </div>
          </div>
        </a-modal>
      </a-col>
    </a-row>
  </div>
</template>

<style lang="scss" scoped>
.month {
  font-weight: 600;
  font-size: clamp(0.9375rem, 0.6889rem + 0.7102vw, 1.25rem);
}

// .order_container{
//   display: flex;
//   justify-content: center;
// }</style>
