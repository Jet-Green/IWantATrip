<script setup>
import { ref } from "vue";

let cards = [
  {
    title: "Что посмотреть",
    icon: "mdi-eiffel-tower",
    route: "/watch",
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
    title: "Афиша",
    icon: "mdi-movie-roll",
    route: "/poster",
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
  // {
  //   title: "Спорт",
  //   icon: "sport",
  //   route: "/sport",
  // },
  // {
  //   title: "Красота",
  //   icon: "sport",
  //   route: "/sport",
  // },
  // {
  //   title: "Здоровье",
  //   icon: "heart",
  //   route: "/relax",
  // },
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
  <a-row style="background-color: #f6f6f6" class="pa-16 justify-center">
    <a-col :xs="24" :md="20" :xl="16">
      <h2 style="text-align: center; margin-bottom: 0">Гид по городу</h2>

      <div class="d-flex justify-center align-center">
        <a-select
          class="guide-select"
          v-model:value="city"
          :focus="focus"
          @change="handleChange"
          :bordered="false"
        >
          <a-select-option value="glazov"> Глазов </a-select-option>
          <a-select-option value="izhevsk"> Ижевск </a-select-option>
          <a-select-option value="perm"> Пермь </a-select-option>
        </a-select>
      </div>

      <a-row :gutter="[12, 12]" class="justify-center">
        <a-col v-for="(card, index) in cards" :key="index" :xs="12" :md="8">
          <router-link :to="card.route">
            <a-card hoverable class="guide-card">
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
  .mdi{
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: clamp(1.5rem, 1.1975rem + 0.6303vw, 1.875rem);
    color:rgb(32, 95, 121);
  }
}
</style>
