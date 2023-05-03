<script setup>
let trips = []
</script>
<template>
  <div>
    <a-row>
      <a-col :span="24">
        <h2>Туры на модерации</h2>
      </a-col>
    </a-row>
    <a-row>
      <a-col :lg="8" :sm="12" :xs="24" v-if="trips.length > 0" v-for="(trip, index) of trips" :key="index">
        <a-card class="card " hoverable :class="[trip.isHidden ? 'overlay' : '']">
          <div style="text-align:center">
            {{ trip.name }}
          </div>
          <a-divider class="ma-4" style="border-color: #205F79"></a-divider>
          <div>
            <span class="mdi mdi-compass-outline"></span>{{ trip.location }}
          </div>
          <div>
            <span class="mdi mdi-calendar-arrow-right"></span>
            {{ `c ${clearData(trip.start)}` }}
            <span class="mdi mdi-calendar-arrow-left"></span>
            {{ `по ${clearData(trip.end)}` }}
          </div>

          <div class="actions d-flex justify-center">
            <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="tripToDelete(trip._id)"
              v-if="!trip.billsList.length > 0">
              <span class="mdi mdi-delete" style="color: #ff6600; cursor: pointer"></span>
            </a-popconfirm>
            <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="editTrip(trip._id)">
              <span class="mdi mdi-pen" style="color: #245159; cursor: pointer"></span>
            </a-popconfirm>
            <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="hideTrip(trip._id)">
              <span v-if="!trip.isHidden" class="mdi mdi-eye" style="color: #245159; cursor: pointer"></span>
              <span v-else class="mdi mdi-eye-off" style="color: #245159; cursor: pointer"></span>
            </a-popconfirm>
            <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="copyTrip(trip._id)">
              <span class="mdi mdi-content-copy" style="color: #245159; cursor: pointer"></span>
            </a-popconfirm>
          </div>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<style lang="scss" scoped></style>