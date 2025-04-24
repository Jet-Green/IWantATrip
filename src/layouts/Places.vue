<script setup>
import PlacesHeader from "../components/PlacesHeader.vue";
import { useHead } from '@unhead/vue'
const VITE_API_URL = import.meta.env.VITE_API_URL
useHead({
  title: 'Места: города и веси',
  meta: [
    {
      name: 'description',
      content: 'Парк, гостиница, кафе, музей, спорт, отдых, ресторан - места для туристов',
    },
    {
      property: 'og:title',
      content: 'Места: города и веси',
    },
    {
      name: 'og:description',
      content: 'Парк, гостиница, кафе, музей, спорт, отдых, ресторан - места для туристов',
    },
    {
      name: 'og:url',
      content: `${VITE_API_URL}/places`,
    },
  ],
  link: [
    { rel: 'canonical', href:`${VITE_API_URL}/places` }
  ]
})

</script>
<template>

    <a-layout>
      <PlacesHeader></PlacesHeader>
      <!-- в документации с margin'ом, чтобы предотвратить перекрывание контента хедром -->
      <a-layout-content style="margin-top: 69px">
        <Suspense>
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </Suspense>
      </a-layout-content>
    </a-layout>
</template>
<style></style>
