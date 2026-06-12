<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const photosStatus = ref("photosOnModeration");

watch(photosStatus, (status) => {
  localStorage.setItem("myPhotobankStatus", status);
  if (status === "photosOnModeration") {
    return router.push("/cabinet/my-photobank/on-moderation");
  }
  if (status === "photosPublished") {
    return router.push("/cabinet/my-photobank/published");
  }
  if (status === "photosRejected") {
    return router.push("/cabinet/my-photobank/rejected");
  }
});

onMounted(() => {
  photosStatus.value = localStorage.getItem("myPhotobankStatus") || "photosOnModeration";
});
</script>

<template>
  <a-row :gutter="[0, 16]">
    <a-col :span="24">
      <div class="my-photobank-toolbar">
        <a-button class="btn_light" @click="router.push('/cabinet/upload-photobank')">
          загрузить фото
        </a-button>

        <a-radio-group v-model:value="photosStatus" class="my-photobank-toolbar__tabs">
          <a-radio value="photosOnModeration">На модерации</a-radio>
          <a-radio value="photosPublished">На сайте</a-radio>
          <a-radio value="photosRejected">Отказанные</a-radio>
        </a-radio-group>
      </div>
    </a-col>

    <a-col :span="24">
      <router-view />
    </a-col>
  </a-row>
</template>

<style scoped lang="scss">
.my-photobank-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 16px;
  width: 100%;
}

.my-photobank-toolbar__tabs {
  flex: 1 1 auto;
  min-width: 0;
}
</style>
