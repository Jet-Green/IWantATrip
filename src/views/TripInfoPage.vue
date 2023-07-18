<script setup>
import { ref, computed, onMounted } from "vue";

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

let tripDates = ref([])
let trip = ref({});
let buyDialog = ref(false);

let selectedDate = ref({})

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

let finalCost = computed(() => {
    let sum = 0;
    for (let date of tripDates.value) {
        for (let cost of date.selectedCosts) {
            sum += cost.cost * cost.count
        }
    }
    return sum;
})

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

let buyTripDialog = () => {
    if (userStore.user) {
        if (!selectedDate.value.selected) {
            tripDates.value[0].selected = true
            selectedDate.value = tripDates.value[0]
        }
        buyDialog.value = true;
    } else {
        router.push("/reg");
    }
};

async function buyTrip(isBoughtNow) {
    if (userStore.user.fullinfo.phone) {
        if (selectedDate.value.selected) {
            let bill = {
                isBoughtNow,
                cart: selectedDate.value.selectedCosts,
                tripId: selectedDate.value._id,
                userInfo: {
                    _id: userStore.user._id,
                    fullname: userStore.user.fullinfo.fullname,
                    phone: userStore.user.fullinfo.phone,
                }
            };

            for (let i = 0; i < bill.cart.length; i++) {
                if (bill.cart[i].count == 0) {
                    bill.cart.splice(i, 1);
                }
            }
            if (bill.cart.length != 0) {
                await userStore
                    .buyTrip(selectedDate.value._id, bill)
                    .then(() => {
                        message.config({ duration: 3, top: "90vh" });
                        message.success({ content: "Тур заказан!" });
                        buyDialog.value = false;
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
    } else {
        message.config({ duration: 3, top: "90vh" });
        message.success({ content: "Нужен телефон" });
    }
}

function selectDate(index) {
    for (let date of tripDates.value) {
        date.selected = false
    }
    tripDates.value[index].selected = !tripDates.value[index].selected
    selectedDate.value = tripDates.value[index]
}

onMounted(() => {
    tripStore
        .getFullTripById(_id)
        .then((response) => {
            trip.value = response.data;
            tripDates.value.push({ _id: trip.value._id, start: trip.value.start, end: trip.value.end, selected: false, selectedCosts: [] })
            for (let cost of response.data.cost) {
                tripDates.value[0].selectedCosts.push({
                    cost: cost.price,
                    count: 0,
                    costType: cost.first,
                })
            }

            for (let child of trip.value.children) {
                let toPush = { ...child, selectedCosts: [], selected: false }

                for (let cost of response.data.cost) {
                    toPush.selectedCosts.push({
                        cost: cost.price,
                        count: 0,
                        costType: cost.first,
                    })
                }
                tripDates.value.push(toPush)
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
                        <i> {{ trip.offer }}</i>
                        <a-divider style="border-color: #245159" dashed />
                        <div>Старт: <b>{{ trip.startLocation.name }}</b> </div>

                        <div>
                            Продолжительность: <b>{{ trip.duration }}</b>
                        </div>
                        <div>
                            Ключевые точки: <b>{{ trip.tripRoute }}</b>
                        </div>
                        <div>
                            Даты:
                            <div>
                                <a-checkable-tag class="pretty-tag" v-for="(date, index) of tripDates"
                                    :checked="date.selected" @change="selectDate(index)">{{
                                        clearData(date.start) }} -
                                    {{
                                        clearData(date.end) }}</a-checkable-tag>
                            </div>
                        </div>
                        <div v-if="tripDates.length < 2">
                            <div>Количество человек:</div>
                            <div style="width: 50%">
                                <b> <a-progress :percent="(tripsCount / trip.maxPeople) * 100"
                                        :format="() => `${tripsCount}/${trip.maxPeople} чел`">
                                    </a-progress></b>
                            </div>
                        </div>
                        <div>
                            Цена:
                            <div v-for="(item, index) in trip.cost" :key="index" class="cost">
                                {{ item.first }} : <b>{{ item.price }} руб.</b>
                            </div>
                        </div>
                        <div>
                            Бонусы:
                            <div v-for="(item, index) in trip.bonuses" :key="index">
                                <i>{{ item.type }}: {{ item.bonus }}</i>
                            </div>
                        </div>
                        <div class="d-flex justify-center ma-8">
                            <a-button v-if="tripsCount != trip.maxPeople" type="primary" class="lets_go_btn"
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
                    <a-input style="width: 100%" v-model:value="userStore.user.fullinfo.fullname"
                        placeholder="Иванов Иван Иванович" />
                </a-col>
                <a-col :span="24" :md="12">
                    Телефон
                    <a-input style="width: 100%" v-model:value="userStore.user.fullinfo.phone" placeholder="79127528874" />
                </a-col>

                <a-col :span="24">
                    <div>Цены</div>
                    <b>
                        {{ clearData(selectedDate.start) + ' - ' + clearData(selectedDate.end) }}
                    </b>

                    <div class="d-flex space-between align-center" v-for="cost of selectedDate.selectedCosts">
                        <div>{{ cost.costType }}</div>
                        <div> {{ cost.cost }} руб.</div>

                        <div class="d-flex direction-column">
                            <span style="font-size: 8px">кол-во</span>
                            <a-input-number v-model:value="cost.count" :min="0" :max="trip.maxPeople - tripsCount"
                                placeholder="чел"></a-input-number>
                        </div>
                    </div>
                </a-col>
                <a-col :span="24" class="d-flex justify-end">
                    <b>Итого: {{ finalCost }} руб.</b>
                </a-col>

                <a-col :span="24">

                    <div class="d-flex space-around">
                        <!-- <a-button type="primary" @click="buyTrip(true)"> сейчас </a-button> -->
                        <a-button @click="buyTrip(false)" type="primary" class="lets_go_btn"> Заказать </a-button>
                    </div>
                </a-col>
            </a-row>
        </a-modal>
    </div>
</template>
<style lang="scss" scoped>
.pretty-tag {
    font-weight: 700;
    border-radius: 12px;
    font-size: 14px;
    padding: 4px 6px 4px 6px;
    user-select: none;
    cursor: pointer;
}

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
