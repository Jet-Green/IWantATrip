<script setup>
import BackButton from "../BackButton.vue";
import { ref, onMounted } from 'vue'
import { useTrips } from '../../stores/trips'
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router'

let route = useRoute()
let tripStore = useTrips()
let trip = ref({})
let isModerated = ref(false)
let isLoading = ref(false)

let moderationMessage = ref('')
let router = useRouter()

async function moderateTrip(_id) {
    if (!isModerated.value) {
        isLoading.value = true
        let res = await tripStore.moderateTrip(_id)
        if (res.status != 400) {
            setTimeout(() => {
                isModerated.value = true
                isLoading.value = false
            }, 500)
        } else {
            isModerated.value = false
        }
    }
}

async function sendModerationMessage() {
    let res = await tripStore.sendModerationMessage(trip.value._id, moderationMessage.value);
    if (res.status == 200) {
        router.push('/cabinet/moderation')
    }
}

onMounted(async () => {
    let { data } = await tripStore.getById(route.query._id)
    trip.value = data
    isModerated.value = trip.value.isModerated
    moderationMessage.value = trip.value.moderationMessage
})

// service methods
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
function getImg(index) {
    return trip.value.images[index];
}
</script>
<template>
    <div style="overflow-x: hidden">
        <BackButton :backRoute="'/cabinet/moderation'" />

        <a-row class="justify-center d-flex">
            <a-col :xs="22" :xl="16">
                <h2 class="ma-0">{{ trip.name }}</h2>
                <a-spin v-if="!trip._id" size="large"></a-spin>
                <a-row v-if="trip._id" :gutter="[12, 12]" class="text justify-center d-flex">
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
                        <p>Автор тура: {{ trip.creatorId }}</p>
                        <p>{{ trip.offer }}</p>
                        <div>
                            Продолжительность: <b>{{ trip.duration }} дн.</b>
                        </div>
                        <div>
                            Ближайший выезд: <b>{{ clearData(trip.start) }}</b>
                        </div>
                        <div>
                            Цена
                            <div v-for="(item, index) in trip.cost" :key="index" class="cost">
                                {{ item.first }} : <b>{{ item.price }} руб.</b>
                            </div>

                        </div>
                    </a-col>

                    <a-col :xs="24">
                        <span v-html="trip.description"></span>
                    </a-col>
                </a-row>
            </a-col>
        </a-row>

        <a-row class="justify-center d-flex" style="margin-top: 30px;">
            <a-col :xs="22" :xl="16">
                <a-button block size="large" :loading="isLoading" :disabled="isModerated" @click="moderateTrip(trip._id)">
                    <span v-if="!isModerated">принять</span>
                    <span v-else class="mdi mdi-check-outline"></span>
                </a-button>
            </a-col>
        </a-row>
        <a-row class="justify-center d-flex" style="margin-top: 30px;">
            <a-col :xs="22" :xl="16">
                <a-textarea placeholder="Ваши комментарии" size="large" v-model:value="moderationMessage">
                </a-textarea>
                <a-row class="justify-center d-flex mt-8">
                    <a-button :disabled="isModerated" size="large" @click="sendModerationMessage">отправить на
                        доработку</a-button>
                </a-row>
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
  