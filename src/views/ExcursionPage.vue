<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import VueDatePicker from '@vuepic/vue-datepicker';
import { useShare } from '@vueuse/core'
import { message } from "ant-design-vue";
import '@vuepic/vue-datepicker/dist/main.css'
import BackButton from "../components/BackButton.vue";
import BuyExcursionDates from "../components/BuyExcursionDates.vue";
import BuyExcursionDialog from "../components/BuyExcursionDialog.vue";
import _ from "lodash"
import { useHead } from "@unhead/vue";


import { useRoute, useRouter } from "vue-router";
import { useExcursion } from "../stores/excursion.js";
import { useAuth } from "../stores/auth";
import { useGuide } from "../stores/guide";

const route = useRoute();
const router = useRouter()
const _id = route.query._id;
const API_URL = import.meta.env.VITE_API_URL

const excursionStore = useExcursion();
const userStore = useAuth()
const guideStore = useGuide()

let excursion = ref({});
let selectedDate = ref({})
let buy = ref(false)
let open = ref(false)

const backRoute = { name: 'ExcursionsPage', hash: `#${_id}` };

let fullinfo = reactive({
  fullname: "",
  phone: "",
  date: "",
  maxPeople: ""
})

let link = computed(() => {
  return API_URL + route.fullPath
})
const options = ref({
  url: link.value,
  title: excursion.value.name,

})


useHead(computed(() => ({
  title: excursion.value?.name,
  meta: [
    {
      name: "description",
      content: excursion.value?.description,
    },
    {
      property: "og:title",
      content: excursion.value?.name,
    },
    {
      name: "og:description",
      content: excursion.value?.description,
    },
    {
      name: "og:image",
      content: excursion?.value?.images,
    },

    {
      name: "og:url",
      content: `${API_URL}/excursion?_id=${excursion.value?._id}`,
    },
  ],
  link: [{ rel: "canonical", href: `${API_URL}/excursion?_id=${excursion.value?._id}` }],
})));



const { isSupported } = useShare(options)

async function startShare() {
  const { share } = useShare(options)
  return share().catch(err => {
    console.log(err);
  })
}

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
  if (!fullinfo.fullname || !fullinfo.phone || !fullinfo.date || !fullinfo.maxPeople) {
    message.config({ duration: 3, top: "70vh" });
    message.success({
      content: "Заполните все поля",
      onClose: () => {
        open.value = false
      },
    });
    return
  }


  let response = await excursionStore.order(fullinfo, excursion.value._id, excursion.value.name, excursion.value.author)
  Object.assign(fullinfo, {
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
  let guideList = []
  for (let guideId of excursion.value.guides) {
    let guide = await guideStore.getGuideById(guideId)
    guide = guide.data
    guideList.push({
      image: guide.image,
      label: guide.name + ' ' + guide.surname,
      _id: guideId
    })
  }
  excursion.value.guides = guideList

  if (userStore.isAuth) {
    fullinfo.fullname = userStore.user.fullinfo?.fullname || '',
      fullinfo.phone = userStore.user.fullinfo?.phone || ''
  }
});
</script>
<template>
  <div style="overflow-x: hidden">
    <BackButton :backRoute="backRoute" />
    <a-row class="justify-center d-flex">
      <a-spin v-if="!excursion._id" size="large"></a-spin>

      <a-col :xs="22" :xl="16" class="mb-32" v-else>
        <h2 class="ma-0">{{ excursion.name }}</h2>
        <div v-if="excursion.excursionType">
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
            <div style="float: right;">
              <span style="opacity: 0.7; cursor: pointer;" class="mdi mdi-24px mdi-share-variant-outline ma-8"
                @click="startShare()"></span>
            </div>
            <div>
              Место начала: <b> {{ excursion.startPlace }}</b>
            </div>
            <div>
              Продолжительность: <b>{{ excursion.duration }}</b>
            </div>

            <!-- <div class="d-flex">
              Гид: &nbsp
              <div v-for="guide in excursion.guides" :key="guide.index">
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
            <div>
              Гиды:
              <div class="d-flex flex-wrap">
                <a-card v-for="guide in excursion.guides" style="border: #239FCC 1px solid;" class="ma-8 pa-4 text guide_button" hoverable
                  @click="router.push(`/guide?_id=${guide._id}`)">
                  <a-avatar size="large" :src="guide.image" class="mr-16"></a-avatar>
                  <b class="mr-4">{{ guide.label }}</b>
                </a-card>
              </div>
            </div>
          </a-col>
        </a-row>
        <a-row class="mt-16">
          <a-col :span="24">
            <div class="text"> {{ excursion.description }}</div>
          </a-col>
        </a-row>
         <a-row class="mt-8">
          <a-col :span="24">
            <div>Рекомендации</div>
            <div class="text"> {{ excursion.requirements }}</div>
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

                <a-button v-if="userStore.isAuth" type="primary" class="lets_go_btn"
                  @click="open = !open">Заказать</a-button>
                <RouterLink to="/auth">
                  <a-button type="primary" class="lets_go_btn" to="/auth" v-if="!userStore.isAuth"> вход/регистрация для
                    заказа </a-button>
                </RouterLink>
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
              Дата экскурсии
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
              <a-button type="primary" class="lets_go_btn" @click="order">Отправить</a-button>

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

img {
  width: 100%;
  aspect-ratio: 270/175;
  object-fit: cover;
}

.guide_button {
  cursor: pointer;
  border: black 1px solid;
  width: fit-content;
}

// .order_container{
//   display: flex;
//   justify-content: center;
// }</style>
