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

let selectedByUser = ref([]);
let trip = ref({});
let userInfo = reactive({
  fullname: "",
  phone: "",
});

tripStore
  .getById(_id)
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

function clearData(dataString) {
  const dataFromString = new Date(Number(dataString));
  return dataFromString.toLocaleDateString();
}

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
      userId: userStore.user._id,
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

    userStore.user.fullinfo.fullname = userInfo.fullname;
    userStore.user.fullinfo.phone = userInfo.phone;

    await userStore
      .updateUser({
        email: userStore.user.email,
        fullinfo: userStore.user.fullinfo,
      })
      .then((response) => {
        userStore.user = response.data;
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    message.config({ duration: 3, top: "90vh" });
    message.success({ content: "Нужен телефон" });
  }

  //тут обновить полную информацию о юзере
}
onMounted(() => {
  if (userStore.user) {
    userInfo.fullname = userStore.user.fullinfo.fullname;
    userInfo.phone = userStore.user.fullinfo.phone;
  }
});
</script>
<template>
  <div style="overflow-x: hidden">
    <BackButton :backRoute="backRoute" />
    <a-row v-if="!trip._id">
      <a-col :span="24" class="d-flex justify-center">
        <a-spin size="large"></a-spin>
      </a-col>
    </a-row>

    <a-row
      v-else
      display="flex"
      justify="center"
      style="font-size: clamp(14px, 2.5vw, 16px)"
    >
      <a-col :xs="24" class="title">
        <h1 class="ma-0">{{ trip.name }}</h1>
      </a-col>
      <!-- добавить карусель фотографий -->
      <a-col :xs="24" :lg="8">
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
      <a-col :xs="22" :lg="8" class="content">
        <a-row>
          <a-col :xs="22" :lg="16" class="description">
            <span v-html="trip.offer"></span>
          </a-col>

          <a-col
            :xs="24"
            :lg="16"
            class="time"
            style="display: flex; flex-direction: column"
          >
            <div
              >Продолжительность: <b>{{ trip.duration }} дн.</b>
            </div>
            <span style="display: flex; flex-wrap: nowrap"
              >Ближайший выезд:
              <p class="ml-8 mb-4">
                <b>{{ clearData(trip.start) }}</b>
              </p>
            </span>
          </a-col>

          <a-col :xs="22" :lg="16" class="people">
            Количество человек:
            <a-progress
              :percent="(trip.fromAge / 27) * 100"
              :format="(percent) => `20 ч.`"
            >
            </a-progress>
          </a-col>

          <a-col :span="24"
            >Цена:
            <span v-for="(item, index) in trip.cost" :key="index" class="cost">
              <b> {{ item.first }} </b> : {{ item.price }} руб.,
            </span>
          </a-col>

          <a-col :xs="22" :lg="16" class="actions">
            <a-button
              type="primary"
              class="lets_go_btn"
              size="large"
              style="display: flex; justify-content: center"
              @click="buyTripDialog()"
            >
              Купить
            </a-button>
          </a-col>
        </a-row>
        <a-modal v-model:visible="buyDialog" :footer="null">
          <a-row :gutter="[16, 16]">
            <a-col :span="12">
              Фaмилия Имя
              <a-input
                style="width: 100%"
                v-model:value="userInfo.fullname"
                placeholder="Иванов Иван Иванович"
              />
            </a-col>
            <a-col :span="12">
              Телефон
              <a-input
                style="width: 100%"
                v-model:value="userInfo.phone"
                placeholder="79127528874"
              />
            </a-col>
          </a-row>

          <a-row class="mt-16">
            <a-col
              :span="24"
              v-for="(cost, index) of trip.cost"
              :key="index"
              style="display: flex; justify-content: space-between"
            >
              <b>
                {{ cost.first }}
              </b>
              <span> Цена: {{ cost.price }} руб. </span>
              <span>
                Кол-во:
                <a-input-number
                  v-model:value="selectedByUser[index].count"
                  :min="0"
                  placeholder="чел"
                ></a-input-number>
              </span>
            </a-col>
            <a-col :span="24"> <b>Итого: </b> {{ finalCost }} руб. </a-col>
          </a-row>
          <a-row class="mt-16">
            <a-col :span="24">
              <a-button class="mr-4" type="primary" @click="buyTrip(true)">
                оплатить сейчас
              </a-button>
              <a-button @click="buyTrip(false)"> оплатить позже </a-button>
            </a-col>
          </a-row>
        </a-modal>
      </a-col>
      <a-col :xs="22" :lg="16">
        <span v-html="trip.description"></span>
      </a-col>
    </a-row>
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

img {
  width: 100%;
  aspect-ratio: 270/175;
  object-fit: cover;
}

.coster:nth-of-type(1n + 2) {
  display: flex;
}

.ant-row > .ant-col {
  margin-bottom: 8px;
}



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
  top: 45%;
}

.ant-carousel :deep(.custom-slick-arrow:before) {
  display: none;
}

.ant-carousel :deep(.custom-slick-arrow:hover) {
  opacity: 0.8;
}
</style>
