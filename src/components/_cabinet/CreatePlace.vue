<script setup>
import { reactive, ref, watch, onMounted, onBeforeUnmount, computed, nextTick } from 'vue';
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import ImageCropper from "../../components/ImageCropper.vue";
import { message } from "ant-design-vue";
import BackButtonAdaptive from "../../components/BackButtonAdaptive.vue";

import { useRouter } from 'vue-router';
import { useAppState } from "../../stores/appState";
import { useAuth } from '../../stores/auth';
import { usePlaces } from '../../stores/place';
import PlaceService from '../../service/PlaceService';

const appStore = useAppState();
const userStore = useAuth();
const placeStore = usePlaces();
const router = useRouter();
const customMapContainer = ref(null)
let customMap = null
let customMapMarker = null
const customMapAddressRequest = ref("")
const customMapAddressOptions = ref([])
const usePlaceForTrackPrompt = ref(false)
const createdPlaceName = ref("")

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
      form.location = l.location
    }
  }
}

function selectMapAddress(selected) {
  for (let l of customMapAddressOptions.value) {
    if (l.value == selected) {
      form.location.name = l.location.name
      form.location.shortName = l.location.shortName
      setCustomMapPoint(l.location.coordinates[0], l.location.coordinates[1], true)
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
let images = []; // type: blob


const form = reactive({
  name: '',
  location: { name: "", shortName: "", type: "Point", coordinates: [] },
  images: [],
  shortDescription: '',
  description: '',
  advicesForTourists: '',
  openingHours: '',
  price: '',
  website: '',
  phone: '',

  category: ''
});

let placeCategory = appStore.appState[0]?.placeCategory.map((name) => { return { value: name } }) ?? []

let formSchema = yup.object({
  name: yup.string().required("заполните поле"),
  shortDescription: yup.string().required("заполните поле"),
  // openingHours: yup.string().required("заполните поле"),
  // website: yup.string().required("заполните поле"),
  // phone: yup.string().required("заполните поле"),
  // price: yup.string().required("заполните поле"),
  category: yup.string().required("заполните поле"),
  // https://vee-validate.logaretm.com/v4/examples/array-fields/
});

let isLocationValid = computed(() => {
  return form.location?.coordinates?.length == 2
})

const getInitialMapCenter = () => {
  if (isLocationValid.value) {
    return [Number(form.location.coordinates[0]), Number(form.location.coordinates[1])]
  }
  return [37.6176, 55.7558]
}

const setCustomMapPoint = (lon, lat, shouldFly = false) => {
  const longitude = Number(Number(lon).toFixed(6))
  const latitude = Number(Number(lat).toFixed(6))
  form.location.type = "Point"
  form.location.coordinates = [longitude, latitude]

  if (!customMap) return

  if (!customMapMarker) {
    customMapMarker = new maplibregl.Marker({ color: '#ff6600' })
      .setLngLat([longitude, latitude])
      .addTo(customMap)
  } else {
    customMapMarker.setLngLat([longitude, latitude])
  }

  if (shouldFly) {
    customMap.flyTo({
      center: [longitude, latitude],
      zoom: 13,
      duration: 500
    })
  }
}

const initCustomMap = () => {
  if (!customMapContainer.value || customMap) return

  customMap = new maplibregl.Map({
    container: customMapContainer.value,
    style: {
      version: 8,
      sources: {
        osm: {
          type: 'raster',
          tiles: [
            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
          ],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors'
        }
      },
      layers: [
        {
          id: 'osm',
          type: 'raster',
          source: 'osm'
        }
      ]
    },
    center: getInitialMapCenter(),
    zoom: isLocationValid.value ? 13 : 10
  })

  customMap.on('load', () => {
    if (isLocationValid.value) {
      setCustomMapPoint(form.location.coordinates[0], form.location.coordinates[1])
    }
  })

  customMap.on('click', (e) => {
    setCustomMapPoint(e.lngLat.lng, e.lngLat.lat)
  })
}

const fetchAddressSuggestions = async (query) => {
  const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";

  const options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": "Token " + import.meta.env.VITE_DADATA_TOKEN
    },
    body: JSON.stringify({
      query,
      count: 5,
      "from_bound": { "value": "city" },
      "to_bound": { "value": "house" }
    })
  }

  const res = await fetch(url, options)
  const data = JSON.parse(await res.text())
  const suggestions = data?.suggestions ?? []
  return suggestions
    .filter((s) => s?.data?.geo_lon && s?.data?.geo_lat)
    .map((s) => {
      let shortName = s.value
      if (s.data.settlement) shortName = s.data.settlement
      else if (s.data.city) shortName = s.data.city

      return {
        value: s.value,
        location: {
          name: s.value,
          shortName,
          type: 'Point',
          coordinates: [
            Number(s.data.geo_lon),
            Number(s.data.geo_lat)
          ]
        }
      }
    })
}

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

  if (form.location.coordinates.length < 2 || form.location.coordinates[0] == '' || form.location.coordinates[1] == '') {
    message.config({ duration: 3, top: "70vh" });
    message.warning("Укажите широту и долготу!");
    return
  }


  let toSend = { ...form }
  toSend.author = userStore.user._id
  toSend.createdDate = Date.now()

  try {
    let response = await placeStore.create(toSend)
    if (response.status == 200) {
      const placeId = response.data._id
      let uploadOk = true

      if (images.length > 0) {
        try {
          let res = await uploadPlaceImages(placeId)
          uploadOk = res.status == 200
        } catch (error) {
          console.log(error)
          uploadOk = false
        }
      }

      localStorage.removeItem('createPlaceForm')
      localStorage.removeItem('createPlaceImages')
      createdPlaceName.value = form.name
      message.config({ duration: 2, top: "70vh" })
      message.success("Место создано!")
      if (!uploadOk) {
        message.warning("Место сохранено, но фото не загрузились. Проверьте изображения и повторите.")
      }
      usePlaceForTrackPrompt.value = true
    } else {
      message.error("Не удалось создать место")
    }
  } catch (error) {
    console.log(error)
    message.error("Ошибка при создании места")
  }
}

function clearForm() {
  Object.assign(form, {
    name: '',
    location: { name: "", shortName: "", type: "Point", coordinates: [] },
    images: [],
    shortDescription: '',
    description: '',
    advicesForTourists: '',
    openingHours: '',
    price: '',
    website: '',
    category: '',
    phone: ''
  });
  images = [];
  previews.value = [];
  localStorage.removeItem('createPlaceForm')
  localStorage.removeItem('createPlaceImages')
}

function closeUsePlacePrompt() {
  usePlaceForTrackPrompt.value = false
  clearForm()
  router.push("/places")
}

function continueToCreateTrack() {
  const placeQuery = createdPlaceName.value
  usePlaceForTrackPrompt.value = false
  clearForm()
  router.push({
    path: "/create-track",
    query: { placeQuery }
  })
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


watch(locationSearchRequest, async (newValue) => {
  if (locationType.value !== 'dadataLocation') return
  if (newValue.trim().length <= 2) {
    possibleLocations.value = []
    return
  }
  try {
    possibleLocations.value = await fetchAddressSuggestions(newValue)
  } catch (error) {
    console.log(error)
    possibleLocations.value = []
  }
})

watch(customMapAddressRequest, async (newValue) => {
  if (locationType.value !== 'customLocation') return
  if (newValue.trim().length <= 2) {
    customMapAddressOptions.value = []
    return
  }
  try {
    customMapAddressOptions.value = await fetchAddressSuggestions(newValue)
  } catch (error) {
    console.log(error)
    customMapAddressOptions.value = []
  }
})

watch(locationType, () => {
  form.location = { name: "", shortName: "", type: "Point", coordinates: [] }
  customMapAddressRequest.value = ""
  customMapAddressOptions.value = []
  // if (locationType.value == 'dadataLocation') {
  //   form.location = { name: "", shortName: "", type: "Point", coordinates: [] }
  // } else {
  //   form.customLocation = customLocation.value
  //   form.dadataLocation = {}
  //   possibleLocations.value = []
  //   locationSearchRequest.value = ""
  // }
})

watch(locationType, async (newType) => {
  if (newType !== 'customLocation') return
  await nextTick()
  initCustomMap()
  if (customMap) {
    customMap.resize()
    if (isLocationValid.value) {
      setCustomMapPoint(form.location.coordinates[0], form.location.coordinates[1], true)
    }
  }
})

watch(form, (newForm) => {
  localStorage.setItem('createPlaceForm', JSON.stringify(newForm))
})
onMounted(() => {
  previews.value = []
  if (localStorage.getItem('createPlaceForm')) {
    Object.assign(form, JSON.parse(localStorage.getItem('createPlaceForm')))
  }
})

onBeforeUnmount(() => {
  if (customMap) {
    customMap.remove()
    customMap = null
  }
  customMapMarker = null
})

</script>
<template>
  <div>
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="12">
        <BackButtonAdaptive />
        <h2>Создать место</h2>
        <p class="create-place-hint">
          Добавленные места можно использовать при
          <router-link to="/create-track" target="_blank" class="create-place-link">
            создании маршрутов
          </router-link>.
        </p>
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
              <Field name="phone" v-slot="{ value, handleChange }" v-model="form.phone">
                Телефон
                <a-input placeholder="8919999999" @update:value="handleChange" :value="value" allow-clear
                  show-count></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="phone" class="error-message" />
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
                <a-auto-complete v-model:value="customMapAddressRequest" style="width: 100%; margin-bottom: 8px"
                  :options="customMapAddressOptions" placeholder="Найти адрес на карте" allow-clear
                  @select="selectMapAddress" />
                <p class="create-place-map-hint">
                  Кликните по карте, чтобы выбрать геоточку.
                </p>
                <div ref="customMapContainer" class="create-place-map"></div>
                <div class="create-place-coords">
                  <div>Широта (lon): <b>{{ form.location.coordinates?.[0] ?? 'не выбрано' }}</b></div>
                  <div>Долгота (lat): <b>{{ form.location.coordinates?.[1] ?? 'не выбрано' }}</b></div>
                </div>
              </div>
            </a-col>

            <a-col :xs="24">
              Фотографии
              <div class="d-flex" style="overflow-x: scroll">
                <img v-for="(pr, i) in previews" :key="i" :src="pr" alt="" class="ma-4" style="max-width: 200px;"
                  @click="delPhotoDialog = true;
                  targetIndex = i;" @error="handleImgError(i)" />
              </div>
              <a-button type="dashed" block @click="visibleCropperModal = true" class="ma-8">
                <span class="mdi mdi-12px mdi-plus"></span>
                Добавить фото
              </a-button>
            </a-col>
            <a-col :span="24" class="d-flex justify-center">
              <a-button class="lets_go_btn ma-36" type="primary" html-type="submit"
                :disabled="!meta.valid || form.advicesForTourists.length < 3 || form.description.length < 3 || !isLocationValid">Отправить
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
        <a-modal
          v-model:open="usePlaceForTrackPrompt"
          title="Место создано"
          :footer="null"
          class="post-create-place-modal"
          @cancel="closeUsePlacePrompt"
        >
          <p>Используем это место для создания маршрута?</p>
          <div class="d-flex justify-end mt-16 post-create-place-modal__actions" style="gap: 8px;">
            <a-button @click="closeUsePlacePrompt">Нет, позже</a-button>
            <a-button type="primary" @click="continueToCreateTrack">Да, создать маршрут</a-button>
          </div>
        </a-modal>

      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.create-place-hint {
  margin: -6px 0 16px;
  font-size: 14px;
  color: rgba(18, 32, 51, 0.82);
}

.create-place-link {
  color: #ff6600;
  text-decoration: underline;
  text-decoration-color: #ff6600;
  text-underline-offset: 2px;
  font-weight: 600;
}

.create-place-map-hint {
  margin-bottom: 8px;
  color: rgba(18, 32, 51, 0.75);
}

.create-place-map {
  width: 100%;
  height: 320px;
  border: 1px solid #ff6600;
  border-radius: 10px;
  overflow: hidden;
}

.create-place-coords {
  margin-top: 8px;
  display: grid;
  gap: 4px;
  font-size: 13px;
}

.post-create-place-modal__actions :deep(.ant-btn) {
  border-radius: 999px;
}
</style>