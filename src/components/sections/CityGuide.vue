<script setup>
import { ref } from "vue";
import { useLocations } from '../../stores/locations'

const locationStore = useLocations()
let cards = [
  {
    title: "Афиша",
    icon: "mdi-movie-roll",
    route: "/poster",
  },
  {
    title: "Транспорт",
    icon: "mdi mdi-train-car",
    route: "/transport",
   
  },
  {
    title: "Еда",
    icon: "mdi-food-outline",
    route: "/eat",
   
  },
  {
    title: "Жилье",
    icon: "mdi-home-city-outline",
    route: "/stay",
   
  },
  {
    title: "Экскурсии",
    icon: "mdi-crowd",
    route: "/excurs",
  
  },
  {
    title: "Развлечения",
    icon: "mdi-human-female-dance",
    route: "/enter",
 
  },
  {
    title: "Гиды",
    icon: "mdi-human-greeting-proximity",
    route: "/guides",
 
  },
  {
    title: "Сувениры",
    icon: "mdi-gift-outline",
    route: "/souvenirs",
   
  },
];
const city = ref("Глазов");

const focus = () => {
  console.log("focus");
};

const handleChange = (value) => {
  console.log(`selected ${value}`);
};
</script>

<template>
  <a-row style="background-color: #f6f6f6: position: relative;" class="pa-16 justify-center" >
    <a-col :xs="24" :md="20" :xl="16">
      <h2 style="text-align: center; margin-bottom: 0">Гид по городу</h2>
      <h3 class="d-flex justify-center align-center">
        {{ locationStore.location.shortName }}
      </h3>

      <a-row :gutter="[8, 8]" class="justify-center">
        <h3 class="in-work">
          В разработке</h3>
        <a-col v-for="(card, index) in cards" :key="index" :xs="12" :md="8">
          <div class="d-flex" v-if="card.route != '/poster' || card.route !='/transport'">
          </div>
          <router-link :to="card.route == '/poster' ? card.route : card.route == '/transport' ? card.route : '' ">
            <a-card hoverable class="guide-card" :class="{ opacity: card.route != '/poster' && card.route != '/transport' }">
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
  aspect-ratio: 3/1;
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
  top: 50%;
  left: 40%;
  border: solid 1px #ff6600;
  padding: 16px;
  border-radius: 5px;
  color: #ff6600;
  transform: rotate(-15deg);
  z-index: 99;
  font-size: clamp(1.125rem, 0.6563rem + 1.5vw, 1.5rem);
  
}
.opacity{
  opacity: 0.4;
  background: white;
}
</style>
