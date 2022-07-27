<script setup>
import {reactive} from 'vue'
let tours = reactive(
  {
    image: "https://страна2-0.рф/wp-content/uploads/2020/09/W50HIZer2wQ-1024x682.jpg",
    eventName: "БИ-2",
  }
);
</script>
<template>
  <a-row display="flex" justify="center">
    <a-col :xs="22" :lg="16">

      <div class="cover mb-16">
        <img :src="tours.image" alt="" srcset="">
      </div>

      <div class="content mb-16">

        <div class="title mt-16">
          <h1>Легенды Донды Батыра</h1>
        </div>
        
        <div class="description">
          <h3> В такое холодное время года особенно хочется чего-то яркого </h3>
        </div>

      </div>

      <div>


        <div class="time">
          <div>2 дня/1 ночь</div>
          <div>Ближайший выезд 26.08.2022</div>
        </div>

        <div class="people">
          Количество человек:
          <a-progress :percent="(20 / 27) * 100" :format="(percent) => `20 ч.`">
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

        <div class="price">2000 руб./взр.</div>

        <div class="actions mt-8">
          <a-button
            style="display: flex; align-items: center; color: #3daff5"
            type="text"
          >
            Купить
          </a-button>
        </div>


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

  .content {
    margin: 8px;

    // .title {
    // }

    // .description {
    // }

    .time {
      margin-bottom: 8px;
    }

    .people {
      margin: 8px;
    }

    .price {
      margin: 8px;
    }

    .prizes {
      // margin: 8px;
      .prize {
        font-size: 12px;
        color: #3daff5;
        background-color: white;
      }
    }

    /*.actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        }*/
    /*.avatar {
            font-weight: bold;
            display: flex;
            flex-direction: row;
            align-items: center;

            margin-bottom: 8px;
        }*/
  }
}
img{
  width: 100%;
  aspect-ratio: 25/10;
  border-radius: 25px;}
</style>
