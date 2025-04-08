<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { message } from 'ant-design-vue'; // For user feedback
import ImageCropper from '../../components/ImageCropper.vue'; // Assuming ImageCropper is in the same directory or adjust path
let guideStore = useGuide()

// --- Props ---
const props = defineProps({
  guideId: {
    type: String,
    required: true, // Need an ID to know which guide to load/update
  }
});

// --- State ---
const isLoading = ref(false);
const isSaving = ref(false);
const errorMsg = ref('');
const guideData = reactive({
  _id: '', // Will be populated from fetched data
  name: '',
  surname: '',
  image: '', // URL of the current image
  email: '', // Usually not editable or requires special handling
  phone: '',
  offer: '',
  socialMedia: '',
  description: '',
  location: '',
  user: null, // Store user ID if needed, likely not editable here
});

// Image Editing State
const currentImageUrl = ref(''); // To display existing or updated image URL
const newImageBlob = ref(null); // Stores the Blob of the newly cropped image
const newImagePreviewUrl = ref(''); // Stores the ObjectURL for the new image preview
const visibleCropperModal = ref(false);

// --- Lifecycle Hooks ---
onMounted(() => {
  fetchGuideData();
});

// Watch for prop changes if the component might be reused without unmounting
watch(() => props.guideId, (newId) => {
  if (newId) {
    fetchGuideData();
  }
});

// --- Methods ---
async function fetchGuideData() {
  if (!props.guideId) return;
  isLoading.value = true;
  errorMsg.value = '';
  // Clear previous image state
  clearNewImageSelection();
  try {
    // Replace with your actual API call
    const response = await GuideService.getGuideById(props.guideId);
    // Assuming API returns the guide object matching the schema
    Object.assign(guideData, response.data); // Update reactive object
    currentImageUrl.value = guideData.image || ''; // Set initial image URL
  } catch (err) {
    console.error("Error fetching guide data:", err);
    errorMsg.value = 'Не удалось загрузить данные гида. ' + (err.response?.data?.message || err.message);
    message.error(errorMsg.value);
  } finally {
    isLoading.value = false;
  }
}

async function handleUpdateGuide() {
  isSaving.value = true;
  errorMsg.value = '';
  try {
    // Prepare data for update
    // Usually we don't send the full object, just the editable fields
    const updatePayload = {
      name: guideData.name,
      surname: guideData.surname,
      phone: guideData.phone,
      offer: guideData.offer,
      socialMedia: guideData.socialMedia,
      description: guideData.description,
      location: guideData.location,
      // Include image URL ONLY IF a new one wasn't uploaded via FormData
      // The backend logic will handle updating the image field if req.file exists
    };

    let response;
    if (newImageBlob.value) {
      // If a new image exists, send as FormData
      const formData = new FormData();
      // Append text fields
      Object.keys(updatePayload).forEach(key => {
        if (updatePayload[key] !== null && updatePayload[key] !== undefined) {
            formData.append(key, updatePayload[key]);
        }
      });
      // Append the image blob with a filename
      // Generate a unique-ish filename on the client or let the server handle it
      const filename = `guide-${props.guideId}-${Date.now()}.jpg`;
      formData.append('image', newImageBlob.value, filename); // 'image' must match backend multer field name

      // Replace with your actual API call using FormData
      response = await GuideService.updateGuideWithImage(props.guideId, formData);
       message.success('Гид обновлен (с изображением).');

    } else {
      // If no new image, send as JSON
      // Replace with your actual API call using JSON
      response = await GuideService.updateGuide(props.guideId, updatePayload);
      message.success('Гид обновлен.');
    }

    // Update local state with response from server (which should include the potentially new image URL)
    Object.assign(guideData, response.data);
    currentImageUrl.value = guideData.image || '';
    clearNewImageSelection(); // Clear the temporary new image state

  } catch (err) {
    console.error("Error updating guide data:", err);
    errorMsg.value = 'Не удалось обновить данные гида. ' + (err.response?.data?.message || err.message);
    message.error(errorMsg.value);
  } finally {
    isSaving.value = false;
  }
}

function openImageCropper() {
  visibleCropperModal.value = true;
}

// Called when ImageCropper emits 'addImage'
function addPreview(blob) {
  if (newImagePreviewUrl.value) {
    // Clean up previous blob URL
    URL.revokeObjectURL(newImagePreviewUrl.value);
  }
  newImageBlob.value = blob;
  newImagePreviewUrl.value = URL.createObjectURL(blob);
  visibleCropperModal.value = false; // Close cropper modal
}

function clearNewImageSelection() {
    if (newImagePreviewUrl.value) {
        URL.revokeObjectURL(newImagePreviewUrl.value);
    }
    newImageBlob.value = null;
    newImagePreviewUrl.value = '';
}

function handleImgError() {
  console.warn('Image failed to load:', newImagePreviewUrl.value || currentImageUrl.value);
  // Optionally set a placeholder image
  // currentImageUrl.value = '/path/to/placeholder.png';
}

// Cleanup blob URL when component unmounts
import { onUnmounted } from 'vue';
onUnmounted(() => {
    if (newImagePreviewUrl.value) {
        URL.revokeObjectURL(newImagePreviewUrl.value);
    }
});

</script>

<template>
  <a-spin :spinning="isLoading">
    <div class="guide-profile-editor pa-4">
      <a-alert v-if="errorMsg" :message="errorMsg" type="error" show-icon closable @close="errorMsg = ''" class="mb-4" />

      <a-form layout="vertical" v-if="!isLoading && guideData._id">
        <a-row :gutter="[16, 16]">

          <!-- Image Section -->
          <a-col :xs="24" :md="8" :lg="6">
            <h4>Фотография</h4>
            <div class="image-container mb-2">
                <img
                    :src="newImagePreviewUrl || currentImageUrl || '/placeholder-image.png'"
                    alt="Guide Image"
                    class="guide-image"
                    @error="handleImgError"
                />
                <!-- Display overlay/button if a new image is staged -->
                <div v-if="newImagePreviewUrl" class="new-image-overlay">
                    <p>Новое фото (не сохранено)</p>
                     <a-button size="small" @click="clearNewImageSelection" danger>Отменить</a-button>
                </div>
            </div>
             <a-button type="dashed" block @click="openImageCropper">
                <span class="mdi mdi-camera mr-1"></span>
                Изменить фото
             </a-button>
          </a-col>

          <!-- Text Fields Section -->
          <a-col :xs="24" :md="16" :lg="18">
            <a-row :gutter="[16, 16]">
              <a-col :xs="24" :sm="12">
                <a-form-item label="Имя" :validate-status="!guideData.name ? 'error' : ''" help="Имя обязательно">
                  <a-input v-model:value="guideData.name" placeholder="Введите имя" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12">
                <a-form-item label="Фамилия">
                  <a-input v-model:value="guideData.surname" placeholder="Введите фамилию" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12">
                 <a-form-item label="Email (Логин)">
                   <a-input :value="guideData.email" disabled placeholder="Email пользователя" />
                 </a-form-item>
              </a-col>
              <a-col :xs="24" :sm="12">
                <a-form-item label="Телефон" :validate-status="!guideData.phone ? 'error' : ''" help="Телефон обязателен">
                  <a-input v-model:value="guideData.phone" placeholder="+7 (XXX) XXX-XX-XX" />
                </a-form-item>
              </a-col>
               <a-col :xs="24">
                <a-form-item label="Локация / Город">
                  <a-input v-model:value="guideData.location" placeholder="Город или регион работы" />
                </a-form-item>
              </a-col>
              <a-col :xs="24">
                <a-form-item label="Предложение / Специализация">
                  <a-textarea v-model:value="guideData.offer" placeholder="Например: Исторические туры по центру города, Гастрономические экскурсии" :rows="3" />
                </a-form-item>
              </a-col>
              <a-col :xs="24">
                <a-form-item label="Описание">
                  <a-textarea v-model:value="guideData.description" placeholder="Расскажите подробнее о себе и своих услугах" :rows="5" />
                </a-form-item>
              </a-col>
              <a-col :xs="24">
                <a-form-item label="Соц. сети / Сайт">
                  <a-input v-model:value="guideData.socialMedia" placeholder="Ссылка на Вконтакте, Instagram, личный сайт и т.д." />
                </a-form-item>
              </a-col>
            </a-row>
          </a-col>
        </a-row>

        <!-- Actions -->
        <a-row justify="end" class="mt-16">
            <a-col>
                <a-button
                    type="primary"
                    @click="handleUpdateGuide"
                    :loading="isSaving"
                    :disabled="isLoading || !guideData.name || !guideData.phone"
                >
                    <span class="mdi mdi-content-save mr-1"></span>
                    Сохранить изменения
                </a-button>
            </a-col>
        </a-row>
      </a-form>

      <div v-else-if="!isLoading && !guideData._id && !errorMsg">
          <a-empty description="Нет данных для отображения. Возможно, гид не найден." />
      </div>

      <!-- Modals -->
      <a-modal v-model:open="visibleCropperModal" :footer="null" :destroyOnClose="true" title="Обрезать фото" width="auto">
         <!-- Pass aspect ratio if desired, e.g., :aspectRatio="1" for square -->
         <ImageCropper @addImage="addPreview" :aspectRatio="16/10"/>
      </a-modal>

    </div>
  </a-spin>
</template>

<style scoped>
.guide-profile-editor {
  max-width: 900px; /* Or your desired max width */
  margin: auto;
}

.image-container {
    position: relative;
    width: 100%;
    /* Maintain aspect ratio, e.g., 16:10 */
    aspect-ratio: 16 / 10;
    background-color: #f0f0f0; /* Placeholder background */
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    overflow: hidden; /* Ensures image stays within bounds */
    display: flex;
    align-items: center;
    justify-content: center;
}

.guide-image {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: cover; /* Or 'contain' depending on preference */
   height: 100%;
   width: 100%;
}

.new-image-overlay {
    position: absolute;
    inset: 0; /* Covers the entire container */
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

.pa-4 { padding: 16px; }
.ma-4 { margin: 16px; }
.mb-4 { margin-bottom: 16px; }
.mt-16 { margin-top: 16px; }
.mr-1 { margin-right: 4px; }

/* Ant input validation styling */
:deep(.ant-form-item-has-error .ant-input),
:deep(.ant-form-item-has-error .ant-input-affix-wrapper),
:deep(.ant-form-item-has-error .ant-input:hover),
:deep(.ant-form-item-has-error .ant-input-affix-wrapper:hover) {
  border-color: #ff4d4f;
}
</style>