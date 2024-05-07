<script setup>
import BackButton from "../components/BackButton.vue";
import BuyExcursionDates from "../components/BuyExcursionDates.vue";

import { ref, onMounted } from "vue";

import { useRoute } from "vue-router";
import { useExcursion } from "../stores/excursion.js";
import { useAuth } from "../stores/auth";
import { useLocations } from "../stores/locations";

const route = useRoute();
const _id = route.query._id;

const excursionStore = useExcursion();
const userStore = useAuth();
const locationStore = useLocations();

let excursion = ref({});

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

function startDate(index) {
  // let day = excursion.value.date.day
  // let month = excursion.value.date.month
  // let year = excursion.value.date.year
  // let time= `${excursion.value.times[index].hours}:${excursion.value.times[index].minutes}`
  // return `${day}.${month}.${year} в ${time}`
  return 'index: ' + index
}


onMounted(async () => {
  let response = await excursionStore.getExcursionById(_id);
  excursion.value = response.data;
  console.log(response.data);
});
</script>
<template>
  <div style="overflow-x: hidden">
    <BackButton :backRoute="{ path: '/excursions' }" />
    <a-row class="justify-center d-flex">
      <a-spin v-if="!excursion._id" size="large"></a-spin>

      <a-col :xs="22" :xl="16" v-else>
        <h2 class="ma-0">{{ excursion.name }}</h2>

        <a-row :gutter="[12, 12]" class="text justify-center d-flex">
          <a-col :xs="24" :md="12">
            <a-carousel arrows dots-class="slick-dots slick-thumb">
              <template #customPaging="props">
                <a>
                  <img :src="getImg(props.i)" />
                </a>
              </template>
              <div v-for="(item, i) in excursion.images" :key="i">
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
              Место начала: <b> {{ excursion.startPlace }}</b>
            </div>

            <div>
              Продолжительность: <b>{{ excursion.duration }}</b>
            </div>
            <div>
              Тип: <b>{{ excursion.excursionType.directionType }} - {{ excursion.excursionType.type }}</b>
            </div>
            <div>
              Направление: <b>{{ excursion.excursionType.directionPlace }}</b>
            </div>
            Гиды:
            <div v-for="guide in excursion.guides">
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
                <div v-for="(item, index) in excursion.prices" :key="index" class="cost">
                  {{ item.first }}: <b>{{ item.price }} руб.</b>
                </div>
              </div>
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <h3>Расписание</h3>
          </a-col>
          <a-col :span="24">
            <BuyExcursionDates :dates="excursion.dates" :excursionId="excursion._id" />
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>
