<script setup>
import { ref, onMounted, computed } from "vue";
import BackButton from "../components/BackButton.vue";
import GuideCard from "../components/_guide/guides/GuideCard.vue";
import ExcursionCard from "../components/_guide/ExcursionCard.vue";

import { useRoute, useRouter } from "vue-router";
import { useHead } from "@unhead/vue";
import { useGuide } from "../stores/guide";

const VITE_API_URL = import.meta.env.VITE_API_URL;
const guide = ref({});
const route = useRoute();
const router = useRouter()
const guideStore = useGuide();
const _id = route.query._id;
let backRoute = { name: 'Guides', hash: `#${_id}` };
let excursions = ref([])
// Заголовок обновится автоматически, когда place.value станет доступным
useHead(computed(() => ({
  title: guide.value?.name,
  meta: [
    {
      name: "description",
      content: guide.value?.offer,
    },
    {
      property: "og:title",
      content: guide.value?.name,
    },
    {
      name: "og:description",
      content: guide.value?.description,
    },
    {
      name: "og:image",
      content: guide.value?.image,
    },
    {
      name: "og:url",
      content: `${VITE_API_URL}/guide?_id=${guide.value?._id}`,
    },
  ],
  link: [{ rel: "canonical", href: `${VITE_API_URL}/guide?_id=${guide.value?._id}` }],
})));

onMounted(async () => {
  let res = await guideStore.getGuideById(_id);
  guide.value = res.data;
  res = await guideStore.getGuideExcursions(_id)
  excursions.value = res.data
});
</script>
<template>
  <div style="overflow-x: hidden">
    <BackButton :backRoute="backRoute" />

    <a-row class="justify-center d-flex">
      <a-col :xs="22" :xl="16">
        <GuideCard :key="guide._id" :guide="guide" />
        <p class="text">{{ guide.description }}</p>

        <h3>Экскурсии</h3>
        <div class="d-flex flex-wrap">
          <a-card v-for="excursion in excursions" class="mr-8 mb-8 pa-4 text excursion_button" hoverable
            style="cursor: pointer; border: #239FCC 1px solid;" @click="router.push(`/excursion?_id=${excursion._id}`)">
            <b class="mr-4">{{ excursion.name }}</b>
          </a-card>

        </div>
      </a-col>
    </a-row>
  </div>
</template>
<style scoped>
.excursion_button {
  cursor: pointer;
  border: black 1px solid;
  width: fit-content;
}
</style>
