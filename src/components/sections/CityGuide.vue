<script setup>
import { ref, watch } from "vue";
import { useLocations } from '../../stores/locations'

const locationStore = useLocations()
let cards = ref([
  {
    title: "Афиша",
    icon: "mdi-movie-roll",
    route: "/poster",
    isShow: true,

  },
  {
    title: "Транспорт",
    icon: "mdi mdi-train-car",
    route: "/transport",
    isShow: true,

  },
  {
    title: "Гостиницы",
    icon: "mdi-home-city-outline",
    route: "/stay",
    isShow: true,

  },
  {
    title: "Экскурсии",
    icon: "mdi-crowd",
    route: "/excursions",
    isShow: true,

  },
  {
    title: "Фотобанк",
    icon: "mdi-camera",
    route: "/photos",
    isShow: true,

  },
  {
    title: "Еда",
    icon: "mdi-food-outline",
    route: "/eat",
    isShow: false,

  },

  {
    title: "Аренда",
    icon: "mdi-tent",
    route: "/enter",
    isShow: false,

  },
  {
    title: "Гиды",
    icon: "mdi-human-greeting-proximity",
    route: "/guides",
    isShow: false,

  },
  {
    title: "Сувениры",
    icon: "mdi-gift-outline",
    route: "/souvenirs",
    isShow: false,

  },
]);


watch(locationStore, () => {

  locationStore.location.shortName == 'Глазов' ? cards.value[4].isShow = true : cards.value[4].isShow = false
})
</script>

<template>
  <a-row style="background-color: #f6f6f6; position: relative;" class="pa-16 justify-center">
    <a-col :xs="24" :md="20" :xl="16">
      <h2 style="text-align: center; margin-bottom: 0">В городе</h2>
      <h3 class="d-flex justify-center align-center">
        {{ locationStore.location.shortName }}
      </h3>

      <a-row :gutter="[8, 8]" class="justify-center">
        <h3 class="in-work">
          В разработке</h3>
        <a-col v-for="(card, index) in cards" :key="index" :xs="12" :md="8">
          <div class="d-flex" v-if="!card.isShow">
          </div>
          <router-link :to="card.isShow ? card.route : ''">
            <a-card hoverable class="guide-card" :class="{ opacity: !card.isShow }">
              <div>
                <span class="mdi" :class="card.icon"> </span>
                <span>
                  {{ card.title }}
                </span>
              </div>
            </a-card>
          </router-link>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>
<style lang="scss" scoped>
.guide-select {
  font-size: 20px;
  margin-bottom: 16px;
  
}

.guide-card {
  font-size: clamp(1rem, 0.7983rem + 0.4202vw, 1.25rem);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 10px;
  aspect-ratio: 4/1;
  position: relative;
  padding: 8px;



  .mdi {
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: clamp(1.5rem, 1.1975rem + 0.6303vw, 1.875rem);

  }
}

.in-work {
  position: absolute;
  top: 60%;
  left: 50%;
  border: solid 1px #ff6600;
  padding: 16px;
  border-radius: 5px;
  color: #ff6600;
  transform: rotate(-15deg);
  z-index: 99;
  font-size: clamp(1.125rem, 0.6563rem + 1.5vw, 1.5rem);

}

.opacity {
  opacity: 0.4;
  background: white;
}
</style>
