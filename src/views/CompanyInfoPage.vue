<script setup>
import { computed } from "vue";
import BackButton from "../components/BackButton.vue";
import { useGuide } from "../stores/guide";
const backRoute = "/watch";
const props = defineProps({
  company: String,
});
const useGuideStore = useGuide();
let toWatch = computed(() => useGuideStore.toWatch);

useGuideStore.fetchElementsByQuery("toWatch");
</script>
<template>
  <BackButton :backRoute="backRoute" />
  <a-row display="flex" justify="center" class="mb-16">
    <a-col :xs="22" :lg="16">
      <div class="cover mb-16">
        <img :src="toWatch[company].image" alt="" srcset="" />
      </div>

      <div class="title mt-16">
        <h1>{{ toWatch[company].name }}</h1>
      </div>

      <div class="ml-16">
        <h3>{{ toWatch[company].description }}</h3>
      </div>
      <div style="display: flex; justify-content: flex-end; flex-direction: column">
        <span>Адрес: {{ toWatch[company].address }}</span>
        <span>Телефон: {{ toWatch[company].phone }}</span>
        <span>Социальные сети: {{ toWatch[company].socialMedia }}</span>
      </div>
    </a-col>
  </a-row>
</template>
<style lang="scss" scoped>
.custom-card {
  margin: 8px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  .cover {
    object-fit: contain;
    display: flex;
    justify-content: center;
    background-color: #c4c4c4;
  }
  .prizes {
    .prize {
      font-size: 12px;
      color: #3daff5;
      background-color: white;
    }
  }
}
img {
  width: 50%;
  aspect-ratio: 1/1;
  border-radius: 25px;
}
</style>
