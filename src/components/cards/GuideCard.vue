<script setup>
import { useRouter } from "vue-router";
import GuideService from "../../service/GuideService"
let router = useRouter();

const props = defineProps({
  element: Object,
});
function goToTripPage() {
  router.push(`/company-info-page?_id=${props.element._id}`)
}
async function guideToDelete() {
  await GuideService.deleteGuide({ _id: props.element._id });
  await GuideService.fetchElementsByQuery('watch')
}
</script>
<template>
  <a-col style="display: flex; flex-direction: column">
    <span class="mdi mdi-24px mdi-close" style="color: #245159; cursor: pointer; float: right"
      @click="guideToDelete"></span>
    <img :src="props.element.image" style="max-width: 200px" @click="goToTripPage"/>
    <span class="title">{{ props.element.name }}</span>
  </a-col>
</template>
<style lang="scss" scoped>
.title {
  font-size: 18px;
}
</style>
