<script setup>
import { useRouter } from "vue-router";

let props = defineProps({
  trip: Object,
});

let router = useRouter();
</script>
<template>
  <div @click="router.push('/trip')">
    <div class="title">{{ trip.name }}</div>
    <a-badge-ribbon :text="`${trip.cost[0].cost} руб`" color="ff6600">
      <a-card hoverable>
        <div >
          <img
            :src="trip.images[0]"
            style="object-fit: cover; width: 100%; height: 175px"
          />
        </div>
        <p style="text-align: center">
          c <strong>{{ trip.start }}</strong> по <strong>{{ trip.end }}</strong>
        </p>
      </a-card>
    </a-badge-ribbon>
  </div>
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
.title {
  font-size: 16px;
  text-transform: uppercase;
  text-align: center;
}
</style>
