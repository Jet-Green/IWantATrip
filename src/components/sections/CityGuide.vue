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
        <a-col class="d-flex">
          <h2>Гид по городу
            <a-select class="ma-16 guide-select" v-model:value="city" :focus="focus" @change="handleChange"
              :bordered="false">
              <a-select-option value="glazov">
                <h2>
                  Глазов
                </h2>
              </a-select-option>
              <a-select-option value="izhevsk">
                <h2>
                  Ижевск
                </h2>
              </a-select-option>
              <a-select-option value="perm">
                <h2>
                  Пермь
                </h2>
              </a-select-option>
            </a-select>
          </h2>
        </a-col>
      </a-row>
      <a-row type="flex" justify="space-between">
        <a-col v-for="(card, index) in cards" :key="index" :xs="11" :lg="5" class="mb-16">
          <div class="guide-card">
            <img :src="card.icon" alt="icon" class="guide-icon" />
            <a-typography-title :level="5" style="margin: 0 16px 0 0">
              {{ card.title }}
            </a-typography-title>
          </div>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<style lang="scss">
.guide-icon {
  height: 70px;
  padding: 16px;
}

.guide-card {
  cursor: pointer;
  background-color: white;
  border-radius: 20px;
  height: 100%;
  display: flex;
  align-items: center;
}

.guide-select {
  font-size: 32px;
}
</style>
