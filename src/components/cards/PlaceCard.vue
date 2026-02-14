<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRoute } from "vue-router";
import { usePlaces } from "../../stores/place"


const placeStore = usePlaces()

let props = defineProps({
  place: Object,
  open: Boolean,
  inCard: Boolean
});
let cols = ref(12)
let place = ref(props.place)

const route = useRoute();

const _id = route.query._id;
let fullInfo = ref(false)
let isVisible = ref(true)
let toggleCols = () => {
  isVisible.value = false; // Скрываем элемент для анимации растворения

  setTimeout(() => {
    // Меняем ширину после завершения анимации растворения
    if (!props.inCard) {
      cols.value = cols.value === 12 ? 24 : 12;
    }
    fullInfo.value = !fullInfo.value;
    isVisible.value = true; // Появляем элемент заново
  }, 100); // Время задержки должно совпадать с длительностью анимации растворения
}

onMounted(async () => {
  isVisible.value = true

  if (_id) {
    placeStore.getById(_id).then((res) => place.value = res.data)
  }
  if (props.open || props.inCard) {
    fullInfo.value = true
    cols.value = 24
  }
})

</script>
<template>

  <Transition name="fade">
    <div v-show="isVisible">
      <p style="text-align: center; font-size: clamp(1.125rem, 0.925rem + 0.8vw, 1.375rem); font-weight: 700;" @click="toggleCols"> {{ place?.name }}</p>
      <div class="text" style="text-align: center">{{ place?.category?.toLowerCase() }} </div>
      <p @click="toggleCols" class="text"><i>{{ place?.shortDescription }}</i> </p>

      <a-row class="text">

        <a-col :xs="24" :md="cols">

          <a-carousel arrows dots-class="slick-dots slick-thumb"  autoplay>

            <div v-for="item, index in place?.images" :key="index">
              <img :src="item" @click="toggleCols"  loading="lazy" alt="not found"
              />
            </div>
          </a-carousel>

        </a-col>

        <a-col :xs="24" :md="cols" class="place-card ">
          <div v-if = "place?.openingHours"> Часы работы: <b> {{ place?.openingHours }} </b></div>
          <div v-if = "place?.price "> Стоимость: <b> {{ place?.price }} </b></div>
          <div v-if = "place?.phone " >Телефон: <b> <a :href=" `tel:${place?.phone}`">{{ place?.phone }}</a> </b></div>
          <div v-if = "place?.website ">Сайт/соц.сеть: <b> <a :href="place?.website" target="_blank">{{ place?.website }}</a> </b>
          </div>
          <div> Адрес/координаты: <br> <b> <a
                :href="`https://yandex.ru/maps/?ll=${place?.location?.coordinates[0]}%2C${place?.location?.coordinates[1]}&z=16&pt=${place?.location?.coordinates[0]},${place?.location?.coordinates[1]}}`"
                target="_blank"> {{ place?.location?.name || place?.location?.coordinates }} <MdiIcon style="font-size: 16px;" name="map-outline" /></a></b> </div>


          <div @click="toggleCols()" style="text-align: center; width: 100%; cursor:pointer"><span class="mdi  "
              :class="fullInfo ? 'mdi-chevron-up' : 'mdi-chevron-down'" style="font-size: 28px; "></span>
          </div>
        </a-col>

        <a-col :xs="24" v-if="fullInfo">
          <p v-html="place?.description"></p>
        </a-col>

        <a-col :xs="24" v-if="fullInfo">
          <div v-html="place?.advicesForTourists"> </div>
        </a-col>

        <a-col v-if="fullInfo && place?.trips.length">
          <div>
            <b>Посещается в турах: </b>

            <div class="d-flex flex-wrap">
              <RouterLink v-for="trip, index of place?.trips" :key="index" :to="`/trip?_id=${trip._id}&history=true`">
                <a-card class="pa-8 ml-8 mb-8 text " hoverable style="cursor: pointer; border: #239FCC 1px solid;">
                  {{ trip.name }}
                </a-card>
              </RouterLink>
            </div>
          </div>
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
  transition: opacity 0.1s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.place-card {
  padding: 20px 0 0 20px;
}
</style>