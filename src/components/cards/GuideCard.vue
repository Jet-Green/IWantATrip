<script setup>
import { useRouter } from "vue-router";
import GuideService from "../../service/GuideService";
let router = useRouter();

const props = defineProps({
  element: Object,
});
function goToTripPage() {
  router.push(`/company-info-page?_id=${props.element._id}`);
}
async function guideToDelete() {
  await GuideService.deleteGuide({ _id: props.element._id });
  await GuideService.fetchElementsByQuery("watch");
}
</script>
<template>
  <a-card size="small" :title="props.element.name" hoverable style="max-width: 200px;">
    <template #extra>
      <MdiIcon style="color: #245159; cursor: pointer;padding: 0px 0 !important;
    margin: 0px 0 !important; "
        @click="guideToDelete" name="close" size="16px" />
    </template>

    <template #cover>
      <img
        :src="element.image"
        style="object-fit: cover; aspect-ratio: 1/1; max-width: 200px"
        @click="goToTripPage"
      />
    </template>
  </a-card>
</template>
<style lang="scss" scoped>
.title {
  font-size: 18px;
}
.ant-card-extra {
    padding: 0px 0 !important;
    margin: 0px 0 !important;
}
.ant-card-small > .ant-card-head > .ant-card-head-wrapper > .ant-card-extra {
    padding: 0px 0 !important;
    font-size: 14px;
}
</style>
