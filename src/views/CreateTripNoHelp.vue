<script setup>
import BackButton from "../components/BackButton.vue";
import ImageCropper from "../components/ImageCropper.vue";
import PriceCalc from '../components/_calculator/PriceCalc.vue'

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
const priceCalcRef = ref(null);

const LOYALTY_TYPE = {
  DISCOUNT: 'discount',
  FREE_SERVICES: 'free_services',
};

const PAYMENT_ORDER = {
  TWENTY_EIGHTY: '20/80',
  THIRTY_SEVENTY: '30/70',
  FORTY_SIXTY: '40/60',
  HALF: '50/50',
  SIXTY_FORTY: '60/40',
  SEVENTY_THIRTY: '70/30',
  EIGHTY_TWENTY: '80/20',
};

const PAYMENT_ORDER_VALUES = Object.values(PAYMENT_ORDER);

const paymentOrderOptions = [
  { value: PAYMENT_ORDER.TWENTY_EIGHTY, label: '20 / 80' },
  { value: PAYMENT_ORDER.THIRTY_SEVENTY, label: '30 / 70' },
  { value: PAYMENT_ORDER.FORTY_SIXTY, label: '40 / 60' },
  { value: PAYMENT_ORDER.HALF, label: '50 / 50' },
  { value: PAYMENT_ORDER.SIXTY_FORTY, label: '60 / 40' },
  { value: PAYMENT_ORDER.SEVENTY_THIRTY, label: '70 / 30' },
  { value: PAYMENT_ORDER.EIGHTY_TWENTY, label: '80 / 20' },
];

function getDefaultLoyalty() {
  return {
    enabled: false,
    type: LOYALTY_TYPE.DISCOUNT,
    discount: {
      minProfit: null,
      fixationDay: null,
      baseDiscountPercent: null,
      paymentOrder: PAYMENT_ORDER.HALF,
    },
    freeServices: {
      levels: [
        {
          peopleCount: null,
          service: '',
        },
      ],
    },
  };
}

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
  loyalty: getDefaultLoyalty(),
});
// для a-select с регионами тура
let tripRegions = computed(() => appStore.appState[0]?.tripRegions.map((name) => { return { value: name } }) ?? [])
const hasPartner = computed(() => String(form.partner || '').trim().length > 0);
const canEnableLoyalty = computed(() => !hasPartner.value || Boolean(form.canSellPartnerTour));

const daysToTripStart = computed(() => {
  return getDaysToTripStart(form.start);
});

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

const addLoyaltyFreeService = () => {
  form.loyalty.freeServices.levels.push({
    peopleCount: null,
    service: '',
  });
};

const removeLoyaltyFreeService = (item) => {
  if (form.loyalty.freeServices.levels.length <= 1) {
    return;
  }
  let index = form.loyalty.freeServices.levels.indexOf(item);
  if (index !== -1) {
    form.loyalty.freeServices.levels.splice(index, 1);
  }
};

function normalizePaymentOrder(value) {
  return PAYMENT_ORDER_VALUES.includes(value) ? value : PAYMENT_ORDER.HALF;
}

function toNumberOrNull(value) {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function getDaysToTripStart(startTimestamp) {
  if (!startTimestamp) {
    return null;
  }

  let today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((Number(startTimestamp) - today.getTime()) / 86400000));
}

function normalizeLoyalty(loyaltyInput = {}, startTimestamp = null) {
  const loyalty = getDefaultLoyalty();
  loyalty.enabled = Boolean(loyaltyInput.enabled);
  loyalty.type = loyaltyInput.type === LOYALTY_TYPE.FREE_SERVICES ? LOYALTY_TYPE.FREE_SERVICES : LOYALTY_TYPE.DISCOUNT;

  if (!loyalty.enabled) {
    return loyalty;
  }

  if (loyalty.type === LOYALTY_TYPE.DISCOUNT) {
    const daysLimit = getDaysToTripStart(startTimestamp);
    const minProfit = toNumberOrNull(loyaltyInput.discount?.minProfit);
    const fixationDay = toNumberOrNull(loyaltyInput.discount?.fixationDay);
    const baseDiscountPercent = toNumberOrNull(loyaltyInput.discount?.baseDiscountPercent);
    const paymentOrder = normalizePaymentOrder(loyaltyInput.discount?.paymentOrder);

    loyalty.discount.minProfit = minProfit === null ? null : Math.max(0, minProfit);
    loyalty.discount.paymentOrder = paymentOrder;

    if (fixationDay !== null) {
      let normalizedFixationDay = Math.max(1, fixationDay);
      if (daysLimit !== null && daysLimit > 0) {
        normalizedFixationDay = Math.min(normalizedFixationDay, daysLimit);
      }
      loyalty.discount.fixationDay = normalizedFixationDay;
    }

    if (baseDiscountPercent !== null) {
      loyalty.discount.baseDiscountPercent = Math.min(100, Math.max(0, baseDiscountPercent));
    }

    loyalty.freeServices = {
      levels: [],
    };
    return loyalty;
  }

  const levels = Array.isArray(loyaltyInput.freeServices?.levels) ? loyaltyInput.freeServices.levels : [];
  loyalty.freeServices.levels = levels
    .map((item) => ({
      peopleCount: toNumberOrNull(item?.peopleCount),
      service: String(item?.service || item?.giftService || '').trim(),
    }))
    .filter((item) => item.peopleCount && item.peopleCount > 0 && item.service);

  loyalty.discount = {
    minProfit: null,
    fixationDay: null,
    baseDiscountPercent: null,
    paymentOrder: PAYMENT_ORDER.HALF,
  };

  return loyalty;
}

function validateLoyaltyBeforeSubmit(loyalty) {
  if (!loyalty.enabled) {
    return true;
  }

  if (loyalty.type === LOYALTY_TYPE.DISCOUNT) {
    if (loyalty.discount.minProfit === null) {
      message.error({ content: "Укажите минимальную прибыль для программы лояльности" });
      return false;
    }
    if (loyalty.discount.fixationDay === null) {
      message.error({ content: "Укажите крайний день фиксации скидки" });
      return false;
    }
    return true;
  }

  if (loyalty.type === LOYALTY_TYPE.FREE_SERVICES && loyalty.freeServices.levels.length === 0) {
    message.error({ content: "Добавьте хотя бы одну услугу" });
    return false;
  }

  return true;
}

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
      startLocation: null,
      bonuses: [],
      // returnConditions: "",
      // includedInPrice: "",
      // paidExtra: "",
      // travelRequirement: "",
      isModerated: false,
      partner: "",
      canSellPartnerTour: null,
      tripRegion: "",
      places: [],
      loyalty: getDefaultLoyalty(),
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
  form.loyalty = normalizeLoyalty(form.loyalty, form.start)
  if (!validateLoyaltyBeforeSubmit(form.loyalty)) {
    submitCount.value -= 1
    return
  }

  // Привязать данные калькулятора при активной скидочной лояльности
  if (form.loyalty.enabled && form.loyalty.type === LOYALTY_TYPE.DISCOUNT && priceCalcRef.value?.form) {
    const calcForm = priceCalcRef.value.form
    form.calculatorData = {
      name: calcForm.name,
      max: calcForm.max,
      tourists: calcForm.tourists,
      individualCost: calcForm.individualCost,
      groupCost: calcForm.groupCost,
      transportCost: calcForm.transportCost,
      tourePrice: calcForm.tourePrice,
      commissionState: calcForm.commissionState,
      profitabilityPlan: calcForm.profitabilityPlan,
      profitPlan: calcForm.profitPlan,
    }
  }

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
const handlePlacesSearch = async (val) => {

  if (val.length > 2) {
    try {
      const res = await placesStore.getForCreateTrip(val)
      if (res.status === 200) {
        places.value = res.data
      }
    } catch (e) {
      console.error('Ошибка при загрузке мест:', e)
    }
  } else {
    places.value = []
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
watch(canEnableLoyalty, (allowed) => {
  if (!allowed && form.loyalty.enabled) {
    form.loyalty.enabled = false;
  }
}, { immediate: true });
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
  // startLocation: yup.string().required("заполните поле"),
  // returnConditions: yup.string().required("заполните поле"),
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
                <img v-for="(pr, i) in previews" :key="i" :src="pr" alt="" class="ma-4" style="max-width: 200px;"
                  @click="delPhotoDialog = true;
                  targetIndex = i;" @error="handleImgError(i)" />
              </div>
              <a-button type="dashed" block @click="visibleCropperModal = true" class="mb-8 mt-8">
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
              <div class="d-flex" style="align-items: baseline; gap: 4px; flex-wrap: wrap;">
                Цены <span class="text-caption">Оставьте колонку 'максимум' пустой, если нет ограничения</span></div>

              <div v-for="item in form.cost" :key="item.type" style="display: flex" align="baseline" class="mb-16">
                <a-input v-model:value="item.first" placeholder="Название услуги" />

                <a-input-number v-model:value="item.price" style="width: 100%" placeholder="Цена" type="number" :min="0"
                  :step="1" class="ml-16 mr-16" />

                <a-input-number v-model:value="item.limit" style="width: 100%" placeholder="Максимум мест" type="number"
                  :min="0" />


                <a-button @click="removeCost(item)" shape="circle">
                  <span class="mdi mdi-minus" style="cursor: pointer"></span>
                </a-button>
              </div>
              <a-button type="dashed" block @click="addCost" class="mb-8 mt-8">
                Добавить цены
              </a-button>

            </a-col>

            <a-col :span="24">
              Бонусы и скидки
              <div v-for="item in form.bonuses" style="display: flex" align="baseline" class="mb-16">
                <a-input v-model:value="item.type" placeholder="Количество человек" />

                <a-input v-model:value="item.bonus" style="width: 100%" placeholder="Бонусы или скидки"
                  class="ml-16 mr-16" />

                <a-button @click="removeBonuses(item)" shape="circle">
                  <span class="mdi mdi-minus" style="cursor: pointer"></span>
                </a-button>
              </div>

              <a-button type="dashed" block @click="addBonuses" class="mb-8 mt-8">
                бонусы и скидки
              </a-button>
            </a-col>

            <a-col :xs="24" :md="12">
              <Field name="tripType" v-slot="{ value, handleChange }" v-model="form.tripType">
                Тип тура
                <div>
                  <a-select @update:value="handleChange" :value="value" style="width: 100%">
                    <a-select-option v-for="tripType in appStore.appState[0].tripType" :value="tripType">{{
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
              Достопримечательности/места

              <a-select v-model:value="form.places" :options="places" style="width: 100%;" mode="multiple" :fieldNames="{
                label: 'name',
                value: '_id',
              }" @search="handlePlacesSearch" :filter-option="false">

              </a-select>
            </a-col>

            <a-col :span="24">
              <Field name="tripRegion" v-slot="{ value, handleChange }" v-model="form.tripRegion">
                <div class="d-flex" style="align-items: baseline; gap: 4px; flex-wrap: wrap;">
                  Регион (направление) тура <span class="text-caption">пользователь будет искать ваш тур по этому ключевому слову</span>
                </div>
                <a-select :value="value" @update:value="handleChange" style="width: 100%" :options="tripRegions"
                  placeholder="На море, Кавказ, Урал, Заполярье, Кунгурские пещеры" show-search allowClear>
                </a-select>
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

                    ['link'], ['clean']
                  ]
                    " />


              </a-col>
              <a-button type="dashed" block @click="addDay" class="mb-8 mt-8">
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


            <a-col :span="24" style="display: flex; flex-direction: column">
                Условия возврата         
                <QuillEditor class="ql-editor" theme="snow" v-model:content="form.returnConditions"
                  contentType="html" :toolbar="[
                    ['bold', 'italic', 'underline', { color: ['#000000', '#ff6600', '#3daff5'] }],

                    [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],

                    ['link'], ['clean']
                  ]
                    " />
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
                <a-checkbox v-model:checked="form.canSellPartnerTour">{{ form.canSellPartnerTour ? "ДА" : "НЕТ"
                }}</a-checkbox>
              </div>

            </a-col>

            <a-col :span="24">
              <a-alert
                  v-if="!canEnableLoyalty"
                  type="warning"
                  show-icon
                  class="mb-8"
                  message="Модуль лояльности доступен только при оплате в приложении."
              />

              <div class="d-flex align-center space-between">
                <span>Модуль лояльности</span>
                <a-switch size="small" v-model:checked="form.loyalty.enabled" :disabled="!canEnableLoyalty" />
              </div>
            </a-col>

            <a-col v-if="form.loyalty.enabled" :span="24">
              <a-row :gutter="[16, 16]">
                <a-col :span="24">
                  <div>
                    Тип скидки
                  </div>
                  <a-radio-group v-model:value="form.loyalty.type">
                    <a-radio :value="LOYALTY_TYPE.DISCOUNT">Денежная скидка</a-radio>
                    <a-radio :value="LOYALTY_TYPE.FREE_SERVICES">Бесплатные услуги</a-radio>
                  </a-radio-group>
                </a-col>

                <template v-if="form.loyalty.type === LOYALTY_TYPE.DISCOUNT">
                  <a-col :xs="24" :md="12">
                    Постоянная скидка-кэшбек (необязательное поле)
                    <a-input-number v-model:value="form.loyalty.discount.baseDiscountPercent" style="width: 100%"
                                    placeholder="10" :min="0" :max="100" :step="1" />
                  </a-col>

                  <a-col :xs="24" :md="12">
                    Порядок оплаты
                    <a-select v-model:value="form.loyalty.discount.paymentOrder" :options="paymentOrderOptions"
                              style="width: 100%" />
                  </a-col>

                  <a-col :xs="24" :md="12">
                    Крайний день фиксации скидки
                    <a-input-number v-model:value="form.loyalty.discount.fixationDay" style="width: 100%"
                                    placeholder="2" :min="1" :max="daysToTripStart || undefined" :step="1" />
                  </a-col>

                  <a-col :span="24">
                    <PriceCalc ref="priceCalcRef" :embedded="true" v-model:minProfit="form.loyalty.discount.minProfit" />
                  </a-col>
                </template>

                <template v-else>
                  <a-col :span="24">
                    <a-row v-for="(item, index) in form.loyalty.freeServices.levels" :key="index" :gutter="[12, 12]"
                      class="mb-16" align="middle">
                      <a-col :xs="24" :md="10">
                        Кол-во человек для активации бесплатной услуги
                        <a-input-number v-model:value="item.peopleCount" style="width: 100%" :min="1"
                          placeholder="12" />
                      </a-col>

                      <a-col :xs="24" :md="12">
                        Услуга в подарок
                        <a-input v-model:value="item.service" style="width: 100%" placeholder="Бесплатный завтрак" />
                      </a-col>

                      <a-col :xs="24" :md="2" class="d-flex justify-center" style="padding-top: 24px;">
                        <a-button @click="removeLoyaltyFreeService(item)" shape="circle"
                          :disabled="form.loyalty.freeServices.levels.length <= 1">
                          <span class="mdi mdi-minus" style="cursor: pointer"></span>
                        </a-button>
                      </a-col>
                    </a-row>

                    <a-button type="dashed" block @click="addLoyaltyFreeService" class="mt-8 mb-8">
                      Добавить услугу
                    </a-button>
                  </a-col>
                </template>
              </a-row>
            </a-col>

            <a-col :span="24" class="d-flex justify-center ">
              <a-button class="lets_go_btn mt-36 mb-36" type="primary" html-type="submit">
                Отправить
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

:deep(.ant-input),
:deep(.ant-input-number),
:deep(.ant-input-number-input),
:deep(.ant-select-selector),
:deep(.ant-picker),
:deep(.ant-input-affix-wrapper) {
  border-radius: 51px !important;
}

:deep(.ql-toolbar) {
  border-radius: 20px 20px 0 0 !important;
}
:deep(.ql-container) {
  border-radius: 0 0 20px 20px !important;
}

:deep(.ant-btn-dashed) {
  border-color: #ff6600;
  border-style: solid;
  border-width: 2px;
  color: #ff6600;
  border-radius: 51px;
  font-weight: 600;
}

.lets_go_btn {
  width: 100%;
  border-radius: 51px;
}

.text-caption {
  color: #A7A7A7;
}
</style>
