<script setup>
let props = defineProps({
  trip: Object,
  isPreview: Boolean,
});
</script>
<template>
  <div style="width:270px;">
    <span
      v-if="isPreview"
      class="title"
      style="color: white; text-transform: uppercase; "
    >
      {{ trip.name }}
    </span>
    <a-badge-ribbon :text="`${trip.cost[0].cost} руб` ">
    <a-card hoverable>
      <div>
        <img
          :src="trip.images[0]"
          style="object-fit: cover; width: 100%; height: 175px"
        />
      </div>
      <span v-if="props.isPreview">
       c {{ trip.start }} по {{ trip.end }}
      </span>
      <span v-else class="title">
        {{ trip.name }}
        <br />
        Дата: {{ trip.dates }}
        <br />
        Длительность: {{ trip.time }}
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
}
</style>
