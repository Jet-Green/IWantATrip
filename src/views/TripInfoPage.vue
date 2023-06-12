<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { useRoute } from "vue-router";
import BackButton from "../components/BackButton.vue";
import { useTrips } from "../stores/trips";
import { useAuth } from "../stores/auth";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
const router = useRouter();

const route = useRoute();

const _id = route.query._id;

const tripStore = useTrips();
const userStore = useAuth();
const backRoute = "/trips";

const creatorsType = computed(() => {
  return trip.value.creatorForm[1] == "author"
    ? "автор тура"
    : trip.value.creatorForm[1] == "operator"
      ? "туроператор"
      : "турагенство";
});

let selectedByUser = ref([]);
let trip = ref({});
let userInfo = reactive({
  fullname: "",
  phone: "",
});

let tripsCount = computed(() => {
  let sum = 0;
  for (let i = 0; i < trip.value.billsList.length; i++) {
    if (trip.value.billsList[i]) {
      for (let j = 0; j < trip.value.billsList[i].cart?.length; j++) {
        sum += trip.value.billsList[i].cart[j].count;
      }
    }
  }
  return sum;
});

const clearData = (dateNumber) => {
  let date = new Date(dateNumber).toLocaleDateString("ru-Ru", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  });
  if (date !== "Invalid Date" && date) {
    return date;
  }
  return "";
};

function getImg(index) {
  return trip.value.images[index];
}
// function close() {
//   router.push("/trips");
// }
let finalCost = computed(() => {
  let sum = 0;
  if (selectedByUser.value.length) {
    for (let c of selectedByUser.value) {
      sum += c.cost * c.count;
    }
  }
  return sum;
});

let buyDialog = ref(false);

let buyTripDialog = () => {
  if (userStore.user) {
    buyDialog.value = true;
  } else {
    router.push("/reg");
  }
};

async function buyTrip(isBoughtNow) {
  if (userInfo.phone) {
    let bill = {
      isBoughtNow,
      cart: [...selectedByUser.value],
      tripId: trip.value._id,
      userInfo: {
        _id: userStore.user._id,
        fullname: userInfo.fullname,
        phone: userInfo.phone,
      }
    };

    for (let i = 0; i < bill.cart.length; i++) {
      if (bill.cart[i].count == 0) {
        bill.cart.splice(i, 1);
      }
    }

    await userStore
      .buyTrip(trip.value._id, bill)
      .then(() => {
        message.config({ duration: 3, top: "90vh" });
        message.success({ content: "Тур заказан!" });
        buyDialog.value = false;
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    message.config({ duration: 3, top: "90vh" });
    message.success({ content: "Нужен телефон" });
  }
}

onMounted(() => {
  tripStore
    .getFullTripById(_id)
    .then((response) => {
      trip.value = response.data;
      for (let cost of response.data.cost) {
        selectedByUser.value.push({
          cost: cost.price,
          count: 0,
          costType: cost.first,
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
})
</script>
<template>
  <div style="overflow-x: hidden">
    <BackButton :backRoute="backRoute" />
    <!-- {{ trip.billsList[0].cart[0].count }} -->

    <a-row class="justify-center d-flex">
      <a-col :xs="22" :xl="16">
        <h2 class="ma-0">{{ trip.name }}</h2>
        <!-- <span class="ma-0">Место старта: {{ trip.startLocation.name }}</span> -->
        <a-spin v-if="!trip._id" size="large"></a-spin>
        <a-row v-if="trip._id" :gutter="[12, 12]" class="text justify-center d-flex">
          <!-- добавить карусель фотографий -->
          <a-col :xs="24" :md="12">
            <a-carousel arrows dots-class="slick-dots slick-thumb">
              <template #customPaging="props">
                <a>
                  <img :src="getImg(props.i)" />
                </a>
              </template>
              <div v-for="(item, i) in trip.images" :key="i">
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
            <i>  {{ trip.offer }}</i>
            <a-divider style="border-color: #245159" dashed />
            <!-- <div>{{ creatorsType }}: <b>{{ trip.creatorForm[0] }}</b> </div> -->
            <div>Старт: <b>{{ trip.startLocation.name }}</b> </div>
            
            <div>
              Продолжительность: <b>{{ trip.duration }} дн.</b>
            </div>
            <div>
              Ключевые точки: <b>{{ trip.tripRoute }}</b>
            </div>
            <div>
              Ближайший выезд: <b>{{ clearData(trip.start) }}</b>
            </div>
            <div>Количество человек:</div>
            <div style="width: 50%">
             <b> <a-progress :percent="(tripsCount / trip.maxPeople) * 100" :format="() => `${tripsCount}/${trip.maxPeople} чел`">
              </a-progress></b>
            </div>
            <div>
              Цена
              <div v-for="(item, index) in trip.cost" :key="index" class="cost">
                {{ item.first }} : <b>{{ item.price }} руб.</b>
              </div>

            </div>
            <div class="d-flex justify-center ma-8">
              <a-button v-if="tripsCount != trip.maxPeople" type="primary" class="lets_go_btn" size="large"
                style="display: flex; justify-content: center" @click="buyTripDialog()">
                Купить
              </a-button>
            </div>
            <div>
              <b v-if="(tripsCount == trip.maxPeople)">
                мест больше нет
              </b>
            </div>
          </a-col>

          <a-col :xs="24">
            <span v-html="trip.description"></span>
          </a-col>
        </a-row>
      </a-col>
    </a-row>

    <a-modal v-model:visible="buyDialog" :footer="null">
      <a-row :gutter="[4, 4]">
        <a-col :span="24" :md="12">
          Фaмилия Имя
          <a-input style="width: 100%" v-model:value="userInfo.fullname" placeholder="Иванов Иван Иванович" />
        </a-col>
        <a-col :span="24" :md="12">
          Телефон
          <a-input style="width: 100%" v-model:value="userInfo.phone" placeholder="79127528874" />
        </a-col>

        <a-col :span="24">
          <div>Цена</div>
          <div class="d-flex space-around align-center" v-for="(cost, index) of trip.cost" :key="index">
            {{ cost.first }}<span>{{ cost.price }} руб. </span>
            <div class="d-flex direction-column">
              <span style="font-size: 8px">кол-во</span>
              <a-input-number v-model:value="selectedByUser[index].count" :min="0" :max="trip.maxPeople - tripsCount"
                placeholder="чел"></a-input-number>
            </div>
          </div>
        </a-col>
        <a-col :span="24">
          <b>Итого: {{ finalCost }} руб.</b>
        </a-col>

        <a-col :span="24">
          <div>Оплатить</div>
          <div class="d-flex space-around">
            <!-- <a-button type="primary" @click="buyTrip(true)"> сейчас </a-button> -->
            <a-button @click="buyTrip(false)"> Заказать </a-button>
          </div>
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>
<style lang="scss" scoped>
img {
  width: 100%;
  aspect-ratio: 270/175;
  object-fit: cover;
}

// .coster:nth-of-type(1n + 2) {
//   display: flex;
// }

.ant-carousel :deep(.slick-dots) {
  position: relative;
  height: auto;
}

.ant-carousel :deep(.slick-slide img) {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 100%;
}

.ant-carousel :deep(.slick-thumb) {
  bottom: 0px;
}

.ant-carousel :deep(.slick-thumb li) {
  width: 60px;
  height: 45px;
}

.ant-carousel :deep(.slick-thumb li img) {
  width: 100%;
  // height: 100%;
  filter: grayscale(100%);
  display: block;
}

.ant-carousel :deep(.slick-thumb li.slick-active img) {
  filter: grayscale(0%);
}

.ant-carousel :deep(.slick-arrow.custom-slick-arrow) {
  color: white;
  line-height: normal;
  width: 50px;
  height: 50px;
  opacity: 1;
  z-index: 1;
  top: 40%;
}

// .ant-carousel :deep(.custom-slick-arrow:before) {
//   display: none;
// }

// .ant-carousel :deep(.custom-slick-arrow:hover) {
//   opacity: 0.8;
// }
</style>
