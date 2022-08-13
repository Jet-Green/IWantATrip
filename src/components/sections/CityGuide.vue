<script setup>
import { ref } from "vue";
import toSee from "../../assets/icons/to-see.svg";
import entertainment from "../../assets/icons/entertainment.svg";
import food from "../../assets/icons/food.svg";
import hotel from "../../assets/icons/hotel.svg";
import poster from "../../assets/icons/poster.svg";
import guide from "../../assets/icons/guide.svg";
import heart from "../../assets/icons/heart.svg";
import sport from "../../assets/icons/sport.svg";

let cards = [
  {
    title: "Что посмотреть",
    icon: toSee,
  },
  {
    title: "Где поесть",
    icon: food,
  },
  {
    title: "Где остановиться",
    icon: hotel,
  },
  {
    title: "Афиша",
    icon: poster,
  },
  {
    title: "Экскурсии",
    icon: guide,
  },
  {
    title: "Развлечения",
    icon: entertainment,
  },
  {
    title: "Спорт и красота",
    icon: sport,
  },
  {
    title: "Отдых и здоровье",
    icon: heart,
  },
  {
    title: "Гиды",
    icon: heart,
  },
  {
    title: "Сувениры",
    icon: heart,
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
  <a-row type="flex" justify="center" style="background-color: #f6f6f6">
    <a-col :xs="22" :lg="16">
      <a-row>
        <a-col :xs="12" :offset="6"
          ><h2 style="text-align: center" class="mt-16">
            Гид по городу
          </h2></a-col
        >
        <a-col class="d-flex justify-center align-center" :xs="6">
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
        </a-col>
      </a-row>
      <a-row type="flex" justify="space-around">
        <a-col
          v-for="(card, index) in cards"
          :key="index"
         
          class="mb-16"
        >
          <div class="guide-card ma-4">
            <img :src="card.icon" alt="icon" class="guide-icon" />
            <p style="margin: 0 16px 0 0">
              {{ card.title }}
            </p>
          </div>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>
<style lang="scss" scoped>
.guide-icon {
  height: 70px;
  padding: 16px;
}
.guide-card {
  cursor: pointer;
  background-color: white;
  border-radius: 20px;
  height: 100%;
  width: 200px;
  display: flex;
  align-items: center;
  font-size: clamp(12px, 2vw, 14px);
}

.guide-select {
  text-transform: uppercase;
  font-size: clamp(14px, 2vw, 20px);
  font-weight: bold;
}
</style>