<script setup>
import { ref } from 'vue'
import { useRouter } from "vue-router";

defineProps({
  place: Object,
});
let cols = ref(12)

let fullInfo = ref(false)
let toggleCols = () => {
  cols.value == 12 ? (cols.value = 24, fullInfo.value = true) : (cols.value = 12, fullInfo.value = false);
}

const router = useRouter()
</script>
<template>
  <div class="ma-8">
    <h3 style="text-align: center" @click="toggleCols()"> {{ place.name }}</h3>
    <div style="text-align: center">{{ place.category.toLowerCase() }}</div>
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

        <p v-html="place.advicesForTourists"> </p>
        <div><b>Часы работы:</b> {{ place.openingHours }}</div>
        <div><b>Цена:</b> {{ place.price }}</div>
        <div><b>Сайт:</b> {{ place.website }}</div>
        <div><b>Соц. сети:</b> {{ place.socialMedia }}</div>
        <div  class="d-flex align-center"> <div><b>На карте: </b> </div> <b> <span class="mdi  mdi-map-outline" style="font-size: 24px;"></span></b>

        </div>
        <div @click="toggleCols()" style="text-align: center;"><span class="mdi  "
            :class="fullInfo ? 'mdi-chevron-double-up' : 'mdi-chevron-double-down'"
            style="font-size: 28px; font-weight: bold;"></span></div>

      </a-col>
      <a-col :xs="24" v-if="fullInfo">
        <p v-html="place.description"></p>
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