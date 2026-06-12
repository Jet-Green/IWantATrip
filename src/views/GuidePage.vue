<script setup>
import { ref, onMounted, computed } from "vue";
import BackButtonAdaptive from "../components/BackButtonAdaptive.vue";
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
    <a-row type="flex" justify="center">
      <a-col :xs="22" :md="20" :xl="18">
        <BackButtonAdaptive :backRoute="backRoute" />

        <a-row :gutter="[24, 24]" class="guide-main">
          <a-col :xs="24" :sm="8">
            <img :src="guide?.image" class="avatar" alt="Guide Image" />
          </a-col>
          <a-col :xs="24" :sm="16">
            <div class="name">{{ `${guide?.name} ${guide?.surname}` }}</div>
            <div class="offer">{{ guide?.offer }}</div>

            <div class="info-section">
              <div class="info-row" v-if="guide?.location?.name">
                <span class="label">Локация:</span>
                <span class="value">{{ guide?.location?.name }}</span>
              </div>

              <div class="info-row" v-if="guide?.phone">
                <span class="label">Телефон:</span>
                <a :href="`tel:${guide.phone}`" class="value link">{{ guide.phone }}</a>
              </div>

              <div class="info-row" v-if="guide?.socialMedia">
                <span class="label">Соц. сеть:</span>
                <span class="value">{{ guide?.socialMedia }}</span>
              </div>

              <div class="info-row" v-if="guide?.email">
                <span class="label">Почта:</span>
                <span class="value">{{ guide?.email }}</span>
              </div>

              <div class="info-row" v-if="guide?.type">
                <span class="label">Статус:</span>
                <span class="value">{{ guide?.type }}</span>
              </div>
            </div>
          </a-col>
        </a-row>

        <div class="about-section" v-if="guide?.description">
          <h3>О себе</h3>
          <p class="description">{{ guide.description }}</p>
        </div>

        <div v-if="excursions.length > 0">
          <h3>Экскурсии</h3>
          <a-row :gutter="[12, 16]">
            <a-col :span="24" :sm="12" :md="8" v-for="excursion in excursions" :key="excursion._id">
              <ExcursionCard :excursion="excursion" @click="router.push(`/excursion?_id=${excursion._id}`)"
                :id="excursion._id" />
            </a-col>
          </a-row>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<style scoped>
.guide-main {
  margin-top: 20px;
}

.avatar {
  width: 100%;
  max-width: 250px;
  border-radius: 999px;
  object-fit: cover;
}

.name {
  font-size: clamp(1.25rem, 0.925rem + 1vw, 1.75rem);
  font-weight: 900;
  margin-bottom: 8px;
}

.offer {
  font-size: clamp(0.875rem, 0.6761rem + 0.5682vw, 1.125rem);
  margin-bottom: 16px;
}

.info-section {
  margin-bottom: 16px;
}

.info-row {
  padding: 4px 0;
}

.label {
  font-weight: 600;
  color: #333;
  margin-right: 8px;
}

.value {
  color: #666;
}

.value.link {
  color: #239fca;
}

.about-section {
  margin-top: 24px;
}

h3 {
  font-weight: 900;
  margin: 24px 0 16px;
}

.description {
  line-height: 1.6;
}
</style>