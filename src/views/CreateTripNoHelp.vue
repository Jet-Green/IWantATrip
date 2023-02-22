<script setup>
import BackButton from "../components/BackButton.vue";
import ImageCropper from "../components/ImageCropper.vue";
import UserFullInfo from "../components/forms/UserFullInfo.vue";
import dayjs from 'dayjs'

import axios from 'axios'

import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { watch, nextTick, ref, reactive, onMounted } from "vue";
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";
import typeOfTrip from "../fakeDB/tripType";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { useAuth } from "../stores/auth";
import { useTrips } from "../stores/trips";
import TripService from "../service/TripService";
import { refAutoReset } from "@vueuse/core";

const tripStore = useTrips()
const userStore = useAuth();

const dateFormatList = ["DD.MM.YY", "DD.MM.YY"];
const monthFormatList = ["MM.YY"];
const ruLocale = locale;
const quill = ref(null);
let newContent = "";
const formRef = ref(null);
const description = ref(null);
const start = ref(null);
const end = ref(null);
const delPhotoDialog = ref(false);
const targetIndex = ref(null);

const router = useRouter();

// cropper
let visibleCropperModal = ref(false);
let previews = ref([]);
// отправляем на сервер
let images = []; // type: blob

// необходимо добавить поле количество людей в туре
let form = reactive({
  name: "",
  start: null,
  end: null,
  maxPeople: null,
  duration: "",
  images: [],
  tripRoute: "",
  distance: "",
  cost: [],
  offer: "",
  description: description.value,
  location: "",
  tripType: "",
  fromAge: "",
  period: "",
});
let fullUserInfo = null;

const removeCost = (item) => {
  let index = form.cost.indexOf(item);
  if (index !== -1) {
    form.cost.splice(index, 1);
  }
};

const addCost = () => {
  form.cost.push({
    type: "",
    price: "",
  });
};
function goToPriceCalc() {
  router.push("/calc");
}
const delPhoto = () => {
  previews.value.splice(targetIndex.value, 1);
  images.splice(targetIndex.value, 1);
  delPhotoDialog.value = false;
};
function submit() {
  description.value = description.value.split("<p><br></p>").join("");
  form.description = description.value;

  let send = {};
  for (let key in form) {
    send[key] = form[key];
  }
  let m = send.period.month().toString();
  let month = m.length == 1 ? "0" + m : m;
  send.period = month + "." + send.period.year().toString().slice(2);

  TripService.createTrip(form).then(async (res) => {
    const _id = res.data._id;
    // try {
    //   // что тут происходит?
    //   await axios.post(`http://localhost:4089/create-trip?_id=${_id}`)
    // } catch (error) {
    //   console.log(error);
    // }

    let imagesFormData = new FormData();
    for (let i = 0; i < images.length; i++) {
      imagesFormData.append("trip-image", new File([images[i]], _id + "_" + i + ".png"), _id + "_" + i + ".png");
    }
    function close() {
      router.push("/trips");
    }
    TripService.uploadTripImages(imagesFormData).then((res) => {
      Object.assign(form, {
        name: "",
        start: null,
        end: null,
        maxPeople: null,
        duration: "",
        images: [],
        tripRoute: "",
        distance: "",
        cost: [],
        offer: "",
        description: description.value,
        location: "",
        tripType: "",
        fromAge: "",
        period: "",
      });
      if (fullUserInfo) {
        userStore
          .updateUser({
            email: userStore.user.email,
            fullinfo: fullUserInfo,
            $push: { trips: _id },
          })
          .then((response) => {
            userStore.user = response.data;
            images = [];
            previews.value = [];
            quill.value.setHTML("");
            message.config({ duration: 3, top: "90vh" });
            message.success({ content: "Тур создан!", onClose: close });
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        userStore
          .updateUser({ email: userStore.user.email, $push: { trips: _id } })
          .then((response) => {
            userStore.user = response.data;
            images = [];
            previews.value = [];
            quill.value.setHTML("");
            message.config({ duration: 3, top: "90vh" });
            message.success({ content: "Тур создан!", onClose: close });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  });
  // необходимо отчистить форму и сделать редирект на tripList, вывести уведомление снизу об успехе
}

function addPreview(blob) {
  // imagesFormData.append("image", blob, `product-${previews.value.length}`);
  visibleCropperModal.value = false;
  images.push(blob);
  previews.value.push(URL.createObjectURL(blob));
}
function updateUserInfo(info) {
  fullUserInfo = info;
}
watch(description, (newValue) => {
  newContent = newValue;
  if (newContent === newValue) return;
  quill.value.setHTML(newValue);
  // Workaround https://github.com/vueup/vue-quill/issues/52
  // move cursor to end
  nextTick(() => {
    let q = quill.value.getQuill();
    q.setSelection(newValue.length, 0, "api");
    q.focus();
  });
});

watch(start, () => {
  let result =
    Number(JSON.parse(JSON.stringify(end.value))) -
    Number(JSON.parse(JSON.stringify(start.value)));

  if (result >= 0) {
    form.duration = Math.round(result / 86400000);
  } else {
    form.duration = "";
  }
  form.start = Date.parse(start.value.$d.toString());
});
watch(end, () => {
  let result =
    Date.parse(JSON.parse(JSON.stringify(end.value))) -
    Date.parse(JSON.parse(JSON.stringify(start.value)));
  form.duration = Math.round(result / 86400000);
  if (result >= 0) {
    form.duration = Math.round(result / 86400000);
  } else {
    form.duration = "";
  }
  form.end = Date.parse(end.value.$d.toString());
});
onMounted(() => {
  if (router.currentRoute.value.query._id) {
    tripStore.getById(router.currentRoute.value.query._id).then((response) => {
      let d = response.data;
      delete d.__v;
      form.name = d.name
      form.start = d.start
      form.end = d.end
      form.maxPeople = d.maxPeople
      form.duration = d.duration
      form.tripType = d.tripType
      form.distance = d.distance
      form.cost = d.cost
      quill.value.setHTML(d.description);
      form.location = d.location
      form.fromAge = d.fromAge
      form.period = d.period

      // form.tripRoute = d.tripRoute
      //   form.offer = d.offer

      let ad = document.getElementById("ad")
      let route = document.getElementById("route")
      ad.value = d.tripRoute
      route.value = d.offer

      // console.log(d.offer);

    });
    // .catch((error) => {
    //     console.log(error);
    // });
  }
});
</script>
<template>
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="12">
        <form action="POST" @submit.prevent="submit">
          <a-row :gutter="[16, 16]">
            <a-col v-if="!userStore.user?.fullinfo" :span="24">
              <UserFullInfo @fullInfo="updateUserInfo" />
            </a-col>
            <a-col :span="24">
              <h2>Создать тур</h2>
              Название
              <a-input placeholder="Название тура" size="large" v-model:value="form.name"></a-input>
            </a-col>
            <a-col :xs="24">
              Фотографии
              <div class="d-flex" style="overflow-x: scroll">
                <img v-for="(pr, i) in previews" :key="i" :src="pr" alt="" class="ma-4" style="max-width: 200px" @click="
  delPhotoDialog = true;
targetIndex = i;
                " />
              </div>
              <a-button type="dashed" block @click="visibleCropperModal = true" class="ma-8">
                <span class="mdi mdi-12px mdi-plus"></span>
                Добавить фото
              </a-button>
            </a-col>

            <a-col :span="12">
              Дата начала
              <a-date-picker v-model:value="start" style="width: 100%" placeholder="Начало" :locale="ruLocale"
                :format="dateFormatList" />
            </a-col>
            <a-col :span="12">
              Дата конца
              <a-date-picker v-model:value="end" style="width: 100%" placeholder="Конец" :locale="ruLocale"
                :format="dateFormatList" />
            </a-col>
            <a-col :span="12">
              Продолжительность
              <p style="line-height: 40px">{{ form.duration }} дн.</p>
            </a-col>
            <a-col :span="12">
              Макс. число людей
              <a-input-number v-model:value="form.maxPeople" style="width: 100%" placeholder="11" :min="1" />
            </a-col>
            <a-col :span="24">
              Цены

              <div v-for="item in form.cost" :key="item.type" style="display: flex" align="baseline" class="mb-16">
                <a-input v-model:value="item.first" placeholder="Для кого" />

                <a-input-number v-model:value="item.price" style="width: 100%" placeholder="Цена" :min="0" :step="0.01"
                  class="ml-16 mr-16" />

                <a-button @click="removeCost(item)" shape="circle">
                  <span class="mdi mdi-minus" style="cursor: pointer"></span>
                </a-button>
              </div>

              <a-button type="dashed" block @click="addCost" class="ma-8">
                <span class="mdi mdi-12px mdi-plus"></span>
                Добавить цены
              </a-button>
            </a-col>
            <a-col :xs="24" :md="12">Тип тура
              <div>
                <a-select v-model:value="form.tripType" style="width: 100%" :options="typeOfTrip">
                </a-select>
              </div>
            </a-col>
            <a-col :xs="24" :md="12">Мин. возраст, лет
              <a-input-number v-model:value="form.fromAge" style="width: 100%" placeholder="10" :min="0" :max="100" />
            </a-col>
            <a-col :xs="24" :md="12">Направление
              <a-input placeholder="Байкал" size="large" v-model:value="form.location"></a-input>
            </a-col>

            <a-col :xs="24" :md="12">Период
              <a-date-picker v-model:value="form.period" style="width: 100%; height: 40px" picker="month"
                :locale="ruLocale" :format="monthFormatList" />
            </a-col>
            <a-col :span="24">
              Реклама
              <a-textarea placeholder="завлекательное описание" size="large" v-model:value="form.offer" id="ad">

              </a-textarea>
            </a-col>
            <a-col :span="24">
              Маршрут
              <a-textarea placeholder="Глазов-Пермь 300км" size="large" v-model:value="form.tripRoute" id="route">
              </a-textarea>
            </a-col>
            <a-col :span="24" style="display: flex; flex-direction: column">
              Описание программы
              <QuillEditor theme="snow" ref="quill" v-model:content="description" contentType="html" :toolbar="[
                // [{ header: [2, 3] }],
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ color: ['#000000', '#ff6600', '#3daff5'] }],
                [{ align: [] }],
              ]" />
            </a-col>
            <a-col :span="24" class="d-flex justify-center">
              <a-button class="lets_go_btn mt-8" type="primary" size="large" html-type="submit">Отправить
              </a-button>
            </a-col>
          </a-row>
        </form>
        <a-modal v-model:visible="visibleCropperModal" :footer="null">
          <ImageCropper @addImage="addPreview" />
        </a-modal>
        <a-modal v-model:visible="delPhotoDialog" :footer="null">
          <h3>Удалить фото?</h3>
          <div class="d-flex justify-center">
            <a-button class="mt-16" type="primary"  size="large" @click="delPhoto">Да
            </a-button>
          </div>
        </a-modal>
      </a-col>
    </a-row>
  </div>
</template>