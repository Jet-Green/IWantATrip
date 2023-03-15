<script setup>
import BackButton from "../BackButton.vue";
import ImageCropper from "../ImageCropper.vue";

import dayjs from 'dayjs'
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

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

            start.value = dayjs(new Date(d.start))
            end.value = dayjs(new Date(d.end))

            form.value = d;
            for (let i of form.value.images)
                previews.value.push(i)
            quill.value.setHTML(d.description)
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
    if (start.value)
        form.value.start = Number(Date.parse(start.value.$d.toString()));

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
    if (end.value)
        form.value.end = Number(Date.parse(end.value.$d.toString()));
});
let formSchema = yup.object({
    name: yup.string().required("заполните поле"),
    start: yup.object().required("заполните поле"),
    end: yup.object().required("заполните поле"),
    maxPeople: yup.string().required("заполните поле"),
    tripType: yup.string().required("заполните поле"),
    fromAge: yup.string().required("заполните поле"),
    location: yup.string().required("заполните поле"),
    offer: yup.string().required("заполните поле"),
    tripRoute: yup.string().required("заполните поле"),
    // distance: yup.string().required("заполните поле"),
    // cost: yup.string().required("заполните поле"),
    // https://vee-validate.logaretm.com/v4/examples/array-fields/
})
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
                                <a-input placeholder="Название тура" size="large" @update:value="handleChange"
                                    :value="value"></a-input>
                            </Field>
                            <Transition name="fade">
                                <ErrorMessage name="name" class="error-message" />
                            </Transition>
                        </a-col>
                        <a-col :xs="24">
                            Фотографии
                            <div class="d-flex" style="overflow-x: scroll">
                                <img v-for="(pr, i) in previews" :key="i" :src="pr" alt="" class="ma-4"
                                    style="max-width: 200px" @click="
                                        delPhotoDialog = true;
                                    targetIndex = i;" />
                            </div>
                            <a-button type="dashed" block @click="visibleCropperModal = true" class="ma-8">
                                <span class="mdi mdi-12px mdi-plus"></span>
                                Добавить фото
                            </a-button>
                        </a-col>

                        <a-col :span="12">
                            <Field name="start" v-slot="{ value, handleChange }" v-model="start">
                                Дата начала
                                <a-date-picker @update:value="handleChange" :value="value" style="width: 100%"
                                    placeholder="Начало" :locale="ruLocale" :format="dateFormatList" />
                            </Field>
                            <Transition name="fade">
                                <ErrorMessage name="start" class="error-message" />
                            </Transition>
                        </a-col>

                        <a-col :span="12">
                            <Field name="end" v-slot="{ value, handleChange }" v-model="end">
                                Дата конца
                                <a-date-picker @update:value="handleChange" :value="value" style="width: 100%"
                                    placeholder="Конец" :locale="ruLocale" :format="dateFormatList" />
                            </Field>
                            <Transition name="fade">
                                <ErrorMessage name="end" class="error-message" />
                            </Transition>
                        </a-col>

                        <a-col :span="12">
                            Продолжительность
                            <p style="line-height: 40px">{{ form.duration }} дн.</p>
                        </a-col>
                        <a-col :span="12">
                            <Field name="maxPeople" v-slot="{ value, handleChange }" v-model="form.maxPeople">
                                Макс. число людей
                                <a-input-number @update:value="handleChange" :value="value" style="width: 100%"
                                    placeholder="11" :min="1" />
                            </Field>
                            <Transition name="fade">
                                <ErrorMessage name="maxPeople" class="error-message" />
                            </Transition>
                        </a-col>

                        <a-col :span="24">
                            Цены
                            <div v-for="item in form.cost" :key="item.type" style="display: flex" align="baseline"
                                class="mb-16">
                                <a-input v-model:value="item.first" placeholder="Для кого" />

                                <a-input-number v-model:value="item.price" style="width: 100%" placeholder="Цена" :min="0"
                                    :step="0.01" class="ml-16 mr-16" />

                <a-button @click="removeCost(item)" shape="circle">
                  <span class="mdi mdi-minus" style="cursor: pointer"></span>
                </a-button>
              </div>

                            <a-button type="dashed" block @click="addCost" class="ma-8">
                                <span class="mdi mdi-12px mdi-plus"></span>
                                Добавить цены
                            </a-button>
                        </a-col>

                        <a-col :xs="24" :md="12">
                            <Field name="tripType" v-slot="{ value, handleChange }" v-model="form.tripType">
                                Тип тура
                                <div>
                                    <a-select @update:value="handleChange" :value="value" style="width: 100%">
                                        <a-select-option v-for="tripType in appStore.appState[0].tripType"
                                            :value="tripType">{{ tripType
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
                                <a-input-number @update:value="handleChange" :value="value" style="width: 100%"
                                    placeholder="10" :min="0" :max="100" />
                            </Field>
                            <Transition name="fade">
                                <ErrorMessage name="fromAge" class="error-message" />
                            </Transition>
                        </a-col>

                        <a-col :xs="24" :md="12">
                            <Field name="location" v-slot="{ value, handleChange }" v-model="form.location">
                                Направление
                                <a-input placeholder="Байкал" size="large" @update:value="handleChange"
                                    :value="value"></a-input>
                            </Field>
                            <Transition name="fade">
                                <ErrorMessage name="location" class="error-message" />
                            </Transition>
                        </a-col>



                        <a-col :span="24">
                            <Field name="offer" v-slot="{ value, handleChange }" v-model="form.offer">
                                Реклама
                                <a-textarea @update:value="handleChange" :value="value"
                                    placeholder="завлекательное описание" size="large">
                                </a-textarea>
                            </Field>
                            <Transition name="fade">
                                <ErrorMessage name="offer" class="error-message" />
                            </Transition>
                        </a-col>

                        <a-col :span="24">
                            <Field name="tripRoute" v-slot="{ value, handleChange }" v-model="form.tripRoute">
                                Маршрут
                                <a-textarea @update:value="handleChange" :value="value" placeholder="Глазов-Пермь 300км"
                                    size="large">
                                </a-textarea>
                            </Field>
                            <Transition name="fade">
                                <ErrorMessage name="tripRoute" class="error-message" />
                            </Transition>
                        </a-col>

                        <a-col :span="24" style="display: flex; flex-direction: column">
                            Описание программы
                            <QuillEditor theme="snow" ref="quill" v-model:content="description" contentType="html" :toolbar="[
                                // [{ header: [2, 3] }],
                                ['bold', 'italic', 'underline'],
                                [{ list: 'ordered' }, { list: 'bullet' }],
                                [{ color: ['#000000', '#ff6600', '#3daff5'] }],
                                [{ align: [] }],
                            ]" />
                        </a-col>
                        <a-col :span="24" class="d-flex justify-center">
                            <a-button :disabled="!meta.valid" class="lets_go_btn mt-8" type="primary" size="large"
                                html-type="submit">Отправить
                            </a-button>
                        </a-col>
                    </a-row>
                </Form>
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
