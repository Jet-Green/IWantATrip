<script setup>
import BackButton from "../components/BackButton.vue";

import { ref, computed, onMounted, getCurrentInstance } from "vue";

import { useRoute } from "vue-router";
import { useExcursion } from "../stores/excursion.js";
import { useAuth } from "../stores/auth";
import { useLocations } from "../stores/locations";

const route = useRoute();
const _id = route.query._id;

const excursionStore = useExcursion();
const userStore = useAuth();
const locationStore = useLocations();

let edate = ref({});

function getImg(index) {
  return trip.value.images[index];
}

let buyTripDialog = () => {

if (userStore.user.email) {
    // if (!selectedDate.value.selected) {
    //     tripDates.value[0].selected = true;
    //     selectedDate.value = tripDates.value[0];
    // }
    buyDialog.value = true;
} else {
    router.push("/reg");
}

};

function startDate(index){
  let day = edate.value.date.day
  let month = edate.value.date.month
  let year = edate.value.date.year
  let time= `${edate.value.times[index].hours}:${edate.value.times[index].minutes}`
  return `${day}.${month}.${year} в ${time}`
}


onMounted(async () => {
  let response = await excursionStore.getEDateById(_id);
  edate.value = response.data;
});
</script>
<template>
  <div style="overflow-x: hidden">
    <BackButton :backRoute="{ path: '/excursions' }" />
    <a-row class="justify-center d-flex">
      <a-spin v-if="!edate._id" size="large"></a-spin>

      <a-col :xs="22" :xl="16" v-else>
        <h2 class="ma-0">{{ edate.excursion.name }}</h2>

        <a-row :gutter="[12, 12]" class="text justify-center d-flex">
          <a-col :xs="24" :md="12">
            <a-carousel arrows dots-class="slick-dots slick-thumb">
              <template #customPaging="props">
                <a>
                  <img :src="getImg(props.i)" />
                </a>
              </template>
              <div v-for="(item, i) in edate.excursion.images" :key="i">
                <img :src="item" alt="" srcset="" />
              </div>
              <template #prevArrow>
                <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
                  <span class="mdi mdi-48px mdi-chevron-left"></span>
                </div>
              </template>
              <template #nextArrow>
                <div class="custom-slick-arrow" style="right: 10px">
                  <span class="mdi mdi-48px mdi-chevron-right"></span>
                </div>
              </template>
            </a-carousel>
          </a-col>

          <a-col :xs="24" :md="12" class="pa-8">
            <!-- <div style="float: right">
              <span
                style="opacity: 0.7; cursor: pointer"
                class="mdi mdi-24px mdi-printer ma-8"
                @click="print()"
              ></span>

              <a-dropdown :trigger="['click']">
                <a class="ant-dropdown-link" @click.prevent>
                  <span
                    style="opacity: 0.7"
                    class="mdi mdi-24px mdi-share-variant-outline ma-8"
                  ></span>
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item v-for="(link, index) of ShareLogo" :key="index">
                      <ShareNetwork
                        :network="link.network"
                        :url="getLink()"
                        :title="trip.name"
                        :description="edate.offer"
                      >
                        <span>{{ link.network }}</span>
                      </ShareNetwork>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </div> -->

            <div>
              Место начала: <b> {{ edate.excursion.startPlace }}</b>
            </div>

            <div>
              Продолжительность: <b>{{ edate.excursion.duration }}</b>
            </div>
            <div>
              Тип: <b>{{ edate.excursion.excursionType.directionType }} - {{ edate.excursion.excursionType.type }}</b>
            </div>
            <div>
              Направление: <b>{{ edate.excursion.excursionType.directionPlace }}</b>
            </div>
            Дата старта:
            <div v-for="(item, index) in edate.times">
              <b>{{startDate(index)}} </b>
            </div>
            Гиды:
            <div v-for="guide in edate.excursion.guides">
              <b>{{ guide.name }}</b>
            </div>
            <!-- <div class="d-flex">
              Дата начала тура: &nbsp
              <div>
                <a-checkable-tag
                  class="pretty-tag"
                  v-for="(date, index) of tripDates"
                  :checked="date.selected"
                  @change="selectDate(index)"
                >
                  <b>
                    {{ clearData(date.start) }} -
                    {{ clearData(date.end) }}
                  </b>
                  ({{ getCustomersCount(date.billsList) + "/" + trip.maxPeople }} чел.)
                </a-checkable-tag>
              </div>
            </div> -->

            <!-- <div v-if="tripDates.length < 2">
              <div>Количество человек:</div>
              <div style="width: 50%">
                <b>
                  <a-progress
                    :percent="
                      (getCustomersCount(selectedDate.billsList) / trip.maxPeople) * 100
                    "
                    :format="
                      () =>
                        `${getCustomersCount(selectedDate.billsList)}/${
                          trip.maxPeople
                        } чел`
                    "
                  >
                  </a-progress
                ></b>
              </div>
            </div> -->

            <div class="d-flex">
              Цена:&nbsp
              <div>
                <div v-for="(item, index) in edate.excursion.prices" :key="index" class="cost">
                  {{ item.first }}: <b>{{ item.price }} руб.</b>
                </div>
              </div>
            </div>
            <!-- <div v-if="trip.bonuses.length" class="d-flex">
              Бонусы:&nbsp
              <div>
                <div v-for="(item, index) in trip.bonuses" :key="index">
                  <i>
                    {{ item.type }} <b>{{ item.bonus }}</b>
                  </i>
                </div>
              </div>
            </div> -->
            <!-- <div v-if="trip.transports?.length">
              <WaitingList
                :tripsCount="getCustomersCount(selectedDate.billsList)"
                :transport="trip.transports ?? []"
              />
            </div> -->
            <!-- <div
              class="d-flex justify-center ma-8"
              v-if="
                trip.maxPeople -
                  getCustomersCount(selectedDate.billsList) -
                  selectedDate.selectedCosts.reduce((acc, cost) => {
                    return acc + cost.count;
                  }, 0) >
                0
              "
            >
              <a-button
                type="primary"
                class="lets_go_btn"
                style="display: flex; justify-content: center"
                @click="buyTripDialog()"
              >
                Купить
              </a-button>
            </div> -->
            <a-button
                type="primary"
                class="lets_go_btn"
                style="display: flex; justify-content: center"
                @click="buyTripDialog()"
              >
                Купить
              </a-button>

            <!-- <div>
              <b
                v-if="
                  trip.maxPeople -
                    getCustomersCount(selectedDate.billsList) -
                    selectedDate.selectedCosts.reduce((acc, cost) => {
                      return acc + cost.count;
                    }, 0) <=
                  0
                "
              >
                мест больше нет
              </b>
            </div> -->
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
