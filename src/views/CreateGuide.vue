<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue';
import BackButton from '../components/BackButton.vue';
import { message } from 'ant-design-vue'; // For user feedback
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useGuide } from '../stores/guide';
import { useAuth } from '../stores/auth'; // Import useAuth
import ImageCropper from '../components/ImageCropper.vue'; // Assuming ImageCropper is in the same directory or adjust path

import { useRouter } from "vue-router";
const router = useRouter();

let guideStore = useGuide()
let userStore = useAuth()

// --- State ---
const isLoading = ref(false);
const isSaving = ref(false);
const errorMsg = ref('');
const guide = ref({
    name: '',
    surname: '',
    image: '',
    email: '',
    phone: '',
    user: userStore.user._id,
    offer: '',
    socialMedia: '',
    description: '',
    location: null,
    type: "Знаток города",
});
const guideTypes = ref([
    { label: "Знаток города", value: "Знаток города" },
    { label: "Аккредитован", value: "Аккредитован" },
])
let formSchema = yup.object({
    name: yup.string().required("заполните поле"),
    surname: yup.string().required("заполните поле"),
    // email: yup.string().required("заполните поле").email('неверный формат'),
    // phone: yup.string().required("заполните поле"),
    offer: yup.string().required("заполните поле"),
    description: yup.string().required("заполните поле"),
});
let isLocationValid = computed(() => {
    // console.log(guide.value.location)
    return guide.value.location?.coordinates?.length == 2
})

const visibleCropperModal = ref(false);

let possibleLocations = ref([])
let locationSearchRequest = ref("")

let imageUrl = ref("")
let currentImg = ref()

async function submit() {
    try {
        // 1. Add guide.value text data
        let res = await guideStore.addGuide(guide.value)

        if (res.status === 200 && res.data && res.data._id) {
            const newGuideId = res.data._id; // Get ID of the newly created guide.value

            // 2. Upload image if one was selected/cropped
            if (currentImg.value != null && typeof currentImg.value == 'object') {
                try {
                    await uploadGuideImages(newGuideId);
                    message.success('Гид добавлены');
                } catch (imgError) {
                    console.error("Error uploading guide.value image:", imgError);
                    message.warning(`Гид добавлен, но не удалось загрузить фото: ${imgError.message || 'Проверьте консоль'}`);
                    // guide.value added, but image failed. Still proceed with cleanup.
                }
            } else {
                message.success('Гид добавлен.');
            }

            // 3. Reset form and state, close modal, refresh list
            guide.value = { // Reset form fields
                name: '', surname: '', email: '', phone: '',
                socialMedia: '', offer: '', description: '', location: ''
            };
            clearNewImageSelection(); // Reset image state
            router.push('/cabinet/me');


        } else {
            message.error(`Не удалось добавить гида: ${res.data?.message || 'Статус ' + res.status}`);
        }
    } catch (err) {
        console.error("Error adding guide.value:", err);
        message.error(`Ошибка при добавлении гида: ${err.response?.data?.message || err.message}`);
    }
}


function openImageCropper() {
    visibleCropperModal.value = true;
}

// Called when ImageCropper emits 'addImage'
function addPreview(blob) {
    visibleCropperModal.value = false; // Close cropper modal
    if (currentImg.value != "") {
        // Clean up previous blob URL
        URL.revokeObjectURL(currentImg.value);
    }
    currentImg.value = blob;
    imageUrl.value = URL.createObjectURL(blob);
}

function clearNewImageSelection() {
    if (imageUrl.value) {
        URL.revokeObjectURL(imageUrl.value);
    }
    currentImg.value = null
    imageUrl.value = null
}

async function uploadGuideImages(_id) {
    let imagesFormData = new FormData();
    imagesFormData.append(
        "guide-image",
        new File([currentImg.value], _id + '_' + Date.now() + ".jpg"),
        _id + '_' + Date.now() + ".jpg"
    );
    let res = await guideStore.uploadGuideImage(imagesFormData)
    return res
}
function selectLocation(selected) {
    for (let l of possibleLocations.value) {
        // l.value - name
        if (l.value == selected) {
            guide.value.location = l.location
        }
    }
    console.log(guide.value)
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
                            Number(s.data.geo_lon),
                            Number(s.data.geo_lat)
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


function handleImgError() {
    console.warn('Image failed to load:', currentImg.value);
}

</script>

<template>
    <div>
        <BackButton />
        <div> <a-spin :spinning="isLoading"></a-spin></div>
        <a-row type="flex" justify="center">
            <a-col :xs="22" :lg="12">
                <h2>Создать гида</h2>
                <!-- <a-alert v-if="errorMsg" :message="errorMsg" type="error" show-icon closable @close="errorMsg = ''"
                class="mb-4" /> -->

                <Form :validation-schema="formSchema" v-slot="{ meta }" @submit="submit">
                    <a-row :gutter="[16, 16]">


                        <a-col :span="24">
                            <h4>Фотография *</h4>
                            <div class="image-preview-container mb-8" v-if="imageUrl">
                                <img :src="imageUrl" alt="Предпросмотр фото" class="preview-image"
                                    @error="handleImgError" />
                            </div>
                            <a-button type="dashed" block @click="openImageCropper">
                                <span class="mdi mdi-camera mr-1"></span>
                                Изменить фото
                            </a-button>
                        </a-col>


                        <a-col :span="24">
                            <Field name="name" v-slot="{ value, handleChange }" v-model="guide.name">
                                Имя *
                                <a-input placeholder="Иван" @update:value="handleChange" :value="value"
                                    allow-clear></a-input>
                            </Field>
                            <Transition name="fade">
                                <ErrorMessage name="name" class="error-message" />
                            </Transition>
                        </a-col>

                        <a-col :span="24">
                            <Field name="surname" v-slot="{ value, handleChange }" v-model="guide.surname">
                                Фамилия *
                                <a-input placeholder="Петров" @update:value="handleChange" :value="value"
                                    allow-clear></a-input>
                            </Field>
                            <Transition name="fade">
                                <ErrorMessage name="surname" class="error-message" />
                            </Transition>
                        </a-col>

                        <a-col :span="24">
                            <Field name="email" v-slot="{ value, handleChange }" v-model="guide.email">
                                Email (Логин)
                                <a-input placeholder="petrov@yandex.ru" @update:value="handleChange" :value="value"
                                    allow-clear></a-input>
                            </Field>
                            <Transition name="fade">
                                <ErrorMessage name="email" class="error-message" />
                            </Transition>
                        </a-col>

                        <a-col :span="24">
                            <Field name="phone" v-slot="{ value, handleChange }" v-model="guide.phone">
                                Телефон
                                <a-input placeholder="89099099090" @update:value="handleChange" :value="value"
                                    allow-clear></a-input>
                            </Field>
                            <Transition name="fade">
                                <ErrorMessage name="phone" class="error-message" />
                            </Transition>
                        </a-col>

                        <a-col :span="24">
                            <Field name="location" v-slot="{ value, handleChange }" v-model="locationSearchRequest">
                                Локация / Город *
                                <a-auto-complete :value="value" @update:value="handleChange" style="width: 100%"
                                    :options="possibleLocations" placeholder="Город или регион работы"
                                    @select="selectLocation">
                                </a-auto-complete>
                            </Field>
                            <Transition name="fade">
                                <ErrorMessage name="location" class="error-message" />
                            </Transition>
                        </a-col>

                        <a-col :span="24">
                            <Field name="type" v-slot="{ value, handleChange }" v-model="guide.type">
                                Тип *
                                <a-radio-group @update:value="handleChange" :value="value" :options="guideTypes"
                                    style="width: 100%;" />
                            </Field>
                            <Transition name="fade">
                                <ErrorMessage name="type" class="error-message" />
                            </Transition>
                        </a-col>

                        <a-col :span="24">
                            <Field name="socialMedia" v-slot="{ value, handleChange }" v-model="guide.socialMedia">
                                Соц. сети / Сайт
                                <a-input @update:value="handleChange" :value="value"
                                    placeholder="Ссылка на Вконтакте, Instagram, личный сайт и т.д." allow-clear />
                            </Field>
                            <Transition name="fade">
                                <ErrorMessage name="socialMedia" class="error-message" />
                            </Transition>
                        </a-col>

                        <a-col :span="24">
                            <Field name="offer" v-slot="{ value, handleChange }" v-model="guide.offer">
                                Краткое описание *
                                <a-textarea @update:value="handleChange" :value="value"
                                    placeholder="Например: Исторические туры по центру города, Гастрономические экскурсии"
                                    :rows="2" allow-clear show-count :maxlength="60" />
                            </Field>
                            <Transition name="fade">
                                <ErrorMessage name="offer" class="error-message" />
                            </Transition>
                        </a-col>

                        <a-col :span="24">
                            <Field name="description" v-slot="{ value, handleChange }" v-model="guide.description">
                                Описание *
                                <a-textarea @update:value="handleChange" :value="value"
                                    placeholder="Расскажите подробнее о себе и своих услугах" :rows="5" allow-clear
                                    show-count :maxlength="1000" />
                            </Field>
                            <Transition name="fade">
                                <ErrorMessage name="description" class="error-message" />
                            </Transition>
                        </a-col>

                    </a-row>
                    <a-col :span="24" class="d-flex justify-center">

                        <a-button class="lets_go_btn ma-36" type="primary" html-type="submit"
                            :disabled="!meta.valid || !isLocationValid">Добавить гида
                        </a-button>
                    </a-col>
                </Form>
                <a-modal v-model:open="visibleCropperModal" :footer="null" :destroyOnClose="true">
                    <ImageCropper @addImage="addPreview" :aspectRatio="1 / 1" />
                </a-modal>
            </a-col>
        </a-row>
    </div>
</template>

<style scoped>
.image-preview-container {
    width: 100%;
    max-width: 200px;
    /* Limit preview size */
    aspect-ratio: 1 / 1;
    /* Maintain square aspect ratio */
    border: 1px dashed #d9d9d9;
    border-radius: 4px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fafafa;
}

.preview-image {
    display: block;
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
    height: 100%;
    width: 100%;
}

.new-image-overlay {
    position: absolute;
    inset: 0;
    /* Covers the entire container */
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 8px;
    font-size: 0.9em;
}

.new-image-overlay p {
    margin-bottom: 8px;
}
</style>