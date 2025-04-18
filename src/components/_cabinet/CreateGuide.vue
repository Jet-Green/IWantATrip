<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { message } from 'ant-design-vue'; // For user feedback
import { useGuide } from '../../stores/guide';
import { useAuth } from '../../stores/auth'; // Import useAuth
import ImageCropper from '../../components/ImageCropper.vue'; // Assuming ImageCropper is in the same directory or adjust path
let guideStore = useGuide()
let userStore = useAuth()

// --- State ---
const isLoading = ref(false);
const isSaving = ref(false);
const errorMsg = ref('');
const guide = ref({
    name: '',
    surname: '',
    image: '', // URL of the current image
    email: '', // Usually not editable or requires special handling
    phone: '',
    offer: '',
    socialMedia: '',
    description: '',
    location: '',
});

const visibleCropperModal = ref(false);

let imageUrl = ref("")
let currentImg = ref()



// --- Methods ---

async function addGuide() {
    // Basic validation
    if (!(guide.value.name.length > 1 && guide.value.surname.length > 1 && guide.value.phone.length > 2 && guide.value.email.length > 2 && guide.value.offer.length > 2 && guide.value.description.length > 2)) {
        console.log(guide.value.name.length, guide.value.surname.length, guide.value.phone.length, guide.value.email.length, guide.value.offer.length, guide.value.description.length,guide.value.email)
        message.error('Пожалуйста, заполните все обязательные поля.');
        return;
    }
    // Email validation (simple)
    if (!/\S+@\S+\.\S+/.test(guide.value.email)) {
        message.error('Пожалуйста, введите корректный email.');
        return;
    }
    // Phone validation (simple)
    if (!/^\d{11}$/.test(guide.value.phone)) {
        message.error('Пожалуйста, введите корректный номер телефона.');
        return;
    }


    try {
        // 1. Add guide.value text data
        let res = await guideStore.addGuide(guide.value)

        if (res.status === 200 && res.data && res.data._id) {
            const newGuideId = res.data._id; // Get ID of the newly created guide.value

            // 2. Upload image if one was selected/cropped
            if (currentImg.value!=null && typeof currentImg.value=='object'){
                try {
                    await uploadGuideImages(newGuideId);
                    message.success('Гид и фото добавлены.');
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
    // console.log(guide.value,'susususususus')
    let imagesFormData = new FormData();
    // console.log(Date.now())
    imagesFormData.append(
        "guide-image",
        new File([currentImg.value], _id + '_' + Date.now() + ".jpg"),
        _id + '_' + Date.now() + ".jpg"
    );
    let res = await guideStore.uploadGuideImage(imagesFormData)
    // clearNewImageSelection()
    return res
}


function handleImgError() {
    console.warn('Image failed to load:', currentImg.value);
}

</script>

<template>
    <a-spin :spinning="isLoading">
        <div class="guide-profile-editor pa-4">
            <a-alert v-if="errorMsg" :message="errorMsg" type="error" show-icon closable @close="errorMsg = ''"
                class="mb-4" />

            <a-form layout="vertical">
                <a-row :gutter="[16, 16]">
                    <h2>Создать гида</h2>

                    <!-- Image Section -->
                    <a-col :span='24'>
                        <h4>Фотография</h4>
                        <div class="image-preview-container mb-8" v-if="imageUrl">
                            <img :src="imageUrl" alt="Предпросмотр фото" class="preview-image"
                                @error="handleImgError" />
                        </div>
                        <a-button type="dashed" block @click="openImageCropper">
                            <span class="mdi mdi-camera mr-1"></span>
                            Изменить фото
                        </a-button>
                    </a-col>

                    <!-- Text Fields Section -->

                    <a-col :xs="24" :sm="12">
                        <a-form-item label="Имя"
                            help="Имя обязательно">
                            <a-input v-model:value="guide.name" placeholder="Введите имя" />
                        </a-form-item>
                    </a-col>
                    <a-col :xs="24" :sm="12">
                        <a-form-item label="Фамилия">
                            <a-input v-model:value="guide.surname" placeholder="Введите фамилию" />
                        </a-form-item>
                    </a-col>
                    <a-col :xs="24" :sm="12">
                        <a-form-item label="Email (Логин)">
                            <a-input v-model:value="guide.email" placeholder="Email пользователя" />
                        </a-form-item>
                    </a-col>
                    <a-col :xs="24" :sm="12">
                        <a-form-item label="Телефон"
                            help="Телефон обязателен">
                            <a-input v-model:value="guide.phone" placeholder="+7 (XXX) XXX-XX-XX" />
                        </a-form-item>
                    </a-col>
                    <a-col :xs="24">
                        <a-form-item label="Локация / Город">
                            <a-input v-model:value="guide.location" placeholder="Город или регион работы" />
                        </a-form-item>
                    </a-col>
                    <a-col :xs="24">
                        <a-form-item label="Предложение / Специализация">
                            <a-textarea v-model:value="guide.offer"
                                placeholder="Например: Исторические туры по центру города, Гастрономические экскурсии"
                                :rows="3" />
                        </a-form-item>
                    </a-col>
                    <a-col :xs="24">
                        <a-form-item label="Описание">
                            <a-textarea v-model:value="guide.description"
                                placeholder="Расскажите подробнее о себе и своих услугах" :rows="5" />
                        </a-form-item>
                    </a-col>
                    <a-col :xs="24">
                        <a-form-item label="Соц. сети / Сайт">
                            <a-input v-model:value="guide.socialMedia"
                                placeholder="Ссылка на Вконтакте, Instagram, личный сайт и т.д." />
                        </a-form-item>
                    </a-col>
                </a-row>


                <a-col :span="24" class="text-right d-flex space-between">
                    <a-button @click="addGuideModal = false; clearNewImageSelection();" class="mr-8"> Отмена </a-button>
                    <a-button type="primary" @click="addGuide()" style="border-radius: 18px"> Добавить гида </a-button>
                </a-col>
            </a-form>

            <!-- Modals -->
            <a-modal v-model:open="visibleCropperModal" :footer="null" :destroyOnClose="true" title="Обрезать фото">
                <!-- Pass aspect ratio if desired, e.g., :aspectRatio="1" for square -->
                <ImageCropper @addImage="addPreview" :aspectRatio="1 / 1" />
            </a-modal>

        </div>
    </a-spin>
</template>

<style scoped>
.guide-profile-editor {
    max-width: 900px;
    /* Or your desired max width */
    margin: auto;
}

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

.pa-4 {
    padding: 16px;
}

.ma-4 {
    margin: 16px;
}

.mb-4 {
    margin-bottom: 16px;
}

.mt-16 {
    margin-top: 16px;
}

.mr-1 {
    margin-right: 4px;
}

/* Ant input validation styling */
:deep(.ant-form-item-has-error .ant-input),
:deep(.ant-form-item-has-error .ant-input-affix-wrapper),
:deep(.ant-form-item-has-error .ant-input:hover),
:deep(.ant-form-item-has-error .ant-input-affix-wrapper:hover) {
    border-color: #ff4d4f;
}
</style>