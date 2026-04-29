<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { usePhotos } from "../stores/photos.js";
import { useAppState } from "../stores/appState";
import { message } from "ant-design-vue";

const router = useRouter();
const photosStore = usePhotos();
const appStateStore = useAppState();

const fileInputRef = ref(null);
const files = ref([]);
const previews = ref([]);
const uploading = ref(false);
const targetIndexForDelete = ref(null);
const delPhotoDialog = ref(false);
const licenseAccepted = ref(false);

/** Публичный PDF из `public/documents/` — тот же путь, что в списке «Документы». */
const PHOTOBANK_LICENSE_DOC_PATH =
  "/documents/Лицензионное соглашение на публикацию изображений в фотобанке.pdf";

function openPhotobankLicense() {
  appStateStore.docLink = PHOTOBANK_LICENSE_DOC_PATH;
  router.push({ name: "Document" });
}

function openFilePicker() {
  fileInputRef.value?.click();
}

function onFilesSelected(event) {
  const list = event.target?.files ? Array.from(event.target.files) : [];
  event.target.value = "";

  for (const file of list) {
    if (!file.type.startsWith("image/")) {
      message.warning(`Пропущен файл (нужно изображение): ${file.name}`);
      continue;
    }
    files.value.push(file);
    previews.value.push(URL.createObjectURL(file));
  }
}

function askRemove(index) {
  targetIndexForDelete.value = index;
  delPhotoDialog.value = true;
}

function removePhoto() {
  const i = targetIndexForDelete.value;
  if (i === null || i === undefined) return;
  URL.revokeObjectURL(previews.value[i]);
  previews.value.splice(i, 1);
  files.value.splice(i, 1);
  targetIndexForDelete.value = null;
  delPhotoDialog.value = false;
}

async function submit() {
  if (!files.value.length) {
    message.warning("Добавьте хотя бы одно фото");
    return;
  }
  if (!licenseAccepted.value) {
    message.warning("Подтвердите права и согласие с условиями лицензии");
    return;
  }
  uploading.value = true;
  try {
    const fd = new FormData();
    const ts = Date.now();
    for (let i = 0; i < files.value.length; i++) {
      const f = files.value[i];
      const ext = (f.name && f.name.includes(".")) ? f.name.slice(f.name.lastIndexOf(".")) : "";
      const name = `photobank_${ts}_${i}${ext || ".jpg"}`;
      fd.append("photobank-photo", f, name);
    }
    const res = await photosStore.uploadPhotobankPhotos(fd);
    if (res.status === 200 || res.status === 201) {
      message.success({
        content: "Фото загружены в фотобанк",
        onClose: () => router.push("/photos"),
      });
    }
  } catch (err) {
    console.error(err);
    message.error("Не удалось загрузить фото. Проверьте формат или попробуйте позже.");
  } finally {
    uploading.value = false;
  }
}
</script>

<template>
  <div class="upload-photobank">
    <input ref="fileInputRef" type="file" class="sr-only" accept="image/jpeg,image/png,image/gif,image/webp" multiple
      @change="onFilesSelected" />
    <a-row :gutter="[16, 16]">
      <a-col :span="24">
        <h2>Загрузка фото в фотобанк</h2>
        <p class="muted">
          Выберите одно или несколько изображений (JPEG, PNG, GIF, WebP). После отправки они появятся в разделе
          <a href="/photos">
            «Фотобанк»
          </a>.
        </p>
      </a-col>
      <a-col :span="24">
        <a-button type="dashed" block class="add-btn" @click="openFilePicker">
          <span class="mdi mdi-camera-plus mdi-24px mr-8" aria-hidden="true"></span>
          Выбрать фото
        </a-button>
      </a-col>
      <a-col v-if="previews.length" :span="24">
        <a-row :gutter="[12, 12]">
          <a-col v-for="(src, idx) in previews" :key="`${src}-${idx}`" :xs="12" :sm="8" :md="6" :lg="4">
            <div class="preview-wrap">
              <img :src="src" alt="" class="preview-img" loading="lazy" />
              <a-button danger size="small" class="remove-btn" @click="askRemove(idx)">
                удалить
              </a-button>
            </div>
          </a-col>
        </a-row>
      </a-col>
      <a-col :span="24">
        <a-checkbox v-model:checked="licenseAccepted" class="license-checkbox">
          <span class="license-checkbox__text">
            Я подтверждаю, что обладаю правами и принимаю
            <a
              href="#"
              class="license-inline-link"
              @click.prevent.stop="openPhotobankLicense"
            >
              условия лицензии
            </a>
          </span>
        </a-checkbox>
      </a-col>
      <a-col :span="24" class="upload-photobank__footer-wrap">
        <a-button class="photobank-action-btn btn_light" shape="round" @click="router.push('/cabinet/me')">
          В кабинет
        </a-button>
        <a-button
          type="primary"
          class="photobank-action-btn lets_go_btn"
          shape="round"
          :loading="uploading"
          :disabled="!files.length || !licenseAccepted"
          @click="submit"
        >
          Отправить в фотобанк
        </a-button>
      </a-col>
    </a-row>

    <a-modal v-model:open="delPhotoDialog" title="Удалить фото?" ok-text="Да" cancel-text="Нет" @ok="removePhoto">
      <p>Убрать это фото из списка загрузки?</p>
    </a-modal>
  </div>
</template>

<style lang="scss" scoped>
.upload-photobank {
  padding: 8px 0 48px;
  max-width: 960px;
  margin: 0 auto;

  h2 {
    margin: 0 0 8px 0;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.muted {
  margin: 0 0 8px;
  color: rgba(18, 32, 51, 0.72);
  font-size: 14px;
}

.add-btn {
  min-height: 44px;
}

.upload-photobank__footer-wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px 16px;
}

.upload-photobank__footer-wrap :deep(.photobank-action-btn.ant-btn) {
  border-radius: 100px !important;
  padding-left: clamp(18px, 4vw, 28px);
  padding-right: clamp(18px, 4vw, 28px);
  min-height: 44px;
}

.license-checkbox {
  width: 100%;
}

.license-checkbox :deep(.ant-checkbox + span) {
  white-space: normal;
  line-height: 1.35;
}

.license-checkbox__text {
  color: rgba(18, 32, 51, 0.92);
  font-size: 14px;
}

.license-inline-link {
  font-weight: 700;
  color: #ff6600;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.license-inline-link:hover {
  color: #e65c00;
}

.mr-8 {
  margin-right: 8px;
}

.preview-wrap {
  position: relative;
  --preview-card-radius: 8px;
  border-radius: var(--preview-card-radius);
  overflow: hidden;
  border: 1px solid rgba(255, 102, 0, 0.35);
}

.preview-img {
  display: block;
  width: 100%;
  height: auto;
}

.preview-wrap :deep(.remove-btn.ant-btn) {
  width: 100%;
  border-radius: 0 0 var(--preview-card-radius) var(--preview-card-radius);
}
</style>
