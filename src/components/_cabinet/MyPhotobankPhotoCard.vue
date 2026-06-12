<script setup>
import { toRefs, computed, ref } from "vue";
import { message } from "ant-design-vue";
import { usePhotos } from "../../stores/photos";
import PhotobankMetaModal from "../photobank/PhotobankMetaModal.vue";

const props = defineProps(["photo"]);
const emit = defineEmits(["refresh"]);

const photosStore = usePhotos();
const { photo } = toRefs(props);

const color = ref("black");
const show = ref(false);
const editOpen = ref(false);
const savingMeta = ref(false);

function photoLabel() {
  return (
    photo.value?.placeNameText?.trim() ||
    photo.value?.enterpriseName?.trim() ||
    photo.value?.location?.name?.trim() ||
    "Фото"
  );
}

const isInUse = computed(
  () => !!(photo.value?.isInUse || (photo.value?.usageCount ?? 0) > 0)
);

const status = computed(() => {
  const s = photo.value?.status;
  if (s === "rejected") {
    color.value = "#ff6600";
    return "отказано";
  }
  if (s === "published" || !s || s === "") {
    color.value = "black";
    return "на сайте";
  }
  color.value = "#20A0CF";
  return "на проверке";
});

async function photoToDelete(_id) {
  try {
    const response = await photosStore.deleteMyPhoto(_id);
    if (response.status === 200) {
      emit("refresh");
    }
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      "Нельзя удалить фото: оно используется в карточках мест";
    message.error(msg);
  }
}

async function onSaveMeta(meta) {
  const photoId = photo.value?._id;
  if (!photoId) {
    message.error("Не удалось определить фото");
    return;
  }
  savingMeta.value = true;
  try {
    const wasPublished = photo.value?.status === "published";
    const wasRejected = photo.value?.status === "rejected";
    const response = await photosStore.updateMyPhoto(photoId, meta);
    if (wasPublished || wasRejected) {
      message.success("Сохранено. Фото снова отправлено на модерацию.");
    } else {
      message.success("Сохранено");
    }
    editOpen.value = false;
    emit("refresh");
  } catch (err) {
    if (!err?.response?.data?.message) {
      message.error("Не удалось сохранить изменения");
    }
  } finally {
    savingMeta.value = false;
  }
}
</script>

<template>
  <a-card v-if="photo._id" class="card my-photobank-card">
    <img :src="photo.url" alt="" class="my-photobank-card__img" />
    <div class="my-photobank-card__title">{{ photoLabel() }}</div>
    <a-divider class="ma-4" style="border-color: #205f79" />
    <div v-if="photo.moderationMessage?.trim() && photo.status === 'rejected'" class="my-photobank-card__msg">
      {{ photo.moderationMessage }}
    </div>
    <div v-if="isInUse" class="my-photobank-card__in-use">
      Используется в местах на сайте
    </div>
    <div class="actions">
      <div>
        <a-popconfirm
          v-if="!isInUse"
          title="Удалить?"
          ok-text="Да"
          cancel-text="Нет"
          @confirm="photoToDelete(photo._id)"
        >
          <span class="mdi mdi-delete" style="color: #ff6600"></span>
        </a-popconfirm>
        <span
          v-else
          class="mdi mdi-delete my-photobank-card__delete-disabled"
          title="Нельзя удалить: фото используется в местах"
        ></span>
        <span
          v-if="!isInUse"
          class="mdi mdi-pencil"
          title="Редактировать"
          @click="editOpen = true"
        ></span>
        <span
          v-else
          class="mdi mdi-pencil my-photobank-card__edit-disabled"
          title="Нельзя редактировать: фото используется в местах"
        ></span>
        <span class="mdi mdi-information-outline" @click="show = !show"></span>
      </div>
      <div :style="{ color }" style="font-size: 14px">{{ status }}</div>
    </div>

    <PhotobankMetaModal
      v-model:open="editOpen"
      :initial="photo"
      :saving="savingMeta"
      @save="onSaveMeta"
    />

    <a-modal v-model:open="show" :footer="null" :title="photoLabel()">
      <img :src="photo.url" alt="" class="my-photobank-card__modal-img" />
      <div v-if="photo.location?.name" class="my-photobank-card__meta">
        <b>Адрес:</b> {{ photo.location.name }}
      </div>
      <div v-if="photo.placeNameText?.trim()" class="my-photobank-card__meta">
        <b>Место:</b> {{ photo.placeNameText }}
      </div>
      <div v-if="photo.enterpriseName?.trim()" class="my-photobank-card__meta">
        <b>Предприятие:</b> {{ photo.enterpriseName }}
      </div>
      <div v-if="photo.caption?.trim()" class="my-photobank-card__meta">{{ photo.caption }}</div>
    </a-modal>
  </a-card>
</template>

<style scoped lang="scss">
.my-photobank-card__img {
  width: 100%;
  max-height: 160px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 8px;
}

.my-photobank-card__title {
  text-align: center;
  font-weight: 700;
  font-size: 14px;
}

.my-photobank-card__msg {
  font-size: 12px;
  color: #8c4a2f;
  margin-bottom: 8px;
  word-break: break-word;
  overflow-wrap: anywhere;
  flex: 0 0 auto;
}

.my-photobank-card__in-use {
  font-size: 12px;
  color: #245159;
  margin-bottom: 8px;
}

.my-photobank-card__delete-disabled,
.my-photobank-card__edit-disabled {
  color: rgba(0, 0, 0, 0.25);
  cursor: not-allowed;
}

.my-photobank-card__modal-img {
  width: 100%;
  max-height: 360px;
  object-fit: contain;
  margin-bottom: 12px;
}

.my-photobank-card__meta {
  margin-bottom: 6px;
  font-size: 13px;
}

.my-photobank-card {
  height: 100%;
}

.my-photobank-card :deep(.ant-card-body) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card {
  min-height: 100px;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: auto;
  flex-shrink: 0;
  font-size: 20px;
  cursor: pointer;
  color: #245159;

  * {
    margin: 4px;
    cursor: pointer;
  }
}
</style>
