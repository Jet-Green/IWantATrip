<script setup>
import { ref, onMounted, computed } from "vue";
import BackButton from "../components/BackButton.vue";

import { useRoute } from "vue-router";
import { usePlaces } from "../stores/place";
import { useHead } from "@unhead/vue";

const VITE_API_URL = import.meta.env.VITE_API_URL;
const place = ref();
const route = useRoute();
const placeStore = usePlaces();
const _id = route.query._id;
let backRoute = { name: 'Places', hash: `#${_id}` };
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
    <BackButton :backRoute="backRoute" />

    <a-row class="justify-center d-flex">
      <a-col :xs="22" :xl="16">
        <div class="guide-card">
          <a-row>

            <a-col :xs="24">
              <p style=" font-size: clamp(1.125rem, 0.925rem + 0.8vw, 1.375rem); margin-bottom: 0;"> {{
                `${guide.name} ${guide.surname}` }}</p>
            </a-col>
            <a-col :xs="24">
              {{ guide.offer }}
            </a-col>
            <a-col :xs="24" :md="8"> <img :src="guide.image" class="pa-8" alt="Guide Image" style="width: 100%;" />
            </a-col>
            <a-col :xs="24" :md="16">

              <p> Локация: <b> {{ guide.location.name }}</b></p>
              <p> Телефон: <b>{{ guide.phone }}</b></p>
              <p> Соц. сеть: <b> {{ guide.socialMedia }}</b></p>
              <p> Почта: <b>{{ guide.email }}</b></p>
            </a-col>

            <a-col :xs="24">
              <p>{{ guide.description }}</p>
            </a-col>
            <a-col :xs="24">
              <p> {{ guide.excursionsIn }}</p>
            </a-col>

          </a-row>
        </div>

      </a-col>
    </a-row>
  </div>
</template>
