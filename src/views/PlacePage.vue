<script setup>
import { ref, onMounted, computed } from "vue";
import BackButton from "../components/BackButton.vue";
import PlaceCard from "../components/cards/PlaceCard.vue";
import { useRoute } from "vue-router";
import { usePlaces } from "../stores/place";
import { useHead } from "@unhead/vue";

const VITE_API_URL = import.meta.env.VITE_API_URL;
const place = ref();
const route = useRoute();
const placeStore = usePlaces();
const _id = route.query._id;

// Заголовок обновится автоматически, когда place.value станет доступным
useHead(computed(() => ({
  title: place.value?.name,
  meta: [
    {
      name: "description",
      content: place.value?.shortDescription,
    },
    {
      property: "og:title",
      content: place.value?.name,
    },
    {
      name: "og:description",
      content: place.value?.shortDescription,
    },
    {
      name: "og:image",
      content: place.value?.images[0],
    },
  
    {
      name: "og:url",
      content: `${VITE_API_URL}/place?_id=${place.value?._id}`,
    },
  ],
  link: [{ rel: "canonical", href: `${VITE_API_URL}/place?_id=${place.value?._id}` }],
})));

onMounted(async () => {
  if (_id) {
    const res = await placeStore.getById(_id);
    place.value = res.data;
  }
});
</script>
<template>
  <div style="overflow-x: hidden">
    <BackButton />
    <a-row class="justify-center d-flex">
      <a-col :xs="22" :xl="16">
        <PlaceCard :place="place" :open="true" style="margin-bottom: 32px" />
      </a-col>
    </a-row>
  </div>
</template>
