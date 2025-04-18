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

const visibleCropperModal = ref(false);

let imageUrl=ref("")
let currentImg=ref()



// --- Methods ---
async function fetchGuideData() {
  isLoading.value = true;
  errorMsg.value = '';
  // Clear previous image state
  clearNewImageSelection();
  try {
    // Replace with your actual API call
    const response = await guideStore.getGuideByEmail(userStore.user.email);
    // Assuming API returns the guide object matching the schema
    Object.assign(guideData, response.data); // Update reactive object
    // console.log(response.data)

    imageUrl.value = response.data.image || ''; // Set initial image URL
  } catch (err) {
    console.error("Error fetching guide data:", err);
    errorMsg.value = 'Не удалось загрузить данные гида. ' + (err.response?.data?.message || err.message);
    message.error(errorMsg.value);
  } finally {
    isLoading.value = false;
  }
}

async function submit() {
  isSaving.value = true;
  errorMsg.value = '';
  try {
    // Prepare data for update
    // Usually we don't send the full object, just the editable fields

    let response;

    response = await guideStore.updateGuide(guideData);
    if (response.status == 200) {
      message.success('Гид обновлен.');
      // console.log(response.data,'amoguss')
      const guideId = response.data._id;
      if (currentImg.value!=null && typeof currentImg.value=='object')
      {
        let res = await uploadGuideImages(guideId)
      }
      // Update local state with response from server (which should include the potentially new image URL)
    }

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
  visibleCropperModal.value = false; // Close cropper modal
  if (currentImg.value!="") {
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
  // console.log(guideData,'susususususus')
  let imagesFormData = new FormData();
  // console.log(Date.now())
  imagesFormData.append(
      "guide-image",
      new File( [currentImg.value] , _id + '_' + Date.now() + ".jpg"),
      _id + '_' + Date.now() + ".jpg"
    );
  let res = await guideStore.uploadGuideImage(imagesFormData)
  // clearNewImageSelection()
  return res
}


function handleImgError() {
  console.warn('Image failed to load:', currentImg.value);
  // console.log(guideData)
  // Optionally set a placeholder image
  // currentImageUrl.value = '/path/to/placeholder.png';
}

// --- Lifecycle Hooks ---
onMounted(() => {
  fetchGuideData();
});

</script>

<template>
  <a-spin :spinning="isLoading">
    <div class="guide-profile-editor pa-4">
      <a-alert v-if="errorMsg" :message="errorMsg" type="error" show-icon closable @close="errorMsg = ''" class="mb-4" />

      <a-form layout="vertical" v-if="!isLoading && guideData._id">
        <a-row :gutter="[16, 16]">

          <!-- Image Section -->
          <a-col :span='24'>
            <h4>Фотография</h4>
            <div class="image-preview-container mb-8" v-if="imageUrl">
                             <img :src="imageUrl" alt="Предпросмотр фото" class="preview-image" @error="handleImgError"/>
            </div>
             <a-button type="dashed" block @click="openImageCropper">
                <span class="mdi mdi-camera mr-1"></span>
                Изменить фото
             </a-button>
          </a-col>

          <!-- Text Fields Section -->

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


        <!-- Actions -->
        <a-row justify="end" class="mt-16">
            <a-col>
                <a-button
                    type="primary"
                    @click="submit"
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
      <a-modal v-model:open="visibleCropperModal" :footer="null" :destroyOnClose="true" title="Обрезать фото">
         <!-- Pass aspect ratio if desired, e.g., :aspectRatio="1" for square -->
         <ImageCropper @addImage="addPreview" :aspectRatio="1/1"/>
      </a-modal>

    </div>
  </a-spin>
</template>

<style scoped>
.guide-profile-editor {
  max-width: 900px; /* Or your desired max width */
  margin: auto;
}

.image-preview-container {
    width: 100%;
    max-width: 200px; /* Limit preview size */
    aspect-ratio: 1 / 1; /* Maintain square aspect ratio */
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