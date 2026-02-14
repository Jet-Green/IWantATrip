<script setup>
import BackButton from "../BackButton.vue";
import { ref, onMounted } from "vue";
import { useTrips } from "../../stores/trips";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

let route = useRoute();
let tripStore = useTrips();
let catalogTrip = ref({});
let isModerated = ref(false);
let isLoading = ref(false);
let moderationMessage = ref("");
let router = useRouter();

async function moderateCatalogTrip(_id) {
  if (!isModerated.value) {
    isLoading.value = true;
    let res = await tripStore.moderateCatalogTrip(_id);

    if (res.status != 400) {
      setTimeout(() => {
        isModerated.value = true;
        isLoading.value = false;
        router.push("/cabinet/catalog-trips-moderation/on-moderation");
      }, 500);
    } else {
      isModerated.value = false;
    }
  }
}

async function sendCatalogModerationMessage() {
  let res = await tripStore.sendCatalogModerationMessage(
    catalogTrip.value._id,
    moderationMessage.value
  );
  if (res.status == 200) {
    router.push("/cabinet/catalog-trips-moderation/on-moderation");
  }
}

onMounted(async () => {
  let { data } = await tripStore.getCatalogTripById(route.query._id);
  catalogTrip.value = data;
  isModerated.value = catalogTrip.value.isModerated;
  moderationMessage.value = catalogTrip.value.moderationMessage;
});

function getImg(index) {
  return catalogTrip.value.images[index];
}

</script>
<template>
  <div style="overflow-x: hidden">
    <BackButton />

    <a-row class="justify-center d-flex">
      <a-col :xs="22" :xl="16">
        <h2 class="ma-0">{{ catalogTrip.name }}</h2>
        <p>
          Автор: {{ catalogTrip.author?.fullinfo?.fullname }} <br />
          Телефон:
          <a :href="'tel:' + catalogTrip.author?.fullinfo?.phone">{{
            catalogTrip.author?.fullinfo?.phone
          }}</a>
        </p>
        <p>
          <i> {{ catalogTrip.offer }}</i>
        </p>
        <a-spin v-if="!catalogTrip._id" size="large"></a-spin>
        <a-row v-if="catalogTrip._id" :gutter="[12, 12]" class="text justify-center d-flex">
          <a-col :xs="24" :md="12">
            <a-carousel arrows dots-class="slick-dots slick-thumb">
              <template #customPaging="props">
                <a>
                  <img :src="getImg(props.i)" />
                </a>
              </template>
              <div v-for="(item, i) in catalogTrip.images" :key="i">
                <img :src="item" alt="" srcset="" />
              </div>
              <template #prevArrow>
                <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
                  <MdiIcon name="chevron-left" size="48px" />
                </div>
              </template>
              <template #nextArrow>
                <div class="custom-slick-arrow" style="right: 10px">
                  <MdiIcon name="chevron-right" size="48px" />
                </div>
              </template>
            </a-carousel>
          </a-col>
          <a-col :xs="24" :md="12" class="pa-8">
            <div v-if="catalogTrip?.startLocation?.name">
              Старт: <b>{{ catalogTrip.startLocation.name }}</b>
            </div>

            <div>
              Продолжительность: <b>{{ catalogTrip.duration }}</b>
            </div>
            <div>
              Ключевые точки: <b>{{ catalogTrip.tripRoute }}</b>
            </div>
          </a-col>

          <a-col :xs="24">
            <span v-html="catalogTrip.description"></span>
          </a-col>
          <a-divider class="ma-0"></a-divider>
          <a-col :xs="24" v-if="catalogTrip.returnConditions" class="mb-16">
            <b>Условия возврата:</b> {{ catalogTrip.returnConditions }}
          </a-col>
        </a-row>
      </a-col>
    </a-row>

    <a-row class="justify-center d-flex">
      <a-col :xs="22" :xl="16" class="justify-center d-flex">
        <a-button :loading="isLoading" :disabled="isModerated" @click="moderateCatalogTrip(catalogTrip._id)" class="lets_go_btn ma-36"
          type="primary">
          <span v-if="!isModerated">принять</span>
          <MdiIcon v-else name="check-outline" />
        </a-button>
      </a-col>
    </a-row>
    <a-row class="justify-center d-flex">
      <a-col :xs="22" :xl="16">
        <a-textarea placeholder="Комментарии" v-model:value="moderationMessage">
        </a-textarea>
        <div class="justify-center d-flex">
          <a-button :disabled="isModerated" @click="sendCatalogModerationMessage" class="btn_light ma-36">отправить на
            доработку</a-button>
        </div>
      </a-col>
    </a-row>
  </div>
</template>
<style lang="scss" scoped>
img {
  width: 100%;
  aspect-ratio: 270/175;
  object-fit: cover;
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
  top: 40%;
}
</style>
