<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";

let router = useRouter();

let tripsStatus = ref('')

watch(tripsStatus, (status) => {
  localStorage.setItem("createdTripsStatus", status)
  if (status === 'tripsInWork') {
    return router.push('/cabinet/created-trips/created-active-trips')
  }
  if (status === 'tripsOnModeration') {
    return router.push('/cabinet/created-trips/created-trip-on-moderation')
  }
  if (status === 'archiveTrips') {
    return router.push('/cabinet/created-trips/created-archived-trips')
  }
});
onMounted(async () => {
  tripsStatus.value = localStorage.getItem("createdTripsStatus") ? localStorage.getItem("createdTripsStatus") : 'tripsInWork'
});

</script>
<template>
  <a-row>
    <div class="d-flex space-between align-center flex-wrap" style="width: 100%">

      <a-radio-group v-model:value="tripsStatus">
        <a-radio value="tripsOnModeration">На модерации</a-radio>
        <a-radio value="tripsInWork">Действующие</a-radio>
        <a-radio value="archiveTrips">Архив</a-radio>
      </a-radio-group>

      <router-view />

    </div>
  </a-row>
</template>
