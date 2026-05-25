<script setup>
import { onMounted, ref } from 'vue'
import { useTrips } from '../../stores/trips'

const tripStore = useTrips()

let tripsOnModeration = ref([])

onMounted(async () => {
  let response = await tripStore.findForModeration()

  tripsOnModeration.value = response.data
})


const clearData = (dataString) => {
  let date
  if (dataString.length == 13) {
    const dataFromString = new Date(Number(dataString));
    date = dataFromString

  } else {
    date = new Date(dataString)
  };
  return date.toLocaleDateString("ru-Ru", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",

  })
}
</script>
<template>
  <div>
    <a-row>
      <a-col :span="24">
        <h2>Туры на модерации</h2>
      </a-col>
    </a-row>
    <a-row>
      <a-col :lg="8" :sm="12" :xs="24" v-if="tripsOnModeration.length > 0" v-for="(trip, index) of tripsOnModeration"
        :key="index">
        <a-card class="card " hoverable :class="[trip.isHidden ? 'overlay' : '']">
          <div style="text-align:center">
            {{ trip.name }}
          </div>
          <a-divider class="ma-4" style="border-color: #205F79"></a-divider>
          <div>
            <MdiIcon name="compass-outline" />{{ trip.location }}
          </div>
          <div>
            <MdiIcon name="calendar-arrow-right" />
            {{ `c ${clearData(trip.start)}` }}
            <MdiIcon name="calendar-arrow-left" />
            {{ `по ${clearData(trip.end)}` }}
          </div>

          <div class="actions d-flex justify-center">
            <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="tripToDelete(trip._id)"
              v-if="!trip.billsList.length > 0">
              <MdiIcon style="color: #ff6600; cursor: pointer" name="delete" />
            </a-popconfirm>
            <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="editTrip(trip._id)">
              <MdiIcon style="color: #245159; cursor: pointer" name="pen" />
            </a-popconfirm>
            <a-popconfirm title="Всё правильно?" ok-text="Да" cancel-text="Нет"
              @confirm="tripStore.moderateTrip(trip._id)">
              <MdiIcon style="color: #245159; cursor: pointer" name="shield-plus-outline" />
            </a-popconfirm>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<style scoped lang="scss">
.actions {
  font-size: 20px;
  position: relative;

  * {
    margin: 4px;
    cursor: pointer;
  }
}

.overlay {

  opacity: 0.5;

}

.card {

  background: #f6f6f6;
  padding: 8px;
}
</style>