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
let possibleLocations = ref([]);
let locationSearchRequest = ref("")

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
    tripType: "",
    fromAge: "",
    startLocation: null,
    bonuses: [],
    returnConditions: '',
    rejected: false,
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

const removeBonuses = (item) => {
    let index = form.value.bonuses.indexOf(item);
    if (index !== -1) {
        form.value.bonuses.splice(index, 1);
    }
};

const addBonuses = () => {
    form.value.bonuses.push({
        type: "",
        bonus: "",
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
    form.value.isModerated = false
    form.value.rejected = false
    if (form.value.calculator?.length == 0)
        form.value.calculator = null
    TripService.updateTrip(form.value).then((res) => {
        const _id = res.data._id;
        let imagesFormData = new FormData();

        for (let i = 0; i < images.length; i++) {
            let index = i + form.value.images.length
            imagesFormData.append('trip-image', images[i], _id + '_' + index + '.img')
        }
        function close() {
            router.push('/cabinet/me')
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
const clearData = (dataString) => {
    const dataFromString = new Date(Number(dataString));
    return dataFromString;
};

onMounted(() => {
    tripStore.getById(router.currentRoute.value.query._id)
        .then((response) => {
            let d = response.data;
            delete d.__v

            start.value = dayjs(new Date(d.start))
            end.value = dayjs(new Date(d.end))
            locationSearchRequest.value = d.startLocation.name

            form.value = d;
            for (let i of form.value.images)
                previews.value.push(i)
            quill.value.setHTML(d.description)
        })
        .catch((error) => {
            console.log(error);
        });

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
    if (start.value)
        form.value.start = Number(Date.parse(start.value.$d.toString()));

});
watch(end, () => {
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
    offer: yup.string().required("заполните поле"),
    tripRoute: yup.string().required("заполните поле"),
    duration: yup.string().required("заполните поле"),
    returnConditions: yup.string().required("заполните поле"),
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
                                <img v-for="(pr, i) in        previews       " :key="i" :src="pr" alt="" class="ma-4"
                                    style="max-width: 200px; min-width: 50px; background:#ccc" @click="delPhotoDialog = true;
            targetIndex = i;" />
                            </div>
                            <a-button type="dashed" block @click=" visibleCropperModal = true" class="ma-8">
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
                            <Field name="duration" v-slot="{ value, handleChange }" v-model="form.duration">
                                Продолжительность
                                <a-input placeholder="6 дней/ 7 ночей" @update:value="handleChange" :value="value"
                                    :maxlength="20" show-count></a-input>
                            </Field>
                            <Transition name="fade">
                                <ErrorMessage name="duration" class="error-message" />
                            </Transition>
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
                            <div v-for="       item        in        form.cost       " :key="item.type"
                                style="display: flex" align="baseline" class="mb-16">
                                <a-input v-model:value="item.first" placeholder="Для кого" />

                                <a-input-number v-model:value="item.price" style="width: 100%" placeholder="Цена"
                                    :min="0" :step="0.01" class="ml-16 mr-16" />

                                <a-button @click=" removeCost(item)" shape="circle">
                                    <span class="mdi mdi-minus" style="cursor: pointer"></span>
                                </a-button>
                            </div>

                            <a-button type="dashed" block @click="addCost" class="ma-8">
                                <span class="mdi mdi-12px mdi-plus"></span>
                                Добавить цены
                            </a-button>
                        </a-col>

                        <a-col :span="24">
                            Бонусы и скидки
                            <div v-for="       item        in        form.bonuses       " :key="item"
                                style="display: flex" align="baseline" class="mb-16">
                                <a-input v-model:value="item.type" placeholder="Количество человек" />

                                <a-input v-model:value="item.bonus" style="width: 100%" placeholder="Бонусы или скидки"
                                    class="ml-16 mr-16" />

                                <a-button @click=" removeBonuses(item)" shape="circle">
                                    <span class="mdi mdi-minus" style="cursor: pointer"></span>
                                </a-button>
                            </div>

                            <a-button type="dashed" block @click="addBonuses" class="ma-8">
                                <span class="mdi mdi-12px mdi-plus"></span>
                                Добавить бонусы и скидки
                            </a-button>
                        </a-col>

                        <a-col :xs="24" :md="12">
                            <Field name="tripType" v-slot="{ value, handleChange }" v-model="form.tripType">
                                Тип тура
                                <div>
                                    <a-select @update:value="handleChange" :value="value" style="width: 100%">
                                        <a-select-option
                                            v-for="       tripType        in        appStore.appState[0].tripType       "
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

                        <a-col :xs="24">
                            <Field name="startLocation" v-slot="{ value, handleChange }"
                                v-model="locationSearchRequest">
                                Место старта
                                <a-auto-complete :value="value" @update:value="handleChange" style="width: 100%"
                                    :options="possibleLocations" placeholder="Глазов" @select="selectStartLocation">
                                </a-auto-complete>
                            </Field>
                            <Transition name="fade">
                                <ErrorMessage name="location" class="error-message" />
                            </Transition>

                        </a-col>

                        <a-col :span="24">
                            <Field name="offer" v-slot="{ value, handleChange }" v-model="form.offer">
                                Краткое описание
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
                                Ключевые точки
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

                            <QuillEditor theme="snow" ref="quill" v-model:content="description" contentType="html"
                                :toolbar="[['bold', 'italic', 'underline', { color: ['#000000', '#ff6600', '#3daff5'] }], [{ list: 'ordered' }, { list: 'bullet' }, { align: [] }], ['link']]" />
                        </a-col>
                        <a-col :span="24">
                            <Field name="returnConditions" v-slot="{ value, handleChange }"
                                v-model="form.returnConditions">
                                Условия возврата
                                <a-textarea @update:value="handleChange" :value="value" placeholder="" size="large">
                                </a-textarea>
                            </Field>
                            <Transition name="fade">
                                <ErrorMessage name="offer" class="error-message" />
                            </Transition>
                        </a-col>
                        <a-col :span="24" class="d-flex justify-center">
                            <a-button :disabled="!meta.valid" class="lets_go_btn ma-36" type="primary"
                                html-type="submit">Отправить
                            </a-button>
                        </a-col>
                    </a-row>
                </Form>
                <a-modal v-model:open="visibleCropperModal" :footer="null">
                    <ImageCropper @addImage="addPreview" />
                </a-modal>
                <a-modal v-model:open="delPhotoDialog" :footer="null">
                    <h3>Удалить фото?</h3>
                    <div class="d-flex justify-center">
                        <a-button class="mt-16" type="primary" @click="delPhoto">Да
                        </a-button>
                    </div>
                </a-modal>
            </a-col>
        </a-row>
    </div>
</template>
