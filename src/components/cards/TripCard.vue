<script setup>
let props = defineProps({
  tour: Object
})

</script>
<template>
  <div class="custom-card" :style="props.tour.fixedWidth ? { 'width': '170px' } : {}">
    <!-- <div class="custom-card-avatar">
      <a-avatar src="https://joeschmoe.io/api/v1/random" />
      <div class="custom-card-avatar-name">
        Светлана
      </div>
    </div> -->
    <div class="custom-card-cover">
      <img alt="" :src="props.tour.image" style="width: 100%" />
    </div>
    <div class="custom-card-content">
      <div class="custom-card-title">
        <a-typography-title :level="5">
          Легенды Донды Батыра
        </a-typography-title>
      </div>
      <div class="custom-card-subtitile">
        <a-typography-text>
          В такое холодное время года особенно хочется чего-то яркого
        </a-typography-text>
      </div>
      <div class="custom-card-actions mt-8">
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
}

// .custom-card-avatar {
//   font-weight: bold;
//   display: flex;
//   flex-direction: row;
//   align-items: center;

//   margin-bottom: 8px;
// }

.custom-card-cover {
  object-fit: contain;
  display: flex;
  justify-content: center;
  background-color: #C4C4C4;
}

.custom-card-content {
  margin: 8px;
}

.custom-card-subtitile {
  font-weight: light;
}

// .custom-card-actions {
// display: flex;
// justify-content: end;
// }
</style>