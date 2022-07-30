<script setup>
import { reactive } from "vue";
let tours = reactive({
  image: "https://страна2-0.рф/wp-content/uploads/2020/09/W50HIZer2wQ-1024x682.jpg",
  title: "Легенды Донды Батыра",
  description: " В такое холодное время года особенно хочется чего-то яркого ",
  duration: "2 дня/1 ночь",
  when: "26.08.2022",
  people: 20,
  price: "2000 руб./взр.",
});
</script>
<template>
  <a-row display="flex" justify="center" class="mb-16">
    <a-col :xs="22" :lg="16">
      <a-row display="flex" justify="space-around">
        <a-col :span="11">
          <div class="cover mb-16">
            <img :src="tours.image" alt="" srcset="" />
          </div>

          <div class="title mt-16">
            <h1>{{ tours.title }}</h1>
          </div>
        </a-col>

        <a-col class="content ma-8" :span="11">
          <div class="people ma-8">
            Количество человек:
            <a-progress
              :percent="(tours.people / 27) * 100"
              :format="(percent) => `20 ч.`"
            >
            </a-progress>
          </div>

          <div class="prizes">
            <a-button type="primary" shape="round" class="prize mb-8 mr-8"
              >25 - 33 чел. + Сувенир</a-button
            >
            <a-button type="primary" shape="round" class="prize mb-8 mr-8"
              >34 - 34 чел. + Ужин</a-button
            >
          </div>

          <div>
            <div class="time mb-8">
              <div>Продолжительность: {{ tours.duration }}</div>
              <div>Ближайший выезд: {{ tours.when }}</div>
            </div>

            <div class="price">Цена: {{ tours.price }}</div>
          </div>
          <div class="actions">
            <a-button
              style="display: flex; align-items: center; color: #3daff5"
              type="text"
              class="mt-8"
            >
              Купить
            </a-button>
          </div>
        </a-col>
      </a-row>

      <div class="description ml-16">
        <h3>{{ tours.description }}</h3>
      </div>
    </a-col>
  </a-row>
</template>
<style lang="scss" scoped>
.custom-card {
  margin: 8px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;

  .cover {
    object-fit: contain;
    display: flex;
    justify-content: center;
    background-color: #c4c4c4;
  }

  .prizes {
    .prize {
      font-size: 12px;
      color: #3daff5;
      background-color: white;
    }
  }
}

img {
  width: 100%;
  aspect-ratio: 1/1;
  border-radius: 25px;
}
</style>
