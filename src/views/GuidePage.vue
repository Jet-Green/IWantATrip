<script setup>
import { ref, onMounted, computed } from "vue";
import BackButton from "../components/BackButton.vue";
import GuideCard from "../components/_guide/guides/GuideCard.vue";

import { useRoute,useRouter } from "vue-router";
import { useHead } from "@unhead/vue";
import { useGuide } from "../stores/guide";

const VITE_API_URL = import.meta.env.VITE_API_URL;
const guide = ref({});
const route = useRoute();
const router = useRouter()
const guideStore = useGuide();
const _id = route.query._id;
let backRoute = { name: 'Guides', hash: `#${_id}` };
let excursions=ref([])
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
        <GuideCard :key="guide._id" :guide="guide"/>
        <p>{{ guide.description }}</p>
        <div>
          <h3>Экскурсии</h3>
          <a-row :gutter="[12, 16]">
            <a-col :span="24" :sm="12" :md="8" v-for="ex of excursions" :key="ex._id">

              <ExcursionCard :excursion="ex" @click="router.push(`/excursion?_id=${ex._id}`)" :id="ex._id" />
            </a-col>
          
          </a-row>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
