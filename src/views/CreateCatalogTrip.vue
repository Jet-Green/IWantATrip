<script setup>
import { suggestAddress } from '../service/dadataService.js';
import BackButton from "../components/BackButton.vue";
// import ImageCropper from "../components/ImageCropper.vue";
const ImageCropper = defineAsyncComponent(() =>
  import("../components/ImageCropper.vue")
)
import { watch, nextTick, ref, reactive, onMounted,defineAsyncComponent } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

// import typeOfTrip from "../fakeDB/tripType";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { useTrips } from "../stores/trips";
import { useAuth } from "../stores/auth";
import { useAppState } from "../stores/appState";
import { usePhotos } from "../stores/photos.js";
import TripService from "../service/TripService";
import AddPhotoFromPhotobank from "../components/photobank/AddPhotoFromPhotobank.vue";

import dayjs from "dayjs";
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";
import 'dayjs/locale/ru';
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

dayjs.locale('ru');

const TripStore = useTrips();
const userStore = useAuth();
const appStore = useAppState();
const photosStore = usePhotos();

// Ключи свои, а не общие с обычным туром: иначе черновики двух разных форм
// перезаписывают друг друга
const DRAFT_KEY = "CreatingCatalogTrip";
const DRAFT_IMAGES_KEY = "createCatalogTripImages";

/** Черновик из localStorage; битый (или чужого формата) молча выбрасываем. */
function readDraft(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (error) {
    localStorage.removeItem(key);
    return null;
  }
}

let formFromLocalStorage = readDraft(DRAFT_KEY);

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
// Черновик фотографий не восстанавливаем и восстановить не можем: в
// localStorage лежат лишь blob-ссылки на превью, а они умирают вместе с
// перезагрузкой страницы. Раньше их читали в `images` как файлы — и в
// облако вместо снимка улетал текст ссылки, тур оставался без фотографий.
// Поэтому при заходе черновик картинок сбрасываем: фото добавляются заново.
localStorage.removeItem(DRAFT_IMAGES_KEY);
let previews = ref([]);
// отправляем на сервер
let images = []; // type: blob
//let pdf = [];
// Оригинальные URL фото из фотобанка, чьи обрезанные копии добавлены в тур
// (нужно, чтобы отметить их как использованные в БД — usageCount++)
const usedPhotobankUrls = ref([]);
// очередь URL из фотобанка, ожидающих обрезки в кроппере
const photobankCropQueue = ref([]);
// src для кроппера: если задан — режем фото из фотобанка, иначе обычная загрузка файла
const cropperSrc = ref('');

/** Открывает тот же кроппер для каждого выбранного из фотобанка фото по очереди. */
function addPhotobankUrls(urls) {
  const fresh = (urls || []).filter((u) => typeof u === 'string' && u.trim());
  if (!fresh.length) return;
  photobankCropQueue.value.push(...fresh);
  if (!cropperSrc.value) startNextPhotobankCrop();
}

function startNextPhotobankCrop() {
  if (!photobankCropQueue.value.length) {
    cropperSrc.value = '';
    visibleCropperModal.value = false;
    return;
  }
  cropperSrc.value = photobankCropQueue.value[0];
  visibleCropperModal.value = true;
}

/** Пользователь закрыл кроппер, не обрезав — сбрасываем очередь фотобанка. */
function cancelCropper() {
  photobankCropQueue.value = [];
  cropperSrc.value = '';
  visibleCropperModal.value = false;
}

/** Отмечает использованные фото фотобанка в БД после создания каталожного тура. */
async function markUsedPhotobankUrls(_id) {
  if (!usedPhotobankUrls.value.length) return;
  try {
    const { data } = await photosStore.filterPublishedUrls(usedPhotobankUrls.value);
    const published = Array.isArray(data?.urls) ? data.urls : [];
    if (published.length) {
      await TripService.markCatalogTripPhotobankUsed(_id, published);
    }
  } catch (error) {
    console.log(error);
  }
}

let locationSearchRequest = ref("")
// необходимо добавить поле количество людей в туре
let form = reactive({
  name: "",
  // start: null,
  // end: null,
  // maxPeople: null,
  duration: "",
  images: [],
  //pdf: [],
  tripRoute: "",
  // distance: "",
  // cost: [],
  offer: "",
  description: "",
  tripType: "",
  fromAge: "",
  author: "",
  startLocation: null,
  // bonuses: [],
  // returnConditions: '',
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

const removeBonuses = (item) => {
  let index = form.bonuses.indexOf(item);
  if (index !== -1) {
    form.bonuses.splice(index, 1);
  }
};

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
    router.push("/cabinet/created-trips/");
    clearForm()
  }
  function clearForm() {
    Object.assign(form, {
      name: "",
      duration: "",
      images: [],
      tripRoute: "",
      offer: "",
      description: description.value,
      tripType: "",
      fromAge: "",
      author: "",
      startLocation: "",
      isModerated: false,

    });
    images = [];
    // pdf = [];
    previews.value = [];
    usedPhotobankUrls.value = [];
    photobankCropQueue.value = [];
    cropperSrc.value = '';
    quill.value.setHTML("");
  }
  function uploadTripImages(_id) {
    let imagesFormData = new FormData();
    for (let i = 0; i < images.length; i++) {
      imagesFormData.append(
        "trip-image",
        new File([images[i]], _id + "_" + i + ".jpg"),
        _id + "_" + i + ".jpg"
      );
    }
    TripService.uploadCatalogTripImages(imagesFormData).then(() => {
      console.log('фотографии загружены')
      localStorage.removeItem(DRAFT_IMAGES_KEY)
    })

  }

  function updateUser(_id) {
    userStore
      .updateUser({ email: userStore.user.email, $push: { catalogTrips: _id } })
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

  TripStore.createCatalogTrip(form, userStore.user).then(async (res) => {
    if (res.status == 200) {
      const _id = res.data._id;
      await uploadTripImages(_id)
      await markUsedPhotobankUrls(_id)
      await updateUser(_id)

      localStorage.removeItem(DRAFT_KEY)
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
  images.push(blob);
  previews.value.push(URL.createObjectURL(blob));
  localStorage.setItem(DRAFT_IMAGES_KEY, JSON.stringify(previews.value))
  if (cropperSrc.value) {
    // это была обрезка фото из фотобанка — запоминаем оригинал и переходим к следующему
    if (!usedPhotobankUrls.value.includes(cropperSrc.value)) {
      usedPhotobankUrls.value.push(cropperSrc.value);
    }
    photobankCropQueue.value.shift();
    startNextPhotobankCrop();
  } else {
    visibleCropperModal.value = false;
  }
}
const delPhoto = () => {
  previews.value.splice(targetIndex.value, 1);
  images.splice(targetIndex.value, 1);
  delPhotoDialog.value = false;
  localStorage.setItem(DRAFT_IMAGES_KEY, JSON.stringify(previews.value))
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
    try {
      let suggestions = await suggestAddress(newValue, { toBound: "settlement" })
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
    startDate.setHours(0)
    startDate.setMinutes(0)
    startDate.setSeconds(0)
    startDate.setMilliseconds(0)

    form.start = Number(Date.parse(startDate.toString()));
    if (!end.value) {
      end.value = start.value
    }
    duration.value = ((form.end - form.start) / 86400000).toFixed(0)
  }
});
watch(form, () => {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(form))
})
watch(end, () => {
  // округлить, чтобы при поиске мы точно попадали
  if (end.value) {
    let endDate = new Date(end.value.$d);
    endDate.setHours(23)
    endDate.setMinutes(59)
    endDate.setSeconds(59)
    endDate.setMilliseconds(999)

    form.end = Date.parse(endDate);
    if (form.start > form.end) {
      end.value = dayjs(form.start)
    }
  }
  duration.value = ((form.end - form.start) / 86400000).toFixed(0)
});
onMounted(async () => {
  const draft = readDraft(DRAFT_KEY)
  if (draft) {
    let f = draft
    quill.value.setHTML(f.description);
    Object.assign(form, f)
    if (f.startLocation) {
      locationSearchRequest.value = f.startLocation.name
    }
  }
});
function handleImgError(i) {
  previews.value.splice(i, 1)
  images.splice(i, 1)
  localStorage.setItem(DRAFT_IMAGES_KEY, JSON.stringify(previews.value))
}

let formSchema = yup.object({
  name: yup.string().required("заполните поле"),
  duration: yup.string().required("заполните поле"),
  tripType: yup.string().required("заполните поле"),
  fromAge: yup.string().required("заполните поле"),
  offer: yup.string().required("заполните поле"),
  tripRoute: yup.string().required("заполните поле"),
  startLocation: yup.string().required("заполните поле"),
  // https://vee-validate.logaretm.com/v4/examples/array-fields/
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
              <h2>Создать тур в каталоге</h2>
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
                <img v-for="(pr, i) in    previews   " :key="i" :src="pr" alt="not found" class="ma-4" style="max-width: 200px;"
                  @click="delPhotoDialog = true;
      targetIndex = i;" @error="handleImgError(i)" />
              </div>
              <a-button type="dashed" block @click="visibleCropperModal = true" class="ma-8">
                <MdiIcon name="plus" size="12px" />
                Добавить фото
              </a-button>
              <AddPhotoFromPhotobank @add="addPhotobankUrls" />
            </a-col>

            <!-- <a-col :span="12">
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
            </a-col> -->

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
            <!-- <a-col :span="12">
              <Field name="maxPeople" v-slot="{ value, handleChange }" v-model="form.maxPeople">
                Макс. число людей
                <a-input-number @update:value="handleChange" :value="value" style="width: 100%" type="number"
                  placeholder="11" :min="1" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="maxPeople" class="error-message" />
              </Transition>
            </a-col> -->

            <!-- <a-col :span="24">
              <div class="d-flex space-between ">Цены
                <a-tooltip>
                  <template #title>калькулятор</template>
<router-link :to="{ name: 'PriceCalc' }" target="_blank">
  <MdiIcon style="cursor: pointer; font-size: 24px; color:#ff6600" name="calculator" />
</router-link>
</a-tooltip>
</div>


<div v-for="   item    in    form.cost   " :key="item.type" style="display: flex" align="baseline" class="mb-16">
  <a-input v-model:value="item.first" placeholder="Для кого" />

  <a-input-number v-model:value="item.price" style="width: 100%" placeholder="Цена" type="number" :min="0" :step="1"
    class="ml-16 mr-16" />

  <a-button @click="removeCost(item)" shape="circle">
    <MdiIcon style="cursor: pointer" name="minus" />
  </a-button>
</div>

<a-button type="dashed" block @click="addCost" class="ma-8">
  <MdiIcon name="plus" size="12px" />
  Добавить цены
</a-button>
</a-col>

<a-col :span="24">

  <div v-for="   item    in    form.bonuses   " style="display: flex" align="baseline" class="mb-16">
    <a-input v-model:value="item.type" placeholder="Количество человек" />

    <a-input v-model:value="item.bonus" style="width: 100%" placeholder="Бонусы или скидки" class="ml-16 mr-16" />

    <a-button @click="removeBonuses(item)" shape="circle">
      <MdiIcon style="cursor: pointer" name="minus" />
    </a-button>
  </div>

  <a-button type="dashed" block @click="addBonuses" class="ma-8">
    <MdiIcon name="plus" size="12px" />
    бонусы и скидки
  </a-button>
</a-col> -->

            <a-col :xs="24" :md="12">
              <Field name="tripType" v-slot="{ value, handleChange }" v-model="form.tripType">
                Тип тура
                <div>
                  <a-select @update:value="handleChange" :value="value" style="width: 100%">
                    <a-select-option v-for="   tripType    in    appStore.appState[0].tripType   " :value="tripType">{{
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
              <Field name="offer" v-slot="{ value, handleChange }" v-model="form.offer">
                Краткое описание
                <a-textarea @update:value="handleChange" :value="value"
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
                <a-textarea @update:value="handleChange" :value="value" placeholder="Глазов-Пермь-Кама" size="large">
                </a-textarea>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="tripRoute" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="24" style="display: flex; flex-direction: column">
              Описание программы

              <QuillEditor class="ql-editor" theme="snow" ref="quill" v-model:content="description" contentType="html"
                :toolbar="[['bold', 'italic', 'underline', { color: ['#000000', '#ff6600', '#3daff5'] }], [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }], ['link']]" />
            </a-col>
            <!-- <a-col :span="24">
              <Field name="returnConditions" v-slot="{ value, handleChange }" v-model="form.returnConditions">
                Условия возврата
                <a-textarea @update:value="handleChange" :value="value" placeholder="" size="large">
                </a-textarea>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="offer" class="error-message" />
              </Transition>
            </a-col> -->
            <!-- <a-col :span="24">
              :file-list="fileList"
              <a-upload action="" :multiple="true">
                <a-button type="dashed" block>
                  <MdiIcon name="plus" size="12px" />
                  Загрузить pdf описание
                </a-button>
              </a-upload>
            </a-col> -->
            <a-col :span="24" class="d-flex justify-center">
              <a-button class="lets_go_btn ma-36" type="primary" html-type="submit">Отправить
              </a-button>
            </a-col>
          </a-row>
        </Form>
        <a-modal v-model:open="visibleCropperModal" :footer="null" :destroyOnClose="true" @cancel="cancelCropper">
          <ImageCropper :src="cropperSrc" @addImage="addPreview" />
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

<style scoped>
.cct-photobank-thumb-wrap {
  position: relative;
  flex-shrink: 0;
}

.cct-photobank-thumb {
  max-width: 200px;
  display: block;
  border-radius: 8px;
  border: 1px solid #eee;
}

.cct-photobank-badge {
  position: absolute;
  bottom: 6px;
  left: 6px;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  text-transform: lowercase;
}

.cct-photobank-remove {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  line-height: 22px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 16px;
  cursor: pointer;
}

.cct-photobank-remove:hover {
  background: rgba(0, 0, 0, 0.75);
}
</style>