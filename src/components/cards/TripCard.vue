<script setup>
import { useRouter } from "vue-router";

let props = defineProps({
  trip: Object,
});

let router = useRouter();
</script>
<template>
  <div @click="router.push('/trip')" style="width: 270px">
    <span class="title"> {{ trip.name }} {{ props.color }} </span>
    <a-badge-ribbon :text="`${trip.cost[0].cost} руб`">
      <a-card hoverable>
        <div>
          <img
            :src="trip.images[0]"
            style="object-fit: cover; width: 100%; height: 175px"
          />
        </div>
        <span>
          c <strong>{{ trip.start }}</strong> по <strong>{{ trip.end }}</strong>
        </span>
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
  color: white;
}
</style>
