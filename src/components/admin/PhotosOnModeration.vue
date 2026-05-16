<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const photosStatus = ref("photosOnModeration");

watch(photosStatus, (status) => {
  localStorage.setItem("moderationPhotosStatus", status);
  if (status === "photosOnModeration") {
    return router.push("/cabinet/moderation-photos/not-moderated-photos");
  }
  if (status === "rejected") {
    return router.push("/cabinet/moderation-photos/rejected-photos");
  }
});

onMounted(() => {
  photosStatus.value = localStorage.getItem("moderationPhotosStatus") || "photosOnModeration";
});
</script>

<template>
  <a-row>
    <a-col :span="24">
      <h3>Фотобанк на модерации</h3>
      <a-radio-group v-model:value="photosStatus">
        <a-radio value="photosOnModeration">На модерации</a-radio>
        <a-radio value="rejected">Откaзaнные</a-radio>
      </a-radio-group>

      <router-view />
    </a-col>
  </a-row>
</template>
