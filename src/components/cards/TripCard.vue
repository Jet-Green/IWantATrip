<script setup>
let props = defineProps({
  tour: Object
})

</script>
<template>
  <!-- :style="props.fixedWidth ? { 'width': '170px' } : {}" -->
  <div class="custom-card">
    <!-- <div class="custom-card-avatar">
      <a-avatar src="https://joeschmoe.io/api/v1/random" />
      <div class="custom-card-avatar-name">
        Светлана
      </div>
    </div> -->
    <div class="cover">
      <img alt="" :src="props.tour.image" style="width: 100%" />
    </div>
    <div class="content">
      <div class="custom-card-title">
        <h3>
          Легенды Донды Батыра
        </h3>
      </div>
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

      <div class="people">
        Количество человек:
        <a-progress :percent="(20 / 27) * 100" :format="percent => `20 ч.`">
        </a-progress>
      </div>
      <div class="prizes">
        <a-button type="primary" shape="round" class="prize mb-8 mr-8">25 - 33 чел. + Сувенир</a-button>
        <a-button type="primary" shape="round" class="prize mb-8 mr-8">34 - 34 чел. + Ужин</a-button>
      </div>
      <div class="price">
        2000 руб./взр.
      </div>
      <div class="actions mt-8">
        <a-button style="display: flex; align-items: center; color: #3DAFF5" type="text">
          Купить
        </a-button>

      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.custom-card {
  margin: 8px;
  overflow: hidden;
  background: #FFFFFF;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;

  .cover {
    object-fit: contain;
    display: flex;
    justify-content: center;
    background-color: #C4C4C4;
  }

  .content {
    margin: 8px;
  }

  .description {
    font-weight: light;
  }

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
</style>