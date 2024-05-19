<script setup>
import { watch, nextTick, ref, reactive, computed, onMounted } from "vue";
import BackButton from '../components/BackButton.vue';
import ImageCropper from "../components/ImageCropper.vue";
import { Form, Field, FieldArray, ErrorMessage } from "vee-validate";
import * as yup from "yup";

import { useRouter } from 'vue-router';
import { useExcursion } from '../stores/excursion'
import { useAuth } from '../stores/auth'
import excursionTypes from '../db/excursionTypes'

const excursionStore = useExcursion()
const user_id = useAuth().user._id
console.log(user_id)
const router = useRouter()

let locationSearchRequest = ref("")
let possibleLocations = ref([])
let selectExcursionType = ref("")

let visibleCropperModal = ref(false);
let previews = ref(localStorage.getItem('createExcursionImages') ? JSON.parse(localStorage.getItem('createExcursionImages')) : []);
let images = localStorage.getItem('createExcursionImages') ? JSON.parse(localStorage.getItem('createExcursionImages')) : []; // type: blob
const delPhotoDialog = ref(false);
// add img
let targetIndex = ref()

let form = reactive({
  name: '',
  contacts: {
    phone: '',
    email: ''
  },
  excursionType: {
    type: '',
    directionType: '',
    directionPlace: ''
  },
  description: "", // quill ??
  location: {}, //ddata
  duration: "",
  minPeople: 0,
  maxPeople: 0,
  guides: [{
    name: ''
  }],
  excursionType: {},
  startPlace: "",
  prices: [],
  images: [],
  minAge: 0,
  deadline: '',
  requirements: '',
  availability: true,

})

let formSchema = yup.object({
  name: yup.string().required("заполните поле"),
  description: yup.string().required("заполните поле"), // quill ??
  duration: yup.string().required("заполните поле"),
  minPeople: yup.number().required("заполните поле"),
  maxPeople: yup.number().required("заполните поле"),
  startPlace: yup.string().required("заполните поле"),
  minAge: yup.number().required("заполните поле"),
  deadline: yup.string().required("заполните поле"),
  requirements: yup.string().required("заполните поле"),
  guides: yup.string().required("заполните поле"),
  location: yup.string().required("заполните поле"),
  contacts: yup.object({
    email: yup.string().email('в формате gorodaivesi@mail.ru').required("заполните поле"),
    phone: yup.string().required("заполните поле"),
  })
})

function addPreview(blob) {
  // imagesFormData.append("image", blob, `product-${previews.value.length}`);
  visibleCropperModal.value = false;
  images.push(blob);
  previews.value.push(URL.createObjectURL(blob));
  localStorage.setItem('createExcursionImages', JSON.stringify(previews.value))
}
const delPhoto = () => {
  previews.value.splice(targetIndex.value, 1);
  images.splice(targetIndex.value, 1);
  delPhotoDialog.value = false;
  localStorage.setItem('createExcursionImages', JSON.stringify(previews.value))
};
function handleImgError(i) {
  previews.value.splice(i, 1)
  images.splice(i, 1)
  localStorage.setItem('createExcursionImages', JSON.stringify(previews.value))
}

function selectStartLocation(selected) {
  for (let l of possibleLocations.value) {
    // l.value - name
    if (l.value == selected) {
      form.location = l.location
    }
  }
}
const removeCost = (item) => {
  let index = form.prices.indexOf(item);
  if (index !== -1) {
    form.prices.splice(index, 1);
  }
};

const addCost = () => {
  form.prices.push({
    type: "",
    price: "",
  });
};

async function submit() {
  form.author = user_id
  let excursionCb = await excursionStore.create(form)
  const _id = excursionCb.data._id
  let imagesFormData = new FormData();
  for (let i = 0; i < images.length; i++) {
    imagesFormData.append(
      "excursion-image",
      new File([images[i]], _id + "_" + i + ".jpg"),
      _id + "_" + i + ".jpg"
    );
  }
  let res = await excursionStore.uploadImages(imagesFormData)
  if (res.status == 200) {
    router.push('/cabinet/me')
  }
}

let getExcursionDirections = computed(() => {
  let type = excursionTypes.filter((type) => {
    return type.type == form.excursionType.type
  })
  return type[0]?.direction
})
let getExcursionPlace = computed(() => {

  if (getExcursionDirections.value) {

    let direction = getExcursionDirections.value.filter((direction) => {

      return direction.directionType == form.excursionType.directionType
    }
    )
    return direction[0]?.directionPlace
  }
  return null

})

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

watch(
  () => form.excursionType.type,
  () => {
    form.excursionType.directionType = ''
  },
  { deep: true }
)
watch(
  () => form.excursionType.directionType,
  () => {
    form.excursionType.directionPlace = ''
  },
  { deep: true }
)


</script>

<template>
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :span="22" :md="12">
        <Form :validation-schema="formSchema" @submit="submit">
          <a-row :gutter="[16, 16]">
            <a-col :span="24">
              <h2>Создать экскурсию</h2>
            </a-col>
            <a-col :span="24">
              <Field name="name" v-slot="{ value, handleChange }" v-model="form.name">
                Название экскурсии
                <a-input placeholder="Моя профессия - металлург" @update:value="handleChange" :value="value"></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="name" class="error-message" />
              </Transition>
            </a-col>
            <a-col :span="12">
              Тип экскурсии
              <a-select v-model:value="form.excursionType.type" style="width: 100%;">
                <!-- <a-select-option value=""></a-select-option> -->
                <a-select-option placeholder="Tип тура" 
                  :value="''">
                 
                </a-select-option>
                <a-select-option placeholder="Tип тура" v-for="excursionType in excursionTypes"
                  :value="excursionType.type">
                  {{ excursionType.type }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="12" v-if='getExcursionDirections'>
              Направление
              <a-select v-model:value="form.excursionType.directionType" style="width: 100%;">
                <a-select-option placeholder="Tип тура" 
                  :value="''">
                 
                </a-select-option>
                <a-select-option placeholder="Tип тура" v-for="excursionDirection in getExcursionDirections"
                  :value="excursionDirection.directionType">
                  {{ excursionDirection.directionType }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :span="12" v-if='getExcursionPlace'>
              Место
              <a-select v-model:value="form.excursionType.directionPlace" style="width: 100%;">
                <a-select-option placeholder="Tип тура" 
                  :value="''">
                 
                </a-select-option>
                <a-select-option placeholder="Tип тура" v-for="directionPlace in getExcursionPlace"
                  :value="directionPlace">
                  {{ directionPlace }}
                </a-select-option>
              </a-select>
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

            <a-col :span="24">
              <Field name="description" v-slot="{ value, handleChange }" v-model="form.description">
                Описание
                <a-textarea
                  placeholder="Мы посетим завод ЧМЗ, познакомимся с профессией металлург, узнаем об особенностях специальности"
                  @update:value="handleChange" :value="value" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="description" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="24">
              <div class="d-flex space-between ">Цены

              </div>


              <div v-for="   item, index    in    form.prices   " :key="index" style="display: flex" align="baseline"
                class="mb-16">
                <a-input v-model:value="item.type" placeholder="Взрослый" />

                <a-input-number v-model:value="item.price" style="width: 100%" placeholder="1000" type="number" :min="0"
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
              <Field name="requirements" v-slot="{ value, handleChange }" v-model="form.requirements">
                Особые требования
                <a-textarea placeholder="паспорт, бахилы, теплая одежда" @update:value="handleChange" :value="value" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="requirements" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="24">
              <Field name="location" v-slot="{ value, handleChange }" v-model="locationSearchRequest">
                Город проведения
                <a-auto-complete :value="value" @update:value="handleChange" style="width: 100%"
                  :options="possibleLocations" placeholder="Глазов" @select="selectStartLocation">
                </a-auto-complete>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="location" class="error-message" />
              </Transition>
            </a-col>
            <a-col :span="24">
              <Field name="startPlace" v-slot="{ value, handleChange }" v-model="form.startPlace">
                Место начала
                <a-input placeholder="Западная проходная ЧМЗ" @update:value="handleChange" :value="value" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="startPlace" class="error-message" />
              </Transition>
            </a-col>
            <a-col :span="24" :md="12">
              <Field name="duration" v-slot="{ value, handleChange }" v-model="form.duration">
                Продолжительность
                <a-input placeholder="1 час" @update:value="handleChange" :value="value" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="duration" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="24" :md="12">
              <Field name="deadline" v-slot="{ value, handleChange }" v-model="form.deadline">
                <div>Срок подачи заявки</div>
                <a-input placeholder="За 10 дней" @update:value="handleChange" :value="value" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="deadline" class="error-message" />
              </Transition>
            </a-col>
            <a-col :span="24" :md="12">
              <Field name="minPeople" v-slot="{ value, handleChange }" v-model="form.minPeople">
                <div>Минимальное количество</div>
                <a-input-number min="1" placeholder="5" @update:value="handleChange" :value="value"
                  style="width: 100%;" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="minPeople" class="error-message" />
              </Transition>
            </a-col>
            <a-col :span="24" :md="12">
              <Field name="maxPeople" v-slot="{ value, handleChange }" v-model="form.maxPeople">
                <div>Максимальное количество</div>
                <a-input-number min="1" placeholder="15" @update:value="handleChange" :value="value"
                  style="width: 100%;" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="maxPeople" class="error-message" />
              </Transition>
            </a-col>
            <a-col :span="24">
              Экскурсовод
              <Field name="guides" v-slot="{ value, handleChange }" v-model="form.guides[0].name">
                <a-input placeholder="Александр Невский" @update:value="handleChange" :value="value" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="guides" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="24" :md="12">
              <Field name="minAge" v-slot="{ value, handleChange }" v-model="form.minAge">
                <div>Минимальный возраст</div>
                <a-input-number min="0" placeholder="14 лет" @update:value="handleChange" :value="value"
                  style="width: 100%;" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="minAge" class="error-message" />
              </Transition>
            </a-col>


            <a-col :span="24" :md="12">
              <div>ОВЗ доступность</div>
              <a-radio-group v-model:value="form.availability" type="horizontal">
                <a-radio :value="true">да</a-radio>
                <a-radio :value="false">нет</a-radio>
              </a-radio-group>
            </a-col>
            <a-col :span="24" :md="12">
              <Field name="contacts.phone" v-slot="{ value, handleChange }" v-model="form.contacts.phone">
                Телефон
                <a-input placeholder="8909909909" @update:value="handleChange" :value="value" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="contacts.phone" class="error-message" />
              </Transition>
            </a-col>
            <a-col :span="24" :md="12">
              <Field name="contacts.email" v-slot="{ value, handleChange }" v-model="form.contacts.email">
                E-mail
                <a-input placeholder="teat@ya.ru" @update:value="handleChange" :value="value" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="contacts.email" class="error-message" />
              </Transition>
            </a-col>
            <!-- кроппер для добавления картинок -->
            <a-col :span="24" class="d-flex justify-center">
              <a-button class="lets_go_btn ma-36" type="primary" html-type="submit">Отправить</a-button>
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