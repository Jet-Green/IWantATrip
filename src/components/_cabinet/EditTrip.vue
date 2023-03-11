<script setup>
import BackButton from "../BackButton.vue";
import ImageCropper from "../ImageCropper.vue";

import dayjs from "dayjs";

import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { watch, nextTick, ref, reactive, onMounted } from "vue";
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router'
import { useAuth } from '../../stores/auth'
import { useTrips } from "../../stores/trips.js";
import { useAppState } from "../../stores/appState";

import TripService from "../../service/TripService";

const userStore = useAuth()
const tripStore = useTrips()
const appStore = useAppState();

const dateFormatList = ["DD.MM.YYYY", "DD.MM.YY"];
const monthFormatList = ["MM.YY"];
const ruLocale = locale;
const quill = ref(null);
let newContent = "";
const description = ref(null);
const start = ref(null);
const end = ref(null);
const period = ref(null);
const delPhotoDialog = ref(false);
const targetIndex = ref(null);
const baseTimeStart = dayjs(1679492631000);
const baseTimeEnd = dayjs(1679492631000);
const baseTimePeriod = dayjs(1679492631000);
const router = useRouter();

// cropper
let visibleCropperModal = ref(false);
let previews = ref([]);
// отправляем на сервер
let images = []; // type: blob

// необходимо добавить поле количество людей в туре
let form = ref({
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
   
});

const removeCost = (item) => {
  let index = form.value.cost.indexOf(item);
  if (index !== -1) {
    form.value.cost.splice(index, 1);
  }
};

const addCost = () => {
  form.value.cost.push({
    type: "",
    price: "",
  });
};
const delPhoto = () => {
  previews.value.splice(targetIndex.value, 1);
  images.splice(targetIndex.value, 1);
  form.value.images.splice(targetIndex.value, 1);
  delPhotoDialog.value = false;
};

function submit() {
  description.value = description.value.split("<p><br></p>").join("");
  form.value.description = description.value;
  // form.value.period = dayjs(dayjs(d.period), monthFormatList)
  // for (let img of previews.value) {
  //     let isUnique = true;
  //     if (img.startsWith('blob')) {
  //         form.value.images.push(img)
  //     }
  // }
  // важно разобраться с обновлением фото. Пользователь может загрузить свои и они будут храниться в images, УЖЕ ЕСТЬ: обновляем те фото, которые есть на сервере
  TripService.updateTrip(form.value).then((res) => {
    const _id = res.data._id;
    let imagesFormData = new FormData();

        for (let i = 0; i < images.length; i++) {
            let index = i + form.value.images.length
            imagesFormData.append('trip-image', images[i], _id + '_' + index + '.img')
        }
        function close() {
            router.push('/cabinet')
        }
        if (images.length) {
            TripService.uploadTripImages(imagesFormData).then((res) => {
                message.config({ duration: 3, top: '90vh' })
                message.success({ content: 'Тур обновлён!', onClose: close })
            })
        } else {
            message.config({ duration: 3, top: '90vh' })
            message.success({ content: 'Тур обновлён!', onClose: close })
        }
    })
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

const clearData = (dataString) => {
  const dataFromString = new Date(Number(dataString));
  return dataFromString;
};

onMounted(() => {
    tripStore.getById(router.currentRoute.value.query._id)
        .then((response) => {
            let d = response.data
            delete d.__v
         
            start.value = dayjs(d.start)
            end.value = dayjs(d.end)

            form.value = d;
            for (let i of form.value.images)
                previews.value.push(i)
            quill.value.setHTML(d.description)
       
            console.log(form.value);
        })
    // .catch((error) => {
    //     console.log(error);
    // });

})

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
    form.value.duration = Math.round(result / 86400000);
  } else {
    form.value.duration = "";
  }
  form.value.start = start.value.$d.toString();
});
watch(end, () => {
  let result =
    Date.parse(JSON.parse(JSON.stringify(end.value))) -
    Date.parse(JSON.parse(JSON.stringify(start.value)));
  form.value.duration = Math.round(result / 86400000);
  if (result >= 0) {
    form.value.duration = Math.round(result / 86400000);
  } else {
    form.value.duration = "";
  }
  form.value.end = end.value.$d.toString();
});

watch(period, () => {
  form.period = Date.parse(period.value.$d.toString());
});
</script>
<template>
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="12">
        <form action="POST" @submit.prevent="submit">
          <a-row :gutter="[16, 16]">
            <a-col :span="24">
              <h2>Изменить тур</h2>
              Название
              <a-input
                placeholder="Название тура"
                size="large"
                v-model:value="form.name"
              ></a-input>
            </a-col>
            <a-col :xs="24">
              Фотографии
              <div class="d-flex" style="overflow-x: scroll">
                <img
                  v-for="(pr, i) in previews"
                  :key="i"
                  :src="pr"
                  alt=""
                  class="ma-4"
                  style="max-width: 200px"
                  @click="
                    delPhotoDialog = true;
                    targetIndex = i;
                  "
                />
              </div>
              <a-button
                type="dashed"
                block
                @click="visibleCropperModal = true"
                class="ma-8"
              >
                <span class="mdi mdi-12px mdi-plus"></span>
                Добавить фото
              </a-button>
            </a-col>

            <a-col :span="12">
              Дата начала
              <a-date-picker
                v-model:value="start"
                style="width: 100%"
                placeholder="Начало"
                :locale="ruLocale"
                :format="dateFormatList"
              />
            </a-col>
            <a-col :span="12">
              Дата конца
              <a-date-picker
                v-model:value="end"
                style="width: 100%"
                placeholder="Конец"
                :locale="ruLocale"
                :format="dateFormatList"
              />
            </a-col>
            <a-col :span="12">
              Продолжительность
              <p style="line-height: 40px">{{ form.duration }} дн.</p>
            </a-col>
            <a-col :span="12">
              Макс. число людей
              <a-input-number
                v-model:value="form.maxPeople"
                style="width: 100%"
                :min="1"
              />
            </a-col>
            <a-col :span="24">
              Цены
              <div
                v-for="item in form.cost"
                :key="item.type"
                style="display: flex"
                align="baseline"
                class="mb-16"
              >
                <a-input v-model:value="item.first" placeholder="Для кого" />

                <a-input-number
                  v-model:value="item.price"
                  style="width: 100%"
                  placeholder="Цена"
                  :min="0"
                  :step="0.01"
                  class="ml-16 mr-16"
                />

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
                                <a-select v-model:value="form.tripType" style="width: 100%" >
                                    <a-select-option v-for="value in appStore.appState[0].tripType" :value="value">{{value}}</a-select-option>
                                </a-select>
                            </div>
                        </a-col>
                        <a-col :xs="24" :md="12">Мин. возраст, лет
                            <a-input-number v-model:value="form.fromAge" style="width: 100%" placeholder="10" :min="0"
                                :max="100" />
                        </a-col>
                        <a-col :xs="24" :md="12">Направление
                            <a-input placeholder="Байкал" size="large" v-model:value="form.location"></a-input>
                        </a-col>

                        <a-col :span="24">
                            Реклама
                            <a-textarea placeholder="завлекательное описание" size="large" v-model:value="form.offer">
                            </a-textarea>
                        </a-col>
                        <a-col :span="24">
                            Маршрут
                            <a-textarea placeholder="Глазов-Пермь 300км" size="large" v-model:value="form.tripRoute">
                            </a-textarea>
                        </a-col>
                        <a-col :span="24" style="display: flex; flex-direction: column">
                            Описание программы
                            <QuillEditor theme="snow" ref="quill" v-model:content="description" contentType="html"
                                :toolbar="[
                                    // [{ header: [2, 3] }],
                                    ['bold', 'italic', 'underline'],
                                    [{ list: 'ordered' }, { list: 'bullet' }],
                                    [{ color: ['#000000', '#ff6600', '#3daff5'] }],
                                    [{ align: [] }],
                                ]" />
                        </a-col>
                        <a-col :span="24" class="d-flex justify-center">
                            <a-button class="mt-16" type="primary" size="large" html-type="submit">Отправить
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
                        <a-button class="mt-16" type="primary" size="large" @click="delPhoto">Да
                        </a-button>
                    </div>
                </a-modal>
            </a-col>
        </a-row>
    </div>
</template>
