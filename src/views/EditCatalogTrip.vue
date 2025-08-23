<script setup>
import BackButton from "../components/BackButton.vue";
import ImageCropper from "../components/ImageCropper.vue";

import { watch, nextTick, ref, reactive, onMounted } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

// import typeOfTrip from "../fakeDB/tripType";
import { message } from "ant-design-vue";
import { useRouter, useRoute } from "vue-router";
import { useTrips } from "../stores/trips";
import { useAuth } from "../stores/auth";
import { useAppState } from "../stores/appState";
import TripService from "../service/TripService";


import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";



const TripStore = useTrips();
const userStore = useAuth();
const appStore = useAppState();


const quill = ref(null);

const delPhotoDialog = ref(false);
const targetIndex = ref(null);
const router = useRouter();
const route = useRoute();
const duration = ref(null);
const catalog = ref({})

let possibleLocations = ref([])
// cropper
let visibleCropperModal = ref(false);
let previews = ref([]);
// отправляем на сервер
let images = []; // type: blob
let locationSearchRequest = ref("")
let clearingImg = true
// необходимо добавить поле количество людей в туре
let form = ref({
  _id: "",
  name: "",
  duration: "",
  images: [],
  tripRoute: "",
  offer: "",
  description: "",
  rejected: Boolean,
  startLocation: {},
  tripType: "",
  fromAge: "",
  isHidden: Boolean,
  isModerated: Boolean,
  author: "",
  moderationMessage: "",
});


function close() {
  router.push("/cabinet/created-trips/");
  clearForm()
}
function clearForm() {
  form.value = {
    name: "",
    duration: "",
    images: [],
    tripRoute: "",
    offer: "",
    description: '',
    tripType: "",
    fromAge: "",
    author: "",
    startLocation: "",
    isModerated: false,

  };
  quill.value.setHTML("");
  images = []
}
function uploadTripImages(_id) {
  let imagesFormData = new FormData();
  for (let i = 0; i < form.value.images.length; i++) {
    imagesFormData.append(
      "trip-image",
      new File([images[i]], _id + "_" + i + ".jpg"),
      _id + "_" + i + ".jpg"
    );
  }

  TripService.uploadCatalogTripImages(imagesFormData).then(() => {
    console.log("фото обновлено")
  })

}

let submitCount = ref(0)

async function submit() {
  submitCount.value += 1
  if (submitCount.value > 1) {
    return
  }
  form.value.isModerated = false
  if (!clearingImg) {
    uploadTripImages(form.value._id)
    delete form.value.images
  }
  

  TripStore.editCatalogTrip(form.value._id, form.value).then(() => {
    message.config({ duration: 1.5, top: "70vh" });
    message.success({
      content: "Тур в каталоге обновлен", onClose: () => {
        close()
      },
    });
  })

}


function addPreview(blob) {
  if (clearingImg) {
    clearingImg = false;
    form.value.images = []
    images = []
  }
  visibleCropperModal.value = false;

  form.value.images.push(URL.createObjectURL(blob));
  images.push(blob);
}
const delPhoto = () => {

  form.value.images.splice(targetIndex.value, 1);
  images.splice(targetIndex.value, 1);
  delPhotoDialog.value = false;

};
function selectStartLocation(selected) {
  for (let l of possibleLocations.value) {
    // l.value - name
    if (l.value == selected) {
      form.value.startLocation = l.location
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



let formSchema = yup.object({
  name: yup.string().required("заполните поле"),
  duration: yup.string().required("заполните поле"),
  tripType: yup.string().required("заполните поле"),
  fromAge: yup.string().required("заполните поле"),
  offer: yup.string().required("заполните поле"),
  tripRoute: yup.string().required("заполните поле"),
  // startLocation: yup.string().required("заполните поле"),
  // https://vee-validate.logaretm.com/v4/examples/array-fields/
});

onMounted(async () => {
  const tripId = route.query.id;
  let res = await TripStore.getFullCatalogById(tripId)
  form.value = res.data
  if (form?.value?.startLocation?.name) { locationSearchRequest.value = form.value.startLocation.name }
  else {
    locationSearchRequest.value = ""
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
              <h2>Редактировать тур из каталога</h2>
            
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
                <img v-for="(pr, i) in form.images" :key="i" :src="pr" alt="" class="ma-4" style="max-width: 200px;"
                  @click="delPhotoDialog = true;
                  targetIndex = i;" />
              </div>
              <a-button type="dashed" block @click="visibleCropperModal = true" class="ma-8">
                <span class="mdi mdi-12px mdi-plus"></span>
                Добавить фото
              </a-button>
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

              <QuillEditor theme="snow" ref="quill" v-model:content="form.description" contentType="html"
                :toolbar="[['bold', 'italic', 'underline', { color: ['#000000', '#ff6600', '#3daff5'] }], [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }], ['link']]" />
            </a-col>
            <a-col :span="24" class="d-flex justify-center">
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