<script setup>
import { useRouter } from "vue-router";
let router = useRouter();
const props = defineProps({
  element: Object,
});
function goToTripPage() {
  router.push(`/company-info-page?_id=${props.element._id}`)
}
</script>
<template>
    <a-card hoverable @click="goToTripPage">
      <template #cover>
        <img :src="props.element.image" />
      </template>
      <span class="title">{{ props.element.name }}</span>
    </a-card>
</template>
<style lang="scss" scoped>
.title {
  font-size: 18px;
}
</style>
