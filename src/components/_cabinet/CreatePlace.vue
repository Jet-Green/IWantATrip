<script setup>
import { reactive, ref, watch, onMounted } from 'vue';
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import ImageCropper from "../../components/ImageCropper.vue";
import { message } from "ant-design-vue";

import { useRouter } from 'vue-router';
import { useAppState } from "../../stores/appState";
import BackButton from "../../components/BackButton.vue";
import { useAuth } from '../../stores/auth';
import { usePlaces } from '../../stores/place';
import PlaceService from '../../service/PlaceService';

const appStore = useAppState();
const userStore = useAuth();
const placeStore = usePlaces();
const router = useRouter();

const locationType = ref('dadataLocation')
const customLocation = ref({
  type: "Point",
  coordinates: ["", ""]
})

// dadata
let possibleLocations = ref([])
let locationSearchRequest = ref("")
function selectStartLocation(selected) {
  for (let l of possibleLocations.value) {
    // l.value - name
    if (l.value == selected) {
      form.dadataLocation = l.location
    }
  }
}

//crop and img
const targetIndex = ref(null);
const delPhotoDialog = ref(false);
// cropper
let visibleCropperModal = ref(false);
let previews = ref([]);
// отправляем на сервер
let images = localStorage.getItem('createPlaceImages') ? JSON.parse(localStorage.getItem('createPlaceImages')) : []; // type: blob


const form = reactive({
  name: '',
  dadataLocation: {},
  customLocation: {},
  images: [],
  shortDescription: '',
  description: '',
  advicesForTourists: '',
  openingHours: '',
  price: '',
  website: '',

  category: ''
});

let placeCategory = appStore.appState[0]?.placeCategory.map((name) => { return { value: name } }) ?? []

let formSchema = yup.object({
  name: yup.string().required("заполните поле"),
  shortDescription: yup.string().required("заполните поле"),
  openingHours: yup.string().required("заполните поле"),
  website: yup.string().required("заполните поле"),
  price: yup.string().required("заполните поле"),
  category: yup.string().required("заполните поле"),
  // https://vee-validate.logaretm.com/v4/examples/array-fields/
});

async function uploadPlaceImages(_id) {
  let imagesFormData = new FormData();
  for (let i = 0; i < images.length; i++) {
    imagesFormData.append(
      "place-image",
      new File([images[i]], _id + '_' + Date.now() + "_" + i + ".jpg"),
      _id + '_' + Date.now() + "_" + i + ".jpg"
    );
  }
  let res = await PlaceService.uploadPlaceImages(imagesFormData)
  localStorage.removeItem('createPlaceImages')
  return res
}

async function submit() {
  // провериьть на наличие координат вывести предупреждение
  // добавить дату и автора
  // create -> upload-images
  // clear localStorage
  if (locationType.value == "customLocation") {
    if (form.customLocation.coordinates.length < 2 || form.customLocation.coordinates[0] == '' || form.customLocation.coordinates[1] == '') {
      message.config({ duration: 3, top: "70vh" });
      message.warning("Укажите широту и долготу!");
    }
  }

  let toSend = { ...form }
  toSend.author = userStore.user._id
  toSend.createdDate = Date.now()

  // вдруг пользователь введёт и там и там
  if (locationType.value == "customLocation") {
    toSend.dadataLocation = {}
  } else {
    toSend.customLocation = {}
  }

  function close() {
    router.push("/places");
    clearForm()
  }
  function clearForm() {
    Object.assign(form, {
      name: '',
      dadataLocation: {},
      customLocation: {},
      images: [],
      shortDescription: '',
      description: '',
      advicesForTourists: '',
      openingHours: '',
      price: '',
      website: '',
      category: ''
    });
    images = [];
    previews.value = [];
  }
  let response = await placeStore.create(toSend)
  if (response.status == 200) {
    const placeId = response.data._id;
    let res = await uploadPlaceImages(placeId)
    if (res.status == 200) {
      localStorage.setItem('createPlaceForm', {})
      message.config({ duration: 1.5, top: "70vh" });
      message.success({
        content: "Место создано!", onClose: () => {
          close()
        },
      });
    }
  }
}


function addPreview(blob) {
  // imagesFormData.append("image", blob, `product-${previews.value.length}`);
  visibleCropperModal.value = false;
  images.push(blob);
  previews.value.push(URL.createObjectURL(blob));
  localStorage.setItem('createPlaceImages', JSON.stringify(previews.value))
}
const delPhoto = () => {
  previews.value.splice(targetIndex.value, 1);
  images.splice(targetIndex.value, 1);
  delPhotoDialog.value = false;
  localStorage.setItem('createPlaceImages', JSON.stringify(previews.value))
};

function handleImgError(i) {
  previews.value.splice(i, 1)
  images.splice(i, 1)
  localStorage.setItem('createPlaceImages', JSON.stringify(previews.value))
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

watch(locationType, () => {
  if (locationType.value == 'dadataLocation') {
    form.customLocation = {}
  } else {
    form.customLocation = customLocation.value
    form.dadataLocation = {}
    possibleLocations.value = []
    locationSearchRequest.value = ""
  }
})

watch(form, (newForm) => {
  localStorage.setItem('createPlaceForm', JSON.stringify(newForm))
})
onMounted(() => {
  previews.value = localStorage.getItem('createPlaceImages') ? JSON.parse(localStorage.getItem('createPlaceImages')) : []
  if (localStorage.getItem('createPlaceForm')) {
    Object.assign(form, JSON.parse(localStorage.getItem('createPlaceForm')))
  }
})

</script>
<template>
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="12">
        <h2>Создать место</h2>
        <Form :validation-schema="formSchema" v-slot="{ meta }" @submit="submit">
          <a-row :gutter="[16, 16]">
            <a-col :span="24">
              <Field name="name" v-slot="{ value, handleChange }" v-model="form.name">
                Название
                <a-input placeholder="Название места" @update:value="handleChange" :value="value" :maxlength="50"
                  allow-clear show-count></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="name" class="error-message" />
              </Transition>
            </a-col>
            <a-col :span="24">

              <Field name="shortDescription" v-slot="{ value, handleChange }" v-model="form.shortDescription">
                Короткое описание
                <a-textarea placeholder="Кратко о месте" @update:value="handleChange" :value="value" :maxlength="200"
                  allow-clear show-count></a-textarea>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="shortDescription" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="24" style="display: flex; flex-direction: column">
              Подробное описанние
              <QuillEditor class="ql-editor" theme="snow" ref="quill" v-model:content="form.description"
                contentType="html" :toolbar="[
                  ['bold', 'italic', 'underline', { color: ['#000000', '#ff6600', '#3daff5'] }],
                  [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
                  ['link'], ['clean']
                ]
                  " />
            </a-col>
            <a-col :span="24" style="display: flex; flex-direction: column">
              Советы туристам
              <QuillEditor class="ql-editor" theme="snow" ref="quill" v-model:content="form.advicesForTourists"
                contentType="html" :toolbar="[
                  ['bold', 'italic', 'underline', { color: ['#000000', '#ff6600', '#3daff5'] }],
                  [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
                  ['link'], ['clean']
                ]
                  " />
            </a-col>

            <a-col :span="24">
              <Field name="category" v-slot="{ value, handleChange }" v-model="form.category">
                Категория места
                <a-select :value="value" @update:value="handleChange" style="width: 100%" :options="placeCategory"
                  placeholder="Музей, памятник" show-search allowClear>
                </a-select>

              </Field>
              <Transition name="fade">
                <ErrorMessage name="category" class="error-message" />
              </Transition>
            </a-col>


            <a-col :span="24" class="mt-4">
              <Field name="openingHours" v-slot="{ value, handleChange }" v-model="form.openingHours">
                Время работы
                <a-input placeholder="расписание, время работы" @update:value="handleChange" :value="value"
                  :maxlength="100" allow-clear show-count></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="openingHours" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="24">
              <Field name="price" v-slot="{ value, handleChange }" v-model="form.price">
                Цена
                <a-input placeholder="взрослый - 100 рублей" @update:value="handleChange" :value="value"
                  :maxlength="100" allow-clear show-count></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="price" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="24">
              <Field name="website" v-slot="{ value, handleChange }" v-model="form.website">
                Сайт/соц.сеть
                <a-input placeholder="https://example.com" @update:value="handleChange" :value="value" :maxlength="50"
                  allow-clear show-count></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="website" class="error-message" />
              </Transition>
            </a-col>
            <a-col :span="24">
              <div>Адрес или координаты</div>
              <div class="mt-4 mb-4">
                <a-radio-group v-model:value="locationType" name="radioGroup">
                  <a-radio value="dadataLocation">Адрес</a-radio>
                  <a-radio value="customLocation">Координаты</a-radio>

                </a-radio-group>
              </div>
              <div v-if="locationType == 'dadataLocation'">
                <Field name="location" v-slot="{ value, handleChange }" v-model="locationSearchRequest">
                  <a-auto-complete :value="value" @update:value="handleChange" style="width: 100%"
                    :options="possibleLocations" placeholder="Глазов" @select="selectStartLocation">
                  </a-auto-complete>
                </Field>
                <Transition name="fade">
                  <ErrorMessage name="location" class="error-message" />
                </Transition>
              </div>
              <div v-else>
                Широта (lon)
                <a-input placeholder="52.663446" v-model:value="customLocation.coordinates[0]" allow-clear></a-input>
                Долгота (lat)
                <a-input placeholder="58.135907" v-model:value="customLocation.coordinates[1]" allow-clear></a-input>
              </div>
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

            <a-col :span="24" class="d-flex justify-center ">
              <a-button class="lets_go_btn ma-36" type="primary" html-type="submit">Отправить
              </a-button>
            </a-col>
          </a-row>
        </Form>
        <a-modal v-model:open="visibleCropperModal" :footer="null" :destroyOnClose="true">
          <ImageCropper :aspectRatio="2 / 1" @addImage="addPreview" />
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

<style scoped></style>