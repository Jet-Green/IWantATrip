<script setup>
import { watch, nextTick, ref, reactive, onMounted } from "vue";
import BackButton from '../components/BackButton.vue';
import ImageCropper from "../components/ImageCropper.vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

import { useRouter } from 'vue-router';
import { useExcursion } from '../stores/excursion'


const excursionStore = useExcursion()
const router = useRouter()
let visibleCropperModal = ref(false);
let previews = ref(localStorage.getItem('createTripImages') ? JSON.parse(localStorage.getItem('createTripImages')) : []);
let images = localStorage.getItem('createTripImages') ? JSON.parse(localStorage.getItem('createTripImages')) : []; // type: blob
const delPhotoDialog = ref(false);
// add img

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
function handleImgError(i) {
  previews.value.splice(i, 1)
  images.splice(i, 1)
  localStorage.setItem('createTripImages', JSON.stringify(previews.value))
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
      localStorage.removeItem('createTripImages')
    })

  }
// add img



let form = reactive({

  name: '',
  contacts: {
    phone: '',
    email: ''
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
  prices: [{}],
  images: [''],
  minAge: 0,
  deadline: '',
  requirements: '',
  availability: ''

})

let formSchema = yup.object({
  name: yup.string().required("заполните поле"),
})
async function submit() {
  let response = await excursionStore.create(form)
  if (response.status == 200) {
    router.push('/cabinet/me')
  }
}
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
              <Field name="name">
                Название экскурсии
                <a-input placeholder="Моя профессия - металлург" v-model="form.name" />
                <ErrorMessage name="name" class="error-message" />
              </Field>
            </a-col>
            <a-col :xs="24">
              Фотографии
              <div class="d-flex" style="overflow-x: scroll">
                <img v-for="(pr, i) in    previews   " :key="i" :src="pr" alt="" class="ma-4" style="max-width: 200px;"
                  @click="delPhotoDialog = true;
      targetIndex = i;" @error="handleImgError(i)" />
              </div>
              <a-button type="dashed" block @click="visibleCropperModal = true" class="ma-8">
                <span class="mdi mdi-12px mdi-plus"></span>
                Добавить фото
              </a-button>
            </a-col>

            <a-col :span="24">
              <Field name="description">
                Описание
                <a-textarea
                  placeholder="Мы посетим завод ЧМЗ, познакомимся с профессией металлург, узнаем об особенностях профессии"
                  v-model="form.description" />
                <ErrorMessage name="description" class="error-message" />
              </Field>
            </a-col>
            <a-col :span="24">
              <Field name="requirements">
                Особые требования
                <a-textarea placeholder="паспорт, бахилы, теплая одежда" v-model="form.requirements" />
                <ErrorMessage name="requirements" class="error-message" />
              </Field>
            </a-col>
            <!-- добавить ddata -->
            <a-col :span="24">

              <Field name="location">
                Город проведения
                <a-textarea placeholder="Глазов" v-model="form.location" />
                <ErrorMessage name="location" class="error-message" />
              </Field>
            </a-col>
            <!-- добавить ddata -->
            <a-col :span="24">
              <Field name="startPlace">
                Место начала
                <a-input placeholder="Западная проходная ЧМЗ" v-model="form.startPlace" />
                <ErrorMessage name="startPlace" class="error-message" />
              </Field>
            </a-col>
            <a-col :span="24" :md="12">
              <Field name="duration">
                Продолжительность
                <a-input placeholder="1 час" v-model="form.duration" />
                <ErrorMessage name="duration" class="error-message" />
              </Field>
            </a-col>

            <a-col :span="24" :md="12">
              <Field name="deadline">
                <div>Срок подачи заявки</div>
                <a-input placeholder="За 10 дней" v-model="form.deadline" />
                <ErrorMessage name="deadline" class="error-message" />
              </Field>
            </a-col>
            <a-col :span="24" :md="12">
              <Field name="minPeople">
                <div> Минимальное количество</div>
                <a-input-number min="1" placeholder="5" v-model="form.minPeople" style="width: 100%;" />
                <ErrorMessage name="minPeople" class="error-message" />
              </Field>
            </a-col>
            <a-col :span="24" :md="12">
              <Field name="maxPeople">
                <div>Максимальное количество</div>
                <a-input-number min="1" placeholder="15" v-model="form.maxPeople" style="width: 100%;" />
                <ErrorMessage name="maxPeople" class="error-message" />
              </Field>
            </a-col>
            <a-col :span="24">
              <Field name="guides">
                Экскурсовод
                <a-input placeholder="Александр Невский" v-model="form.guides[0].name" />
                <ErrorMessage name="guides" class="error-message" />
              </Field>
            </a-col>

            <a-col :span="24" :md="12">
              <Field name="minAge">
                <div> Минимальный возраст</div>

                <a-input-number min="0" placeholder="14 лет" v-model="form.minAge" style="width: 100%;" />
                <ErrorMessage name="minAge" class="error-message" />
              </Field>
            </a-col>


            <a-col :span="24" :md="12">
              <Field name="availability">
                <div>ОВЗ доступность</div>
                <a-input placeholder="да/нет" v-model="form.availability" />
                <ErrorMessage name="availability" class="error-message" />
              </Field>
            </a-col>
            <a-col :span="24" :md="12">
              <Field name="phone">
                Телефон
                <a-input placeholder="8909909909" v-model="form.contacts.phone" />
                <ErrorMessage name="phone" class="error-message" />
              </Field>
            </a-col>
            <a-col :span="24" :md="12">
              <Field name="email">
                E-mail
                <a-input placeholder="teat@ya.ru" v-model="form.contacts.email" />
                <ErrorMessage name="email" class="error-message" />
              </Field>
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
