<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { usePhotos } from "../../stores/photos";

const photosStore = usePhotos();
const router = useRouter();
const rejectedPhotos = ref([]);

function photoLabel(photo) {
  return (
    photo.placeNameText?.trim() ||
    photo.enterpriseName?.trim() ||
    photo.location?.name?.trim() ||
    photo.location?.shortName?.trim() ||
    "Фото без подписи"
  );
}

function authorName(photo) {
  return photo.author?.fullinfo?.fullname || "—";
}

async function photoToDelete(_id) {
  await photosStore.deletePhoto(_id);
  await refreshRejectedPhotos();
}

async function refreshRejectedPhotos() {
  const { data } = await photosStore.findRejectedPhotos();
  rejectedPhotos.value = data;
}

onMounted(async () => {
  await refreshRejectedPhotos();
});
</script>

<template>
  <a-row :gutter="[8, 8]" class="mt-8">
    <a-col
      v-if="rejectedPhotos.length > 0"
      v-for="(photo, index) of rejectedPhotos"
      :key="photo._id || index"
      :lg="8"
      :sm="12"
      :xs="24"
    >
      <a-card class="card" hoverable>
        <img :src="photo.url" alt="" class="photo-thumb" />
        <div style="text-align: center" class="mt-8">
          {{ photoLabel(photo) }}
        </div>
        <a-divider class="ma-4" style="border-color: #205f79" />
        <div v-if="photo.moderationMessage?.trim()" class="rejection-msg">
          {{ photo.moderationMessage }}
        </div>
        <div class="mt-8">Автор: {{ authorName(photo) }}</div>

        <div class="actions d-flex justify-center">
          <a-popconfirm
            title="Вы уверены?"
            ok-text="Да"
            cancel-text="Нет"
            @confirm="photoToDelete(photo._id)"
          >
            <span class="mdi mdi-delete" style="color: #ff6600; cursor: pointer"></span>
          </a-popconfirm>
          <span
            class="mdi mdi-check-decagram-outline"
            style="color: #245159; cursor: pointer"
            @click="router.push(`/photo-moderation?_id=${photo._id}`)"
          ></span>
        </div>
      </a-card>
    </a-col>
    <a-col v-else :span="24"> Нет отказанных фото </a-col>
  </a-row>
</template>

<style scoped lang="scss">
.photo-thumb {
  width: 100%;
  max-height: 180px;
  object-fit: cover;
  border-radius: 8px;
}

.rejection-msg {
  font-size: 13px;
  color: #8c4a2f;
}

.actions {
  font-size: 20px;
  position: relative;

  * {
    margin: 4px;
    cursor: pointer;
  }
}
</style>
