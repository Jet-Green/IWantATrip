<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useGuide } from '../../stores/guide';
import { useRouter } from "vue-router";
import { message } from 'ant-design-vue';
import ImageCropper from '../../components/ImageCropper.vue'; // Import the cropper

let guideStore = useGuide()
const router = useRouter();

let dbSkip = ref(0)
let limit = ref(true) // Initialize limit correctly
let addGuideModal = ref(false)
let query = ref("")
let guide = ref({
    name: '',
    surname: '',
    email: '',
    phone: '',
    image: '', // Image URL will be set after upload
    socialMedia: '',
    offer: '',
    description: '',
    location: ''
})

let guides = ref([])

// --- Image Handling State (similar to CabinetGuide) ---
let visibleCropperModal = ref(false);
let previewImageUrl = ref(null); // For displaying the selected/cropped image preview
let currentImgBlob = ref(null); // To store the actual Blob data for upload

// --- Methods ---

async function refreshGuides() {
    // Reset state for potentially new search/load
    dbSkip.value = 0;
    guides.value = [];
    limit.value = true; // Allow fetching again
    await loadMoreGuides(); // Load initial batch
}

async function loadMoreGuides() {
    if (!limit.value) return; // Stop if server indicated no more data

    try {
        let res = await guideStore.getGuides(query.value, dbSkip.value)
        if (res.data && res.data.data) {
            dbSkip.value = res.data.dbSkip
            guides.value.push(...res.data.data)
            if (res.data.ended) {
                limit.value = false // No more data to load
            }
        } else {
            limit.value = false; // Assume end if data is unexpected
        }
    } catch (error) {
        console.error("Error fetching guides:", error);
        message.error("Не удалось загрузить гидов.");
        limit.value = false; // Stop trying on error
    }
}


async function addGuide() {
    // Basic validation
    if (!(guide.value.name.length > 1 && guide.value.surname.length > 1 && guide.value.phone.length > 2 && guide.value.email.length > 2 && guide.value.offer.length > 2
        && guide.value.description.length > 2)) {
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
        // 1. Add guide text data
        let res = await guideStore.addGuide(guide.value)

        if (res.status === 200 && res.data && res.data._id) {
            const newGuideId = res.data._id; // Get ID of the newly created guide

            // 2. Upload image if one was selected/cropped
            if (currentImgBlob.value) {
                try {
                    await uploadNewGuideImage(newGuideId);
                    message.success('Гид и фото добавлены.');
                } catch (imgError) {
                    console.error("Error uploading guide image:", imgError);
                    message.warning(`Гид добавлен, но не удалось загрузить фото: ${imgError.message || 'Проверьте консоль'}`);
                    // Guide added, but image failed. Still proceed with cleanup.
                }
            } else {
                message.success('Гид добавлен.');
            }

            // 3. Reset form and state, close modal, refresh list
            addGuideModal.value = false;
            guide.value = { // Reset form fields
                name: '', surname: '', email: '', phone: '',
                socialMedia: '', offer: '', description: '', location: ''
            };
            clearNewImageSelection(); // Reset image state
            await refreshGuides(); // Refresh the list to show the new guide
            router.push("/cabinet/guides");

        } else {
            message.error(`Не удалось добавить гида: ${res.data?.message || 'Статус ' + res.status}`);
        }
    } catch (err) {
        console.error("Error adding guide:", err);
        message.error(`Ошибка при добавлении гида: ${err.response?.data?.message || err.message}`);
    }
}

// --- Image Handling Methods (adapted from CabinetGuide) ---

function openImageCropper() {
    visibleCropperModal.value = true;
}

// Called when ImageCropper emits 'addImage'
function addPreview(blob) {
    visibleCropperModal.value = false; // Close cropper modal
    if (previewImageUrl.value) {
        // Clean up previous blob URL if exists
        URL.revokeObjectURL(previewImageUrl.value);
    }
    currentImgBlob.value = blob; // Store the actual blob
    previewImageUrl.value = URL.createObjectURL(blob); // Create URL for preview <img>
}

function clearNewImageSelection() {
    if (previewImageUrl.value) {
        URL.revokeObjectURL(previewImageUrl.value);
    }
    currentImgBlob.value = null;
    previewImageUrl.value = null;
}

async function uploadNewGuideImage(_id) {
    if (!currentImgBlob.value) return; // Should not happen if called correctly, but safety check

    let imagesFormData = new FormData();
    const timestamp = Date.now();
    const filename = `${_id}_${timestamp}.jpg`; // Create a unique filename
    imagesFormData.append(
        "guide-image", // Matches server expectation (ensure this is correct)
        new File([currentImgBlob.value], filename, { type: 'image/jpeg' }), // Create File object
        filename
    );

    // Assuming guideStore.uploadGuideImage handles the actual API call
    let res = await guideStore.uploadGuideImage(imagesFormData);
    if (res.status !== 200) {
        // Throw error to be caught by the caller (addGuide)
        throw new Error(res.data?.message || `Ошибка загрузки фото (статус ${res.status})`);
    }
    // No need to clear selection here, handled in addGuide success flow
    return res; // Return response if needed elsewhere
}

function handleImgError() {
    console.warn('Preview image failed to load:', previewImageUrl.value);
    // Optionally set a placeholder or clear the preview if loading fails
    message.error("Не удалось загрузить превью изображения.")
    clearNewImageSelection(); // Clear the broken preview
}
let deleteGuide = async (_id) => {
    await guideStore.deleteGuideById(_id)

    await refreshGuides()
}

// --- Lifecycle Hooks ---
onMounted(async () => {
    await loadMoreGuides(); // Load initial guides on mount
})

</script>

<template>
    <a-col :span="24" class="d-flex space-between align-center mb-16">
        <div class="d-flex align-center">
            <h2>Гиды</h2>
            <a-button type="primary" @click="addGuideModal = true;" style="border-radius: 18px" class="ml-8">
                Добавить
            </a-button>
        </div>
        <div>
            <a-input-search v-model:value="query" placeholder="поиск по имени, email..." allow-clear enter-button
                @search="refreshGuides" style="width: 250px" />
        </div>
    </a-col>

    <a-row :gutter="[16, 16]">
        <a-col v-for="g in guides" :key="g._id" :xs="24" :sm="12" :lg="8" :xl="6" class="mb-8">
            <a-card hoverable style="border-radius: 10px;" class="pa-4">
                <a-card-meta>
                    <template #title>
                    <div class="d-flex" style="flex-wrap: wrap;">
                            
                            <div class="d-flex space-between" style="width: 100%;">
                            <a-avatar :size="40" :src="g.image"/>

                            <a-popconfirm title="Удалить гида?" ok-text="Да" cancel-text="Нет"
                                @confirm="deleteGuide(g._id)">
                                <a-button type="primary" style="border-radius: 18px" class="mt-4">
                                    <template #icon>
                                        <span class="mdi mdi-delete"></span>
                                    </template>
                                </a-button>
                            </a-popconfirm>
                        </div>
                        <span>{{ g.name + ' ' + g.surname }}</span>
                    </div>
                    </template>
                    <!-- <template #avatar>
                            <a-avatar :size="40" :src="g.image" class="mr-8" style=""/>
                        </template> -->
                </a-card-meta>
                <div class="mt-8 card-content">
                    <!-- <p><b>О себе:</b> {{ g.description }}</p> -->
                    <div class="text-truncate"> {{ g.offer }}</div>
                    <p v-if="g.location"><b>Локации:</b> {{ g.location }}</p>
                    <!-- <p v-if="g.phone"><b>Тел:</b> {{ g.phone }}</p>
                    <p v-if="g.email"><b>Email:</b> {{ g.email }}</p>
                    <p v-if="g.socialMedia"><b>Соц.сеть:</b> <a :href="g.socialMedia" target="_blank" rel="noopener noreferrer">ссылка</a></p> -->
                </div>
            </a-card>
        </a-col>
        <a-col v-if="guides.length === 0 && !limit" :span="24">
            <a-empty description="Гиды не найдены" />
        </a-col>
    </a-row>

    <a-row v-if="limit" justify="center" class="mt-16 mb-16">
        <a-col>
            <a-button @click="loadMoreGuides()">
                Загрузить ещё
            </a-button>
        </a-col>
    </a-row>

    <!-- Add Guide Modal -->
    <a-modal v-model:open="addGuideModal" :footer="null" title="Добавить гида" @cancel="clearNewImageSelection">
        <a-form layout="vertical">
            <a-row :gutter="[16, 16]">
                <a-col :span="24" :md="12">
                    <a-form-item label="Имя" required>
                        <a-input v-model:value="guide.name" placeholder="Иван" />
                    </a-form-item>
                </a-col>
                <a-col :span="24" :md="12">
                    <a-form-item label="Фамилия" required>
                        <a-input v-model:value="guide.surname" placeholder="Иванов" />
                    </a-form-item>
                </a-col>

                <!-- Image Upload Section -->
                <a-col :xs="24">
                    <a-form-item label="Фотография">
                        <div class="image-preview-container mb-8" v-if="previewImageUrl">
                            <img :src="previewImageUrl" alt="Предпросмотр фото" class="preview-image"
                                @error="handleImgError" />
                        </div>
                        <a-button type="dashed" block @click="openImageCropper" class="ma-8">
                            <span class="mdi mdi-12px mdi-plus mr-1"></span>
                            {{ previewImageUrl ? 'Изменить фото' : 'Добавить фото' }}
                        </a-button>
                        <a-button v-if="previewImageUrl" size="small" danger @click="clearNewImageSelection"
                            class="mt-4">
                            Удалить выбранное фото
                        </a-button>
                    </a-form-item>
                </a-col>

                <a-col :span="24" :md="12">
                    <a-form-item label="Почта" required>
                        <a-input v-model:value="guide.email" placeholder="ivanov@ya.ru" type="email" />
                    </a-form-item>
                </a-col>
                <a-col :span="24" :md="12">
                    <a-form-item label="Телефон" required>
                        <a-input v-model:value="guide.phone" placeholder="+79127528874" />
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item label="Краткое предложение / Специализация" required>
                        <a-input v-model:value="guide.offer" placeholder="Профессиональный гид по Казани" />
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item label="Социальные сети / Сайт">
                        <a-input v-model:value="guide.socialMedia" placeholder="https://vk.com/qbitclub" />
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item label="Локации / Города работы" required>
                        <a-input v-model:value="guide.location" placeholder="Казань, Болгар, Свияжск" />
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item label="Подробное описание">
                        <a-textarea v-model:value="guide.description"
                            placeholder="Расскажите о себе, опыте, маршрутах..."
                            :auto-size="{ minRows: 3, maxRows: 6 }" />
                    </a-form-item>
                </a-col>
                <a-col :span="24" class="text-right">
                    <a-button @click="addGuideModal = false; clearNewImageSelection();" class="mr-8"> Отмена </a-button>
                    <a-button type="primary" @click="addGuide()" style="border-radius: 18px"> Добавить гида </a-button>
                </a-col>
            </a-row>
        </a-form>
    </a-modal>

    <!-- Cropper Modal -->
    <a-modal v-model:open="visibleCropperModal" :footer="null" :destroyOnClose="true" title="Обрезать фото">
        <ImageCropper @addImage="addPreview" :aspectRatio="1 / 1" /> <!-- Aspect ratio 1:1 for avatar-like photos -->
    </a-modal>

</template>

<style scoped>
.space-between {
    justify-content: space-between;
}

.align-center {
    align-items: center;
}

.d-flex {
    display: flex;
}

.ml-8 {
    margin-left: 8px;
}

.mt-4 {
    margin-top: 4px;
}

.mt-8 {
    margin-top: 8px;
}

.mr-8 {
    margin-right: 8px;
}

.mb-8 {
    margin-bottom: 8px;
}

.mb-16 {
    margin-bottom: 16px;
}

.mt-16 {
    margin-top: 16px;
}

.ma-8 {
    margin: 8px;
}

/* Added margin for button spacing */
.mr-1 {
    margin-right: 4px;
}

/* Added margin for icon spacing */
.text-right {
    text-align: right;
}

/* Added for modal buttons */

.card-content p {
    margin-bottom: 4px;
    font-size: 0.9em;
}

.text-truncate {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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

/* Ensure Ant form items handle validation states correctly */
:deep(.ant-form-item-has-error .ant-input),
:deep(.ant-form-item-has-error .ant-input-affix-wrapper),
:deep(.ant-form-item-has-error .ant-input:hover),
:deep(.ant-form-item-has-error .ant-input-affix-wrapper:hover),
:deep(.ant-form-item-has-error .ant-input-number),
:deep(.ant-form-item-has-error .ant-picker),
:deep(.ant-form-item-has-error .ant-select-selector) {
    border-color: #ff4d4f !important;
}

:deep(.ant-form-item-explain-error) {
    font-size: 0.85em;
}
</style>