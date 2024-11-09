<script setup>
import { ref } from 'vue'
import { useRouter } from "vue-router";

defineProps({
  place: Object,
});
let cols = ref(12)

let fullInfo = ref(false)
let isVisible = ref(true)
let toggleCols = () => {
  isVisible.value = false; // Скрываем элемент для анимации растворения

  setTimeout(() => {
    // Меняем ширину после завершения анимации растворения
    cols.value = cols.value === 12 ? 24 : 12;
    fullInfo.value = !fullInfo.value;
    isVisible.value = true; // Появляем элемент заново
  }, 500); // Время задержки должно совпадать с длительностью анимации растворения
}

const router = useRouter()
</script>
<template>
  <Transition name="fade">
    <div class="pa-16" v-show="isVisible">
      <h2 style="text-align: center" @click="toggleCols()"> {{ place.name }}</h2>
      <div style="text-align: center"><b>{{ place?.category?.toLowerCase() }}</b> </div>
      <p @click="toggleCols()"><i>{{ place.shortDescription }}</i> </p>

      <a-row>

        <a-col :xs="24" :md="cols">

          <a-carousel arrows dots-class="slick-dots slick-thumb" effect="fade" autoplay>

            <div v-for="item, index in place.images" :key="index">
              <img :src="item" @click="toggleCols()" />
            </div>
          </a-carousel>

        </a-col>

        <a-col :xs="24" :md="cols" class="pa-32 place-card">
          <div><b>Часы работы:</b> {{ place.openingHours }}</div>
          <div><b>Цена:</b> {{ place.price }}</div>
          <div><b>Сайт/соц.сеть:</b> <a :href="`http://${place?.website}`" target="_blank">{{ place.website }}</a> </div>
          <div> <b>Адрес/координаты: <br> </b> <a
              :href="`https://yandex.ru/maps/?ll=${place.location?.coordinates[0]}%2C${place.location?.coordinates[1]}&z=16&pt=${place.location?.coordinates[0]},${place.location?.coordinates[1]}}`"
              target="_blank"> {{ place.location?.name || place.location?.coordinates }} | на картe<span
                class="mdi  mdi-map-outline" style="font-size: 16px;"></span></a></div>

          <div @click="toggleCols()" style="text-align: center; width: 100%"><span class="mdi  "
              :class="fullInfo ? 'mdi-chevron-double-up' : 'mdi-chevron-double-down'" style="font-size: 28px; "></span>
          </div>
        </a-col>

        <a-col :xs="24" v-if="fullInfo">
          <p v-html="place.description"></p>
        </a-col>
        <a-divider style="margin:2px" v-if="fullInfo"></a-divider>
        <a-col :xs="24" v-if="fullInfo">
          <div v-html="place.advicesForTourists"> </div>
        </a-col>
      </a-row>

    </div>
  </Transition>
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



/* Классы для эффекта растворения */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>