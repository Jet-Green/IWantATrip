<script setup>
import PlacesHeader from "../components/PlacesHeader.vue";
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
