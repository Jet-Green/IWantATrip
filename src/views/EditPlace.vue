<script setup>
import { reactive, ref, watch, onMounted, computed } from "vue"
import { Form, Field, ErrorMessage } from "vee-validate"
import * as yup from "yup"
import { QuillEditor } from "@vueup/vue-quill"
import "@vueup/vue-quill/dist/vue-quill.snow.css"
import ImageCropper from "../components/ImageCropper.vue"
import { message } from "ant-design-vue"

import { useRouter, useRoute } from "vue-router"
import { useAppState } from "../stores/appState"
import BackButton from "../components/BackButton.vue"
import { useAuth } from "../stores/auth"
import { usePlaces } from "../stores/place"
import { usePhotos } from "../stores/photos.js"
import PlaceService from "../service/PlaceService"

const appStore = useAppState()
const userStore = useAuth()
const placeStore = usePlaces()
const photosStore = usePhotos()
const router = useRouter()
const route = useRoute()

const locationType = ref("dadataLocation")
const customLocation = ref({
  type: "Point",
  coordinates: ["", ""],
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

//crop and img
const targetIndex = ref(null)
const delPhotoDialog = ref(false)
const delOldPhotoDialog = ref(false)
// cropper
let visibleCropperModal = ref(false)
let previews = ref([])
// отправляем на сервер
let images = [] // type: blob
// images from server (+ новые URL из фотобанка до сохранения)
let oldImages = ref([])

const photobankModalOpen = ref(false)
const photobankUrls = ref([])
const photobankPage = ref(1)
const photobankHasMore = ref(false)
const photobankLoading = ref(false)
const photobankLoadingMore = ref(false)
const photobankSearchQuery = ref("")
const photobankSearchActive = ref(false)
const selectedPhotobankUrls = ref([])

function parsePhotosPayload(res) {
  const d = res?.data
  if (d && Array.isArray(d.urls) && typeof d.hasMore === "boolean") {
    return { urls: d.urls, hasMore: d.hasMore }
  }
  if (Array.isArray(d)) {
    return { urls: d, hasMore: d.length > 0 }
  }
  return { urls: [], hasMore: false }
}

async function loadPhotobankBrowsePage(pageNum) {
  photobankLoading.value = true
  try {
    const res = await photosStore.getPhotos(pageNum)
    const { urls, hasMore } = parsePhotosPayload(res)
    photobankUrls.value = urls
    photobankPage.value = pageNum
    photobankHasMore.value = hasMore
    photobankSearchActive.value = false
  } catch {
    message.error("Не удалось загрузить фотобанк")
  } finally {
    photobankLoading.value = false
  }
}

async function loadPhotobankSearchPage(pageNum) {
  const q = photobankSearchQuery.value.trim()
  if (!q) {
    await loadPhotobankBrowsePage(1)
    return
  }
  photobankLoading.value = true
  try {
    const res = await photosStore.searchPhotos(q, pageNum)
    const { urls, hasMore } = parsePhotosPayload(res)
    photobankUrls.value = urls
    photobankPage.value = pageNum
    photobankHasMore.value = hasMore
    photobankSearchActive.value = true
  } catch {
    message.error("Не удалось выполнить поиск")
  } finally {
    photobankLoading.value = false
  }
}

function resetPhotobankModalState() {
  photobankSearchQuery.value = ""
  photobankSearchActive.value = false
  selectedPhotobankUrls.value = []
  photobankPage.value = 1
  photobankUrls.value = []
  photobankHasMore.value = false
}

function openPhotobankModal() {
  photobankModalOpen.value = true
}

watch(photobankModalOpen, (open) => {
  if (open) {
    resetPhotobankModalState()
    loadPhotobankBrowsePage(1)
  }
})

function runPhotobankSearch() {
  selectedPhotobankUrls.value = []
  if (!photobankSearchQuery.value.trim()) {
    loadPhotobankBrowsePage(1)
    return
  }
  loadPhotobankSearchPage(1)
}

function clearPhotobankSearch() {
  photobankSearchQuery.value = ""
  selectedPhotobankUrls.value = []
  loadPhotobankBrowsePage(1)
}

async function loadMorePhotobank() {
  if (photobankLoadingMore.value || !photobankHasMore.value) return
  photobankLoadingMore.value = true
  try {
    const nextPage = photobankPage.value + 1
    const res = photobankSearchActive.value
      ? await photosStore.searchPhotos(photobankSearchQuery.value.trim(), nextPage)
      : await photosStore.getPhotos(nextPage)
    const { urls: chunk, hasMore } = parsePhotosPayload(res)
    if (chunk.length) {
      photobankUrls.value = [...photobankUrls.value, ...chunk]
      photobankPage.value = nextPage
    }
    photobankHasMore.value = chunk.length ? hasMore : false
  } catch {
    message.error("Не удалось подгрузить фото")
  } finally {
    photobankLoadingMore.value = false
  }
}

function isPhotobankUrlSelected(url) {
  return selectedPhotobankUrls.value.includes(url)
}

function togglePhotobankSelect(url) {
  const i = selectedPhotobankUrls.value.indexOf(url)
  if (i === -1) {
    selectedPhotobankUrls.value = [...selectedPhotobankUrls.value, url]
  } else {
    selectedPhotobankUrls.value = selectedPhotobankUrls.value.filter((u) => u !== url)
  }
}

function addSelectedPhotobankToEdit() {
  const urls = [...selectedPhotobankUrls.value]
  if (!urls.length) {
    message.warning("Выберите хотя бы одно фото")
    return
  }
  let added = 0
  for (const url of urls) {
    if (!oldImages.value.includes(url)) {
      oldImages.value.push(url)
      added++
    }
  }
  if (!added && urls.length) {
    message.info("Эти фото уже в списке")
  } else if (added) {
    message.success(added === 1 ? "Фото добавлено" : `Добавлено фото: ${added}`)
  }
  photobankModalOpen.value = false
  selectedPhotobankUrls.value = []
}

// для customLocation, так как нет реактивности в v-model="form.location.coordinates[index]"
let lon = ref()
let lat = ref()

const form = reactive({
  name: "",
  location: { name: "", shortName: "", type: "Point", coordinates: [] },
  images: [],
  shortDescription: "",
  description: "",
  advicesForTourists: "",
  openingHours: "",
  price: "",
  website: "",
  phone:"",

  category: "",
})

let placeCategory =
  appStore.appState[0]?.placeCategory.map((name) => {
    return { value: name }
  }) ?? []

let formSchema = yup.object({
  name: yup.string().required("заполните поле"),
  shortDescription: yup.string().required("заполните поле"),
  // openingHours: yup.string().required("заполните поле"),
  // website: yup.string().required("заполните поле"),
  // price: yup.string().required("заполните поле"),
  category: yup.string().required("заполните поле"),
  // https://vee-validate.logaretm.com/v4/examples/array-fields/
})

let isLocationValid = computed(() => {
  // для customLocation условие тоже нужно добавить
  return form.location?.coordinates?.length == 2 || (lon?.value > 0 && lat?.value > 0)
})

async function uploadPlaceImages(_id) {
  let imagesFormData = new FormData()
  for (let i = 0; i < images.length; i++) {
    imagesFormData.append(
      "place-image",
      new File([images[i]], _id + "_" + Date.now() + "_" + i + ".jpg"),
      _id + "_" + Date.now() + "_" + i + ".jpg"
    )
  }
  let res = await PlaceService.uploadPlaceImages(imagesFormData)
  return res
}

async function submit() {
  // провериьть на наличие координат вывести предупреждение
  // добавить дату и автора
  // create -> upload-images

  if (!isLocationValid.value) {
    message.config({ duration: 3, top: "70vh" })
    message.warning("Укажите широту и долготу!")
    return
  }

  let toSend = { ...form }
  // toSend.author = userStore.user._id
  // toSend.createdDate = Date.now()
  
  // там какая-то проблема с удалением, видимо с ссылкой на переменные что-то было
  // удалялось 2 раза из одного индекса, потому что мы удаляли сначала из oldImages, потом из form.images, 
  // видимо они ссылаются на одну и ту же переменную в памяти
  toSend.images = oldImages.value;

  if (locationType.value == "customLocation") {
    toSend.location.coordinates = [lon.value, lat.value]
  }

  function close() {
    router.back()
    clearForm()
  }
  function clearForm() {
    for (const pr of previews.value) {
      if (typeof pr === "string" && pr.startsWith("blob:")) {
        URL.revokeObjectURL(pr)
      }
    }
    Object.assign(form, {
      name: "",
      location: { name: "", shortName: "", type: "Point", coordinates: [] },
      images: [],
      shortDescription: "",
      description: "",
      advicesForTourists: "",
      openingHours: "",
      price: "",
      website: "",
      category: "",
      phone:"",
    })
    images = []
    previews.value = []
    oldImages.value = []
  }
  if (route.query?.is_admin != "true") {
    toSend.isModerated = false
    toSend.isRejected = false
  }
  let response = await placeStore.edit(toSend)

  if (response.status == 200) {
    const placeId = route.query._id

    let uploadOk = true
    if (images.length > 0) {
      try {
        const res = await uploadPlaceImages(placeId)
        uploadOk = res.status == 200
      } catch {
        uploadOk = false
      }
    }

    if (uploadOk) {
      message.config({ duration: 1.5, top: "70vh" })
      message.success({
        content: "Успешно!",
        onClose: () => {
          close()
        },
      })
    } else {
      message.warning("Место сохранено, но новые файлы не загрузились. Попробуйте ещё раз.")
    }
  }
}

function addPreview(blob) {
  // imagesFormData.append("image", blob, `product-${previews.value.length}`);
  visibleCropperModal.value = false
  images.push(blob)
  previews.value.push(URL.createObjectURL(blob))
}
const delPhoto = () => {
  const i = targetIndex.value
  if (i !== null && i !== undefined) {
    const pr = previews.value[i]
    if (typeof pr === "string" && pr.startsWith("blob:")) {
      URL.revokeObjectURL(pr)
    }
    previews.value.splice(i, 1)
    images.splice(i, 1)
  }
  delPhotoDialog.value = false
}

const delOldPhoto = () => {  
  oldImages.value.splice(targetIndex.value, 1)
  delOldPhotoDialog.value = false
}

function handleImgError(i) {
  const pr = previews.value[i]
  if (typeof pr === "string" && pr.startsWith("blob:")) {
    URL.revokeObjectURL(pr)
  }
  previews.value.splice(i, 1)
  images.splice(i, 1)
}

watch(locationSearchRequest, async (newValue, oldValue) => {
  if (newValue.trim().length > 2 && newValue.length > oldValue.length) {
    var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address"

    var options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + import.meta.env.VITE_DADATA_TOKEN,
      },
      body: JSON.stringify({
        query: newValue,
        count: 5,
        from_bound: { value: "city" },
        to_bound: { value: "house" },
      }),
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
            shortName: "",
            type: "Point",
            coordinates: [s.data.geo_lon, s.data.geo_lat],
          },
        }
        if (s.data.settlement) {
          location.location.shortName = s.data.settlement
        } else if (s.data.city) {
          location.location.shortName = s.data.city
        } else {
          location.location.shortName = s.value
        }

        possibleLocations.value.push(location)
      }
    } catch (error) {
      console.log(error)
    }
  }
})

watch(locationType, () => {
  form.location = { name: "", shortName: "", type: "Point", coordinates: [] }
  // if (locationType.value == 'dadataLocation') {
  //   form.location = { name: "", shortName: "", type: "Point", coordinates: [] }
  // } else {
  //   form.customLocation = customLocation.value
  //   form.dadataLocation = {}
  //   possibleLocations.value = []
  //   locationSearchRequest.value = ""
  // }
})

onMounted(async () => {
  let placeId = route.query._id
  if (placeId) {
    let res = await placeStore.getById(placeId)
    if (res.status == 200) {
      Object.assign(form, res.data)
      oldImages.value = res.data.images
      
      form.location = res.data.location
      if (res.data.location?.name) {
        locationSearchRequest.value = res.data.location.name
        locationType.value = "dadataLocation"
      } else {
        if (res.data.location.coordinates.length == 2) {
          lon.value = res.data?.location?.coordinates[0]
          lat.value = res.data?.location?.coordinates[1]

          locationType.value = "customLocation"
        }
      }
    }
  }
})
</script>
<template>
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="12">
        <h2>Редактировать место</h2>
        <Form :validation-schema="formSchema" v-slot="{ meta }" @submit="submit">
          <a-row :gutter="[16, 16]">
            <a-col :span="24">
              <Field name="name" v-slot="{ value, handleChange }" v-model="form.name">
                Название
                <a-input
                  placeholder="Название места"
                  @update:value="handleChange"
                  :value="value"
                  :maxlength="50"
                  allow-clear
                  show-count
                ></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="name" class="error-message" />
              </Transition>
            </a-col>
            <a-col :span="24">
              <Field name="shortDescription" v-slot="{ value, handleChange }" v-model="form.shortDescription">
                Короткое описание
                <a-textarea
                  placeholder="Кратко о месте"
                  @update:value="handleChange"
                  :value="value"
                  :maxlength="200"
                  allow-clear
                  show-count
                ></a-textarea>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="shortDescription" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="24" style="display: flex; flex-direction: column">
              Подробное описанние
              <QuillEditor
                class="ql-editor"
                theme="snow"
                ref="quill"
                v-model:content="form.description"
                contentType="html"
                :toolbar="[
                  ['bold', 'italic', 'underline', { color: ['#000000', '#ff6600', '#3daff5'] }],
                  [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
                  ['link'],
                  ['clean'],
                ]"
              />
            </a-col>
            <a-col :span="24" style="display: flex; flex-direction: column">
              Советы туристам
              <QuillEditor
                class="ql-editor"
                theme="snow"
                ref="quill"
                v-model:content="form.advicesForTourists"
                contentType="html"
                :toolbar="[
                  ['bold', 'italic', 'underline', { color: ['#000000', '#ff6600', '#3daff5'] }],
                  [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }],
                  ['link'],
                  ['clean'],
                ]"
              />
            </a-col>

            <a-col :span="24">
              <Field name="category" v-slot="{ value, handleChange }" v-model="form.category">
                Категория места
                <a-select
                  :value="value"
                  @update:value="handleChange"
                  style="width: 100%"
                  :options="placeCategory"
                  placeholder="Музей, памятник"
                  show-search
                  allowClear
                >
                </a-select>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="category" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="24" class="mt-4">
              <Field name="openingHours" v-slot="{ value, handleChange }" v-model="form.openingHours">
                Время работы
                <a-input
                  placeholder="расписание, время работы"
                  @update:value="handleChange"
                  :value="value"
                  :maxlength="100"
                  allow-clear
                  show-count
                ></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="openingHours" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="24">
              <Field name="price" v-slot="{ value, handleChange }" v-model="form.price">
                Цена
                <a-input
                  placeholder="взрослый - 100 рублей"
                  @update:value="handleChange"
                  :value="value"
                  :maxlength="100"
                  allow-clear
                  show-count
                ></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="price" class="error-message" />
              </Transition>
            </a-col>
            <a-col :span="24">
              <Field name="phone" v-slot="{ value, handleChange }" v-model="form.phone">
                Телефон
                <a-input placeholder="8919999999" @update:value="handleChange" :value="value"
                  allow-clear show-count></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="phone" class="error-message" />
              </Transition>
            </a-col>
            <a-col :span="24">
              <Field name="website" v-slot="{ value, handleChange }" v-model="form.website">
                Сайт/соц.сеть
                <a-input
                  placeholder="https://example.com"
                  @update:value="handleChange"
                  :value="value"
                  :maxlength="50"
                  allow-clear
                  show-count
                ></a-input>
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
                  <a-auto-complete
                    :value="value"
                    @update:value="handleChange"
                    style="width: 100%"
                    :options="possibleLocations"
                    placeholder="Глазов"
                    @select="selectStartLocation"
                  >
                  </a-auto-complete>
                </Field>
                <Transition name="fade">
                  <ErrorMessage name="location" class="error-message" />
                </Transition>
              </div>
              <div v-else>
                Широта (lon)
                <a-input placeholder="52.663446" v-model:value="lon" allow-clear></a-input>
                Долгота (lat)
                <a-input placeholder="58.135907" v-model:value="lat" allow-clear></a-input>
              </div>
            </a-col>

            <a-col :xs="24">
              Фотографии
              <div class="d-flex" style="overflow-x: scroll">
                <img
                  v-for="(image, i) in oldImages"
                  :key="'old-' + i + '-' + image"
                  :src="image"
                  alt=""
                  class="ma-4"
                  style="max-width: 200px"
                  @click=";(delOldPhotoDialog = true), (targetIndex = i)"
                />

                <img
                  v-for="(pr, i) in previews"
                  :key="'new-' + i + '-' + pr"
                  :src="pr"
                  alt=""
                  class="ma-4"
                  style="max-width: 200px"
                  @click=";(delPhotoDialog = true), (targetIndex = i)"
                  @error="handleImgError(i)"
                />
              </div>
              <div class="edit-place-photos-actions">
                <a-button type="dashed" block @click="visibleCropperModal = true" class="ma-8">
                  <span class="mdi mdi-12px mdi-plus"></span>
                  Добавить фото
                </a-button>
                <a-button type="dashed" block class="ma-8" @click="openPhotobankModal">
                  <span class="mdi mdi-image-multiple-outline mdi-18px" style="margin-right: 6px" aria-hidden="true"></span>
                  Из фотобанка
                </a-button>
              </div>
            </a-col>
            <a-col :span="24" class="d-flex justify-center">
              <a-button
                class="lets_go_btn ma-36"
                type="primary"
                html-type="submit"
                :disabled="
                  !meta.valid || form.advicesForTourists.length < 3 || form.description.length < 3 || !isLocationValid
                "
                >Отправить
              </a-button>
            </a-col>
          </a-row>
        </Form>
        <a-modal v-model:open="visibleCropperModal" :footer="null" :destroyOnClose="true">
          <ImageCropper :aspectRatio="2 / 1" @addImage="addPreview" />
        </a-modal>
        <a-modal
          v-model:open="photobankModalOpen"
          title="Выберите фото из фотобанка"
          width="min(920px, 94vw)"
          :footer="null"
          :destroyOnClose="true"
        >
          <div class="edit-place-photobank-toolbar">
            <a-input-search
              v-model:value="photobankSearchQuery"
              placeholder="Поиск по URL, ключу или подписи"
              allow-clear
              enter-button="Найти"
              size="large"
              @search="runPhotobankSearch"
            />
            <a-button v-if="photobankSearchActive || photobankSearchQuery.trim()" type="link" class="edit-place-photobank-all" @click="clearPhotobankSearch">
              Все фото
            </a-button>
          </div>
          <a-spin :spinning="photobankLoading">
            <div
              v-if="!photobankLoading && !photobankUrls.length"
              class="edit-place-photobank-empty"
            >
              {{ photobankSearchActive ? 'Ничего не найдено' : 'В фотобанке пока нет фотографий' }}
            </div>
            <template v-else-if="!photobankLoading && photobankUrls.length">
              <div class="edit-place-photobank-grid">
                <div
                  v-for="(url, idx) in photobankUrls"
                  :key="`${url}-${idx}`"
                  class="edit-place-photobank-cell"
                  :class="{ 'edit-place-photobank-cell--selected': isPhotobankUrlSelected(url) }"
                  role="button"
                  tabindex="0"
                  @click="togglePhotobankSelect(url)"
                  @keydown.enter.prevent="togglePhotobankSelect(url)"
                >
                  <img :src="url" alt="" loading="lazy" />
                  <span class="edit-place-photobank-check mdi mdi-check-bold" aria-hidden="true"></span>
                </div>
              </div>
              <div v-if="photobankHasMore" class="edit-place-photobank-more">
                <a-button shape="round" :loading="photobankLoadingMore" @click="loadMorePhotobank">
                  ещё
                </a-button>
              </div>
            </template>
          </a-spin>
          <div class="edit-place-photobank-footer">
            <span class="edit-place-photobank-count">Выбрано: {{ selectedPhotobankUrls.length }}</span>
            <div class="edit-place-photobank-footer-btns">
              <a-button @click="photobankModalOpen = false">Отмена</a-button>
              <a-button type="primary" :disabled="!selectedPhotobankUrls.length" @click="addSelectedPhotobankToEdit">
                Добавить выбранные
              </a-button>
            </div>
          </div>
        </a-modal>
        <a-modal v-model:open="delPhotoDialog" :footer="null">
          <h3>Удалить фото?</h3>
          <div class="d-flex justify-center">
            <a-button class="mt-16" type="primary" size="large" @click="delPhoto">Да </a-button>
          </div>
        </a-modal>
        <a-modal v-model:open="delOldPhotoDialog" :footer="null">
          <h3>Удалить фото?</h3>
          <div class="d-flex justify-center">
            <a-button class="mt-16" type="primary" size="large" @click="delOldPhoto">Да </a-button>
          </div>
        </a-modal>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped>
.edit-place-photos-actions {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.edit-place-photobank-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  margin-bottom: 16px;
}

.edit-place-photobank-toolbar :deep(.ant-input-search) {
  flex: 1 1 220px;
  min-width: 0;
}

.edit-place-photobank-all {
  flex-shrink: 0;
  padding-inline: 4px;
}

.edit-place-photobank-empty {
  text-align: center;
  padding: 40px 16px;
  color: rgba(0, 0, 0, 0.45);
}

.edit-place-photobank-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(112px, 1fr));
  gap: 10px;
  max-height: 52vh;
  overflow-y: auto;
  padding: 4px 2px 12px;
}

.edit-place-photobank-cell {
  position: relative;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: #fafafa;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.edit-place-photobank-cell:hover {
  border-color: #ff6600;
}

.edit-place-photobank-cell:focus-visible {
  outline: 2px solid #ff6600;
  outline-offset: 2px;
}

.edit-place-photobank-cell--selected {
  border-color: #ff6600;
  box-shadow: 0 0 0 1px rgba(255, 102, 0, 0.35);
}

.edit-place-photobank-cell img {
  width: 100%;
  height: 112px;
  object-fit: cover;
  display: block;
}

.edit-place-photobank-check {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: #ccc;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

.edit-place-photobank-cell--selected .edit-place-photobank-check {
  background: #ff6600;
  color: #fff;
}

.edit-place-photobank-more {
  display: flex;
  justify-content: center;
  padding-top: 12px;
}

.edit-place-photobank-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.edit-place-photobank-count {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
}

.edit-place-photobank-footer-btns {
  display: flex;
  gap: 8px;
}
</style>
