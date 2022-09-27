<script setup>
import { useRouter } from "vue-router";
let router = useRouter();
const props = defineProps({
  element: Object,
});
</script>
<template>
  <router-link :to="{ name: 'CompanyInfoPage', params: { company: element.id } }">
    <a-card hoverable>
      <template #cover>
        <img :src="props.element.image" />
      </template>
      <span class="title">{{ props.element.name }}</span>
    </a-card>
  </router-link>
</template>
<style lang="scss" scoped>
.title {
  font-size: 18px;
}
</style>
