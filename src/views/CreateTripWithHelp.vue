<script setup>
import BackButton from "../components/BackButton.vue";
import UserFullInfo from "../components/forms/UserFullInfo.vue";
import { useRouter } from "vue-router";
import { reactive, ref, onMounted, watch } from "vue";
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";
import { message } from "ant-design-vue";
import BookingService from "../service/BookingService";
import { useAuth } from "../stores/auth";
import { useAppState } from "../stores/appState";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

let breakpoints = useBreakpoints(breakpointsTailwind);
let sm = breakpoints.smaller("md");


const dateFormatList = ["DD.MM.YYYY", "DD.MM.YY"];
// const monthFormatList = ["MM.YY"];
const ruLocale = locale;

let possibleLocations = ref([])

const userStore = useAuth();
const appStore = useAppState();
const router = useRouter();
let form = reactive({
  type: [],
  start: null,
  end: null,
  location: "",
  duration: "",
  adults: "",
  children: "",
  fromAge: "",
  wishes: "",

});
let userInfo = reactive({
  fullname: "",
  phone: "",
  location: ""
});

let formState = reactive({
  email: "",
  password: "",
  username: "",
});
function close() {
  router.push("/trips");
}
function clearForm() {
  form.type = []
  form.start = null
  form.end = null
  form.location = ""
  form.duration = ""
  form.adults = ""
  form.children = ""
  form.fromAge = ""
  form.wishes = ""

}

async function submit() {
  let toSend = Object.assign(form);
  toSend.start = new Date(form.start).getTime();
  toSend.end = new Date(form.end).getTime();
  toSend.creatorId = userStore.user._id

  await userStore
    .updateUser({
      email: userStore.user.email,
      fullinfo: userInfo,
    })
    .then((response) => {
      userStore.user = response.data;
    })
    .catch((err) => {
      console.log(err);
    });

  BookingService.bookingTrip(toSend).then(() => {
    message.config({ duration: 1.5, top: "70vh" });
    message.success({
      content: "Успешно!",
      onClose: () => {
        close()
        clearForm()
      },
    });
  });

  // очистить форму, сделать редирект на главную, вывести уведомление снизу об успехе
}

onMounted(() => {
  if (userStore.user.fullinfo) {
    userStore.user.fullinfo.fullname
      ? (userInfo.fullname = userStore.user.fullinfo.fullname)
      : (userInfo.fullname = "");
    userStore.user.fullinfo.phone
      ? (userInfo.phone = userStore.user.fullinfo.phone)
      : (userInfo.phone = "");
  }
});

watch(() => userInfo.location, async (newValue, oldValue) => {
  console.log('im here')
  if (newValue.trim().length > 2 && newValue.length > oldValue.length) {
    var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";

    var options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Token " + import.meta.env.VITE_DADATA_TOKEN
      },
      body: JSON.stringify({
        query: newValue,
        count: 5,
        "from_bound": { "value": "city" },
        "to_bound": { "value": "settlement" }
      })
    }

    let res = await fetch(url, options)
    try {
      let suggestions = JSON.parse(await res.text()).suggestions
      possibleLocations.value = []
      for (let s of suggestions) {
        let location = {
          value: s.value,
          geo: {
            name: s.value,
            shortName: '',
            geo_lat: s.data.geo_lat,
            geo_lon: s.data.geo_lon
          }
        }

        if (s.data.settlement) {
          location.geo.shortName = s.data.settlement
        }
        else if (s.data.city) {
          location.geo.shortName = s.data.city
        } else {
          location.geo.shortName = s.value
        }

        possibleLocations.value.push(location)
      }
    } catch (error) {
      console.log(error);
    }
  }
})
</script>
<template>
  <div>
    <BackButton />

    <img v-if="!sm" src="../assets/images/бокл.png" style="position: fixed; left: 0px; bottom: 0px;  width: 20%;" />

    <img v-if="!sm" src="../assets/images/бокп.png" style="position: fixed; right: 0px; bottom: 0px; width: 20% " />

    <form action="POST" @submit.prevent="submit" enctype="multipart/form-data">
      <a-row type="flex" justify="center">
        <a-col :xs="22" :lg="12">
          <h2>О вас</h2>
          <a-row :gutter="[16, 16]">
            <a-col :span="24" :md="12">
              Фaмилия Имя
              <a-input style="width: 100%" v-model:value="userInfo.fullname" placeholder="Иванов Иван Иванович" />
            </a-col>
            <a-col :span="24" :md="12">
              Телефон
              <a-input style="width: 100%" v-model:value="userInfo.phone" placeholder="79127528874" />
            </a-col>
            <a-col :span="24" :md="12">
              Местоположение
              <a-select v-model:value="userInfo.location" style="width: 100%" mode="multiple">
                <a-select-option v-for="(value, index) in possibleLocations" :key="index" :value="value">{{ value.geo.name
                }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="24">
              <h2>Заказать тур</h2>
              <div>
                Тип тура
                <a-select v-model:value="form.type" style="width: 100%" mode="multiple">
                  <a-select-option v-for="(value, index) in appStore.appState[0].tripType" :key="index" :value="value">{{ value
                  }}</a-select-option>
                </a-select>
              </div>
            </a-col>

            <a-col :span="12">
              Дата начала
              <a-date-picker v-model:value="form.start" style="width: 100%" placeholder="Начало" 
                :format="dateFormatList" />
            </a-col>
            <a-col :span="12">
              Дата конца
              <a-date-picker v-model:value="form.end" style="width: 100%" placeholder="Конец" 
                :format="dateFormatList" />
            </a-col>

            <a-col :xs="24" :md="12">Направление
              <a-input placeholder="Байкал" size="large" v-model:value="form.location"></a-input>
            </a-col>
            <a-col :xs="24" :md="12">
              Продолжительность, дн.
              <a-input-number id="inputNumber" v-model:value="form.duration" style="width: 100%" placeholder="5"
                :min="1" />
            </a-col>

            <a-col :xs="24" :md="8">
              Взрослые
              <a-input-number :min="0" style="width: 100%" placeholder="2" v-model:value="form.adults" />
            </a-col>
            <a-col :xs="24" :md="8">
              Дети
              <a-input-number :min="0" style="width: 100%" placeholder="1" v-model:value="form.children" />
            </a-col>
            <a-col :xs="24" :md="8">Мин. возраст, лет
              <a-input-number id="inputNumber" v-model:value="form.fromAge" style="width: 100%" placeholder="10" :min="0"
                :max="100" />
            </a-col>

            <a-col :xs="24">
              Пожелания

              <a-textarea autoSize v-model:value="form.wishes" />
            </a-col>


          </a-row>

          <a-row type="flex" justify="center">
            <a-col :xs="24" :md="16" :lg="10" class="d-flex justify-center">
              <a-button type="primary" html-type="submit" class="lets_go_btn mt-8" size="large">Отправить</a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </form>
  </div>
</template>
