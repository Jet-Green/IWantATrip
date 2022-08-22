<script setup>
import { useRouter } from "vue-router";

let router = useRouter();
let props = defineProps({
  tour: Object,
});
</script>
<template>
  <a-card hoverable class="pa-0">
    <div style="height: 200px;  overflow: hidden; display: flex; justify-content: center; align-items: center;">
      <img :src="props.tour.image" style="width: 100%;"/>
    </div>

    <span class="title">{{ props.tour.name }}</span>
  </a-card>

  <!-- <div class="custom-card">
     
        <div class="cover">
            <img alt="" :src="props.tour.image" style="width: 100%" />
        </div>
        <div class="content">
            <div class="title">
                <h3>
                    Легенды Донды Батыра
                </h3>
            </div>


            <div v-if="isPreview">
                <div class="description" style="text-align: start;">
                    В такое холодное время года особенно хочется чего-то яркого
                </div>
                <div class="price" style="text-align: start;">
                    2000 руб./взр.
                </div>
                <div class="actions mt-8">
                    <a-button style="display: flex; align-items: center; color: #3DAFF5" type="text"
                        @click="router.push({ name: 'TripInfoPage' })">
                        Подробнее
                    </a-button>
                </div>
            </div>


            <div v-else>
                <div class="time">
                    <div>
                        2 дня/1 ночь
                    </div>
                    <div>
                        Ближайший выезд 26.08.2022
                    </div>
                </div>

                <div class="description">
                    <span>
                        В такое холодное время года особенно хочется чего-то яркого
                    </span>
                </div>

                <div >
                    Количество человек:
                    <a-progress :percent="(20 / 27) * 100" :format="percent => `20 ч.`">
                    </a-progress>
                </div>
                <div >
                    <a-button type="primary" shape="round" class="prize mb-8 mr-8">25 - 33 чел. + Сувенир</a-button>
                    <a-button type="primary" shape="round" class="prize mb-8 mr-8">34 - 34 чел. + Ужин</a-button>
                </div>
                <div >
                    2000 руб./взр.
                </div>
                <div class="actions mt-8">
                    <a-button style="display: flex; align-items: center; color: #3DAFF5" type="text">
                        Купить
                    </a-button>
                </div>
            </div>
        </div>
    </div> -->
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
}
</style>