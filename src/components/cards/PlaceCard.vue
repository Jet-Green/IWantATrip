<script setup>
import { ref } from 'vue'
import { useRouter } from "vue-router";

defineProps({
  place: Object,
});
let cols = ref(12)

let toggleCols = () => {
  cols.value == 12 ? cols.value = 24 : cols.value = 12;
}

const router = useRouter()
</script>
<template>
  <div class="ma-8">
    <h3 style="text-align: center" @click="toggleCols()"> {{ place.name }}</h3>
    <div style="text-align: center">{{ place.category }}</div>
    <p @click="toggleCols()">{{ place.shortDescription }}</p>

    <a-row>
      <a-col :xs="24" :md="cols">
        <a-carousel arrows dots-class="slick-dots slick-thumb" effect="fade" autoplay>

          <div v-for="item, index in place.images" :key="index">
            <img :src="item" @click="toggleCols()" />
          </div>
        </a-carousel>
      </a-col>
      <a-col :xs="24" :md="cols" class="pa-4">
        <p >{{ place.description }}</p>
        <p> {{ place.advicesForTourists }}</p>
        <p><b>Часы работы:</b> {{ place.openingHours }}</p>
        <p><b>Цена:</b> {{ place.price }}</p>
        <p><b>Сайт:</b> {{ place.website }}</p>
        <p><b>Соц. сети:</b> {{ place.socialMedia }}</p>
        <p> <b>На карте <span class="mdi  mdi-map-marker-outline" style="font-size: 24px;"></span></b>

        </p>
      </a-col>
    </a-row>

  </div>
  <a-divider style="height: 2px; background-color: #50651D" />
</template>

<style scoped>
:deep(.slick-slide img) {
  /* border: 5px solid #fff; */
  display: block;
  margin: auto;
  width: 100%;
  aspect-ratio: 2;
  object-fit: cover;
  /* max-width: 80%; */
}

:deep(.slick-arrow) {
  display: none !important;
}



</style>