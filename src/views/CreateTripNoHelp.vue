<script setup>
import BackButton from "../components/BackButton.vue";
import ImageCropper from "../components/ImageCropper.vue";

import { watch, nextTick, ref, reactive, onMounted, computed } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

// import typeOfTrip from "../fakeDB/tripType";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { useTrips } from "../stores/trips";
import { useAuth } from "../stores/auth";
import { useAppState } from "../stores/appState";
import { usePlaces } from "../stores/place";

import TripService from "../service/TripService";
import datePlugin from '../plugins/dates'

import dayjs from "dayjs";
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";
import 'dayjs/locale/ru';
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

dayjs.locale('ru');

const TripStore = useTrips();
const userStore = useAuth();
const appStore = useAppState();
const placesStore = usePlaces();

let places = ref([])

let formFromLocalStorage = JSON.parse(localStorage.getItem("CreatingTrip"));

const dateFormatList = ["DD.MM.YY", "DD.MM.YY"];
const ruLocale = locale;
const quill = ref(null);
let newContent = "";
const description = ref(null);
const start = ref(formFromLocalStorage?.start == null ? null : dayjs(formFromLocalStorage?.start));
const end = ref(formFromLocalStorage?.end == null ? null : dayjs(formFromLocalStorage?.end));
const delPhotoDialog = ref(false);
const targetIndex = ref(null);
const router = useRouter();
const duration = ref(null);

var author = ref()
let possibleLocations = ref([])
// cropper
let visibleCropperModal = ref(false);
let previews = ref(localStorage.getItem('createTripImages') ? JSON.parse(localStorage.getItem('createTripImages')) : []);
// отправляем на сервер
let images = localStorage.getItem('createTripImages') ? JSON.parse(localStorage.getItem('createTripImages')) : []; // type: blob
//let pdf = [];
let locationSearchRequest = ref("")
// необходимо добавить поле количество людей в туре
let form = reactive({
  name: "",
  start: null,
  end: null,
  timezoneOffset: null,
  maxPeople: null,
  duration: "",
  images: [],
  //pdf: [],
  tripRoute: "",
  distance: "",
  cost: [],
  offer: "",
  description: "",
  dayByDayDescription: [],
  tripType: "",
  fromAge: "",
  author: "",
  startLocation: null,
  bonuses: [],
  returnConditions: "",
  partner: "",
  canSellPartnerTour: null,
  includedInPrice: "",
  paidExtra: "",
  travelRequirement: "",
  tripRegion: "",
  places: [],
});
// для a-select с регионами тура
let tripRegions = computed(() => appStore.appState[0]?.tripRegions.map((name) => { return { value: name } }) ?? [])

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
const addDay = () => {
  form.dayByDayDescription.push('')
}

const removeBonuses = (item) => {
  let index = form.bonuses.indexOf(item);
  if (index !== -1) {
    form.bonuses.splice(index, 1);
  }
};
const removeDay = (index) => {
  form.dayByDayDescription.splice(index, 1);
}

const addBonuses = () => {
  form.bonuses.push({
    type: "",
    bonus: "",
  });
};

let submitCount = ref(0)
function submit() {
  submitCount.value += 1
  if (submitCount.value > 1) {
    return
  }

  const regexEmoji = /(?![*#0-9]+)[\p{Emoji}\p{Emoji_Modifier}\p{Emoji_Component}\p{Emoji_Modifier_Base}\p{Emoji_Presentation}]/gu
  const regexSpaces = /[\n\r\s\t]+/g

  form.description = description.value.replace(regexEmoji, '').replace(regexSpaces, ' ');
  form.author = author;
  let send = {};
  for (let key in form) {
    send[key] = form[key];
  }

  function close() {
    router.push("/trips");
    clearForm()
  }
  function clearForm() {
    Object.assign(form, {
      name: "",
      start: null,
      end: null,
      timezoneOffset: null,
      maxPeople: null,
      duration: "",
      images: [],
      tripRoute: "",
      distance: "",
      cost: [],
      offer: "",
      description: description.value,
      dayByDayDescription: [],
      tripType: "",
      fromAge: "",
      author: "",
      startLocation: "",
      bonuses: [],
      returnConditions: "",
      includedInPrice: "",
      paidExtra: "",
      travelRequirement: "",
      isModerated: false,
      partner: "",
      canSellPartnerTour: null,
      tripRegion: "",
      places: [],
    });
    images = [];
    // pdf = [];
    previews.value = [];
    quill.value.setHTML("");
  }
  function uploadTripImages(_id) {
    let imagesFormData = new FormData();
    for (let i = 0; i < images.length; i++) {
      imagesFormData.append(
        "trip-image",
        new File([images[i]], _id + '_' + Date.now() + "_" + i + ".jpg"),
        _id + '_' + Date.now() + "_" + i + ".jpg"
      );
    }
    TripService.uploadTripImages(imagesFormData).then(() => {
      console.log('фотографии загружены')
      localStorage.removeItem('createTripImages')
    })

  }

  function updateUser(_id) {
    userStore
      .updateUser({ email: userStore.user.email, $push: { trips: _id } })
      .then((response) => {
        userStore.user = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  form.author = userStore.user._id
  form.createdDay = Date.now()
  form.includedLocations = { type: 'GeometryCollection', geometries: [] }

  let t = userStore.user.tinkoffContract
  form.tinkoffContract = {
    ShopCode: t.shopInfo.shopCode,
    Name: t.fullName,
    Phones: t.ceo.phone,
    Inn: t.inn
  }

  TripStore.createTrip(form, userStore.user).then(async (res) => {
    if (res.status == 200) {
      const _id = res.data._id;
      await uploadTripImages(_id)
      await updateUser(_id)

      localStorage.setItem('CreatingTrip', {})
      message.config({ duration: 1.5, top: "70vh" });
      message.success({
        content: "Тур создан!", onClose: () => {
          close()
        },
      });
    }
  });

}
function addPreview(blob) {
  // imagesFormData.append("image", blob, `product-${previews.value.length}`);
  visibleCropperModal.value = false;
  images.push(blob);
  previews.value.push(URL.createObjectURL(blob));
  localStorage.setItem('createTripImages', JSON.stringify(previews.value))
}
const delPhoto = () => {
  previews.value.splice(targetIndex.value, 1);
  images.splice(targetIndex.value, 1);
  delPhotoDialog.value = false;
  localStorage.setItem('createTripImages', JSON.stringify(previews.value))
};
function selectStartLocation(selected) {
  for (let l of possibleLocations.value) {
    // l.value - name
    if (l.value == selected) {
      form.startLocation = l.location
    }
  }
}
watch(locationSearchRequest, async (newValue, oldValue) => {
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
          location: {
            name: s.value,
            shortName: '',
            type: 'Point',
            coordinates: [
              s.data.geo_lon,
              s.data.geo_lat
            ]
          }
        }

        if (s.data.settlement) {
          location.location.shortName = s.data.settlement
        }
        else if (s.data.city) {
          location.location.shortName = s.data.city
        } else {
          location.location.shortName = s.value
        }

        possibleLocations.value.push(location)
      }
    } catch (error) {
      console.log(error);
    }
  }
})
watch(description, (newValue) => {
  newContent = newValue;

  form.description = description.value;
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
  // округлить, чтобы при поиске мы точно попадали
  if (start.value) {

    let startDate = new Date(start.value.$d);
    form.timezoneOffset = startDate.getTimezoneOffset() * 60 * 1000
    startDate.setHours(0, 0, 0, 0); // Сброс времени до начала дня
    form.start = startDate.getTime(); // Преобразуем дату в число и сохраняем в form.start



    if (!end.value) {
      end.value = start.value
    }
    duration.value = ((form.end - form.start) / 86400000).toFixed(0)
  }
});
watch(form, () => {
  localStorage.setItem('CreatingTrip', JSON.stringify(form))
})
watch(end, () => {
  // округлить, чтобы при поиске мы точно попадали
  if (end.value) {
    let endDate = new Date(end.value.$d);
    endDate.setHours(23, 59, 59, 999); // Установка времени до конца дня
    form.end = endDate.getTime(); // Преобразуем дату в число и сохраняем в form.end
    if (form.start > form.end) {
      end.value = dayjs(form.start)
    }
  }
  duration.value = ((form.end - form.start) / 86400000).toFixed(0)
});

function handleImgError(i) {
  previews.value.splice(i, 1)
  images.splice(i, 1)
  localStorage.setItem('createTripImages', JSON.stringify(previews.value))
}

let formSchema = yup.object({
  name: yup.string().required("заполните поле"),
  start: yup.object().required("заполните поле"),
  end: yup.object().required("заполните поле"),
  duration: yup.string().required("заполните поле"),
  maxPeople: yup.string().required("заполните поле"),
  tripType: yup.string().required("заполните поле"),
  fromAge: yup.string().required("заполните поле"),
  offer: yup.string().required("заполните поле"),
  tripRoute: yup.string().required("заполните поле"),
  startLocation: yup.string().required("заполните поле"),
  returnConditions: yup.string().required("заполните поле"),
  notNecessarily: yup.string(),
  tripRegion: yup.string().required("заполните поле"),
  // https://vee-validate.logaretm.com/v4/examples/array-fields/
});

onMounted(async () => {
  if (localStorage.getItem('CreatingTrip')) {
    let f = JSON.parse(localStorage.getItem('CreatingTrip'))
    quill.value.setHTML(f.description);
    Object.assign(form, f)
    if (f.startLocation) {
      locationSearchRequest.value = f.startLocation.name
    }
  }
  let res = await placesStore.getForCreateTrip();

  if (res.status == 200) {
    places.value = res.data;
  }
});
</script>
<template>
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="12">
        <Form :validation-schema="formSchema" v-slot="{ meta }" @submit="submit">
          <a-row :gutter="[16, 16]">
            <a-col :span="24">
              <h2>Создать тур</h2>
              <Field name="name" v-slot="{ value, handleChange }" v-model="form.name">
                Название
                <a-input placeholder="Название тура" @update:value="handleChange" :value="value" :maxlength="50"
                  show-count></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="name" class="error-message" />
              </Transition>
            </a-col>
            <a-col :xs="24">
              Фотографии
              <div class="d-flex" style="overflow-x: scroll">
                <img v-for="(pr, i) in previews   " :key="i" :src="pr" alt="" class="ma-4" style="max-width: 200px;"
                  @click="delPhotoDialog = true;
                  targetIndex = i;" @error="handleImgError(i)" />
              </div>
              <a-button type="dashed" block @click="visibleCropperModal = true" class="ma-8">
                <span class="mdi mdi-12px mdi-plus"></span>
                Добавить фото
              </a-button>
            </a-col>

            <a-col :span="12">
              <Field name="start" v-slot="{ value, handleChange }" v-model="start">
                Дата начала
                <a-date-picker @update:value="handleChange" :value="value" style="width: 100%" placeholder="Начало"
                  :locale="ruLocale" :format="dateFormatList" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="start" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="12">
              <Field name="end" v-slot="{ value, handleChange }" v-model="end">
                Дата конца
                <a-date-picker @update:value="handleChange" :value="value" style="width: 100%" placeholder="Конец"
                  :locale="ruLocale" :format="dateFormatList" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="end" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="12">

              <Field name="duration" v-slot="{ value, handleChange }" v-model="form.duration">
                Продолжительность
                <a-input :placeholder="duration ? duration : '5 дней'" @update:value="handleChange" :value="value"
                  :maxlength="20" show-count></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="duration" class="error-message" />
              </Transition>
            </a-col>
            <a-col :span="12">
              <Field name="maxPeople" v-slot="{ value, handleChange }" v-model="form.maxPeople">
                Макс. число людей
                <a-input-number @update:value="handleChange" :value="value" style="width: 100%" type="number"
                  placeholder="11" :min="1" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="maxPeople" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="24">
              <div class="d-flex space-between ">Цены
                <a-tooltip>
                  <template #title>калькулятор</template>
                  <router-link :to="{ name: 'PriceCalc' }" target="_blank">
                    <span class="mdi mdi-calculator" style="cursor: pointer; font-size: 24px; color:#ff6600"></span>
                  </router-link>
                </a-tooltip>
              </div>


              <div v-for="   item in form.cost   " :key="item.type" style="display: flex" align="baseline"
                class="mb-16">
                <a-input v-model:value="item.first" placeholder="Для кого" />

                <a-input-number v-model:value="item.price" style="width: 100%" placeholder="Цена" type="number" :min="0"
                  :step="1" class="ml-16 mr-16" />

                <a-button @click="removeCost(item)" shape="circle">
                  <span class="mdi mdi-minus" style="cursor: pointer"></span>
                </a-button>
              </div>

              <a-button type="dashed" block @click="addCost" class="ma-8">
                <span class="mdi mdi-12px mdi-plus"></span>
                Добавить цены
              </a-button>
            </a-col>

            <a-col :span="24">

              <div v-for="   item in form.bonuses   " style="display: flex" align="baseline" class="mb-16">
                <a-input v-model:value="item.type" placeholder="Количество человек" />

                <a-input v-model:value="item.bonus" style="width: 100%" placeholder="Бонусы или скидки"
                  class="ml-16 mr-16" />

                <a-button @click="removeBonuses(item)" shape="circle">
                  <span class="mdi mdi-minus" style="cursor: pointer"></span>
                </a-button>
              </div>

              <a-button type="dashed" block @click="addBonuses" class="ma-8">
                <span class="mdi mdi-12px mdi-plus"></span>
                бонусы и скидки
              </a-button>
            </a-col>

            <a-col :xs="24" :md="12">
              <Field name="tripType" v-slot="{ value, handleChange }" v-model="form.tripType">
                Тип тура
                <div>
                  <a-select @update:value="handleChange" :value="value" style="width: 100%">
                    <a-select-option v-for="   tripType in appStore.appState[0].tripType   " :value="tripType">{{
                      tripType
                    }}</a-select-option>
                  </a-select>
                </div>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="tripType" class="error-message" />
              </Transition>
            </a-col>

            <a-col :xs="24" :md="12">
              <Field name="fromAge" v-slot="{ value, handleChange }" v-model="form.fromAge">
                Мин. возраст, лет
                <a-input-number @update:value="handleChange" :value="value" style="width: 100%" placeholder="10"
                  :min="0" :max="100" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="fromAge" class="error-message" />
              </Transition>
            </a-col>

            <a-col :xs="24">
              <Field name="startLocation" v-slot="{ value, handleChange }" v-model="locationSearchRequest">
                Место старта
                <a-auto-complete :value="value" @update:value="handleChange" style="width: 100%"
                  :options="possibleLocations" placeholder="Глазов" @select="selectStartLocation">
                </a-auto-complete>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="startLocation" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="24">
              <Field name="tripRegion" v-slot="{ value, handleChange }" v-model="form.tripRegion">
                Регион (направление) тура
                <a-select :value="value" @update:value="handleChange" style="width: 100%"
                  :options="tripRegions" placeholder="На море, Кавказ, Урал, Заполярье, Кунгурские пещеры" show-search allowClear>
                </a-select>
                <span class="text-caption">
                  *пользователь будет искать ваш тур по этому ключевому слову
                </span>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="tripRegion" class="error-message" />
              </Transition>
            </a-col>



            <a-col :span="24">
              <Field name="offer" v-slot="{ value, handleChange }" v-model="form.offer">
                Краткое описание
                <a-textarea autoSize @update:value="handleChange" :value="value"
                  placeholder="Едем в Татарстан за новыми эмоциями!" size="large">
                </a-textarea>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="offer" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="24">
              <Field name="tripRoute" v-slot="{ value, handleChange }" v-model="form.tripRoute">
                Ключевые точки:
                <a-textarea autoSize @update:value="handleChange" :value="value" placeholder="Глазов-Пермь-Кама"
                  size="large">
                </a-textarea>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="tripRoute" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="24" style="display: flex; flex-direction: column">
              Описание программы

              <QuillEditor class="ql-editor" theme="snow" ref="quill" v-model:content="description" contentType="html"
                :toolbar="[
                  ['bold', 'italic', 'underline', { color: ['#000000', '#ff6600', '#3daff5'] }],

                  [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],

                  ['link'], ['clean'] 
                ]
                  " />

            </a-col>


            <a-col :span="24">
                Место
                <a-select v-model:value="form.places" :options="places"
                style="width: 100%;"
                mode="multiple"
                :fieldNames="{
                  label: 'name',
                  value: '_id',
                }"
              ></a-select>
            </a-col>


            <a-col :span="24">
              <div>Описание программы по дням </div>

              <a-col :span="24" v-for="day, index in form.dayByDayDescription" :key="index"
                style="display: flex; flex-direction: column">

                <div><b>День {{ datePlugin.excursions.getNumeralDay(index) }}</b> <a-button @click="removeDay(index)"
                    shape="circle">
                    <span class="mdi mdi-minus"></span>
                  </a-button></div>
                <QuillEditor class="ql-editor" theme="snow" v-model:content="form.dayByDayDescription[index]"
                  contentType="html" :toolbar="[
                    ['bold', 'italic', 'underline', { color: ['#000000', '#ff6600', '#3daff5'] }],

                    [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],

                    ['link'],  ['clean']   
                  ]
                    " />
                </col>


              </a-col>
              <a-button type="dashed" block @click="addDay" class="ma-8">
                <span class="mdi mdi-12px mdi-plus"></span>
                добавить день
              </a-button>
            </a-col>

            <a-col :span="24">
              <Field name="includedInPrice" v-slot="{ value, handleChange }" v-model="form.includedInPrice">
                В стоимость включено
                <a-textarea autoSize @update:value="handleChange" :value="value" placeholder="" size="large">
                </a-textarea>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="notNecessarily" class="error-message" />
              </Transition>
            </a-col>
            <a-col :span="24">
              <Field name="paidExtra" v-slot="{ value, handleChange }" v-model="form.paidExtra">
                Дополнительно оплачивается
                <a-textarea autoSize @update:value="handleChange" :value="value" placeholder="" size="large">
                </a-textarea>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="notNecessarily" class="error-message" />
              </Transition>
            </a-col>
            <a-col :span="24">
              <Field name="travelRequirement" v-slot="{ value, handleChange }" v-model="form.travelRequirement">
                Требование к поездке
                <a-textarea autoSize @update:value="handleChange" :value="value" placeholder="" size="large">
                </a-textarea>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="notNecessarily" class="error-message" />
              </Transition>
            </a-col>


            <a-col :span="24">
              <Field name="returnConditions" v-slot="{ value, handleChange }" v-model="form.returnConditions">
                Условия возврата
                <a-textarea autoSize @update:value="handleChange" :value="value" placeholder="" size="large">
                </a-textarea>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="offer" class="error-message" />
              </Transition>
            </a-col>
            <a-col :span="24" :md="12">
              <Field name="partner" v-slot="{ value, handleChange }" v-model="form.partner">
                Партнер
                <a-textarea autoSize @update:value="handleChange" :value="value" placeholder="ООО Ромашка" size="large">
                </a-textarea>
              </Field>
            </a-col>
            <a-col :span="24" :md="12" v-if="form.partner.length">
              Принимать оплату в приложении?
              <div class="d-flex align-center justify-center" style="height:100%">
                <a-checkbox v-model:checked="form.canSellPartnerTour">{{ form.canSellPartnerTour? "ДА": "НЕТ" }}</a-checkbox>
              </div>

            </a-col>


            <a-col :span="24" class="d-flex justify-center ">
              <a-button class="lets_go_btn ma-36" type="primary" html-type="submit">Отправить
              </a-button>
            </a-col>
          </a-row>
        </Form>
        <a-modal v-model:open="visibleCropperModal" :footer="null" :destroyOnClose="true">
          <ImageCropper @addImage="addPreview" />
        </a-modal>
        <a-modal v-model:open="delPhotoDialog" :footer="null">
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
<style lang="scss" scoped>
.ql-editor {
  max-height: 500px;
  overflow-y: auto;
}
</style>