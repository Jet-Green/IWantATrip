<script setup>
import BackButton from "../components/BackButton.vue";
import BuyExcursionDates from "../components/BuyExcursionDates.vue";
import _ from "lodash"
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

});
</script>
<template>
  <div style="overflow-x: hidden">
    <BackButton :backRoute="{ path: '/excursions' }" />
    <a-row class="justify-center d-flex">
      <a-spin v-if="!excursion._id" size="large"></a-spin>

      <a-col :xs="22" :xl="16" v-else>
        <h2 class="ma-0">{{ excursion.name }}</h2>
        <div>
          {{ excursion.excursionType.type }} | {{ excursion.excursionType.directionType }} | {{
      excursion.excursionType.directionPlace }}
        </div>
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

            </div> -->

            <div>
              Место начала: <b> {{ excursion.startPlace }}</b>
            </div>

            <div>
              Продолжительность: <b>{{ excursion.duration }}</b>
            </div>

            <div class="d-flex">
              Гиды: &nbsp
              <div v-for="guide in excursion.guides">
                <b>{{ guide.name }} </b>
              </div>
            </div>



            <div class="d-flex">
              Цены:&nbsp
              <div>
                <div v-for="(item, index) in excursion.prices" :key="index">
                  {{ item.type }} - <b>{{ item.price }} руб</b>
                </div>
              </div>
            </div>
            <div>
              От <b>{{ excursion.minPeople }}</b>  до <b>{{ excursion.maxPeople }} чел.</b>  
            </div>
            <div>
              Мин. возраст:  <b>{{ excursion.minAge }}  </b>  
            </div>
            <div v-if = "_.isEmpty(excursion.dates)">
              Заявка за:  <b>{{ excursion.deadline }} дн.</b>  
            </div>
            <div>
              Доступность:  <b> 
                <span v-if="excursion.availability" class="mdi mdi-24px mdi-wheelchair-accessibility"></span>
                <span v-else class="mdi mdi-24px mdi-minus-circle-outline"></span>
             
              </b>  
            </div>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <h3>Расписание</h3>
          </a-col>
          <a-col :span="24">
            <div v-if = "_.isEmpty(excursion.dates)" class="month" > По заявкам</div>
            <BuyExcursionDates v-else :dates="excursion.dates" :excursionId="excursion._id" />
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            {{ excursion.description }}
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<style lang="scss" scoped>
 .month {
    font-weight: 600;
    font-size: clamp(0.9375rem, 0.6889rem + 0.7102vw, 1.25rem);
  }

</style>
