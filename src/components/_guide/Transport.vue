<script setup>
import { RouterLink, useRouter } from 'vue-router';

import BackButton from "../BackButton.vue";

const router = useRouter()

</script>
<template>
  <div>
    <BackButton />

    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <h2>Транспорт</h2>
        <a-row :gutter="[8, 8]">
          <a-col :xs="24" :lg="12">
            <a target="_blank" href="https://yandex.ru/maps/transport">
              <a-card hoverable class="card">
                Маршрутный транспорт
              </a-card></a>
          </a-col>
          <a-col :xs="24" :lg="12">
            <router-link :to="'/taxi'">
              <a-card hoverable class="card">
                Такси
              </a-card>
            </router-link>
          </a-col>
        </a-row>
        <!-- <a-row v-else>
          <a-col :span="24" class="d-flex justify-center align-center">
            <a-spin size="large"></a-spin>
          </a-col>
        </a-row> -->
      </a-col>
    </a-row>
  </div>
</template>
<style lang="scss" scoped>
.card {
  font-size: clamp(1rem, 0.7983rem + 0.4202vw, 1.25rem);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 10px;
  aspect-ratio: 3/1;
  position: relative;
  padding: 8px;
}
</style>
