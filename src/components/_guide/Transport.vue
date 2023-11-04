<script setup>
import { computed } from "vue";
import { useRouter } from 'vue-router';

import { useGuide } from "../../stores/guide";

import BackButton from "../BackButton.vue";

const router = useRouter()

</script>
<template>
  <div>
    <BackButton />

    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <h2>Транспорт</h2>
        <a-row>
          <a-col :xs="24" :lg="12">
            <a-card>
              Маршрутный транспорт
            </a-card>
          </a-col>
          <a-col :xs="24" :lg="12">
            <a-card>
              Такси
            </a-card>
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
