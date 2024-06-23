<script setup>
import { ref, computed, onMounted, getCurrentInstance, watch } from "vue";
import _ from 'lodash'
import tinkoffPlugin from '../plugins/tinkoff'
import TinkoffLogo from "../assets/images/tinkofflogo.svg"

import { useRoute } from "vue-router";
import BackButton from "../components/BackButton.vue";

import { useTrips } from "../stores/trips";
import { useAuth } from "../stores/auth";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import { useLocations } from "../stores/locations";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from 'vee-validate';
import Bus from "../components/Bus.vue";
import { useBus } from "../stores/bus";
import { useShare } from '@vueuse/core'
const API_URL = import.meta.env.VITE_API_URL

const app = getCurrentInstance();
const htmlToPaper = app.appContext.config.globalProperties.$htmlToPaper;

const router = useRouter();

const route = useRoute();

const _id = route.query._id;

const tripStore = useTrips();
const userStore = useAuth();
const locationStore = useLocations();

let bus = ref()
let selected_seats = ref([])
let selected_bus = ref()
let waiting_bus = ref()
let free_seats = ref([])
let show_old_bus = ref(true)
let tripDates = ref([]);
let trip = ref({});
let buyDialog = ref(false);
let buyNow = ref(false)
let selectedDate = ref({});
let selectedStartLocation = ref();
let isInWaitingList = ref(false)
// watch([selected_bus, waiting_bus], async ([selected, waiting]) => {
//     let bus_id = _.isEmpty(selected) ? waiting.transportType.bus_id : selected.transportType.bus_id
//     if (!bus_id) return show_old_bus.value = true
//     show_old_bus.value = false

//     bus.value = await useBus().getById(bus_id)
//     updateSeats()
// })

let link = computed(() => {
  return API_URL + route.fullPath
})
const options = ref({
  url: link.value,
  title: trip.value.name,
  text: trip.value.description,
})

const { isSupported } = useShare(options)

function startShare() {
  const { share } = useShare(options)
  return share().catch(err => {
    console.log(err);
  })
}

async function updateSeats() {
    if (!bus.value) return
    let bought_seats = await tripStore.getBoughtSeats(selectedDate.value._id)
    free_seats.value = bus.value.seats.map(seat => seat.number).filter(seat => !bought_seats.includes(seat) && !bus.value.stuff.includes(seat))
    selected_seats.value = selected_seats.value.filter(seat => free_seats.value.includes(seat))
}

const backRoute = { name: 'TripsPage', hash: `#${_id}` };

const creatorsType = computed(() => {
    return trip.value.creatorForm[1] == "author"
        ? "автор тура"
        : trip.value.creatorForm[1] == "operator"
            ? "туроператор"
            : "турагенство";
});




// let tripsCount = computed(() => {
//     let sum = 0;
//     for (let i = 0; i < trip.value.billsList.length; i++) {
//         if (trip.value.billsList[i]) {
//             for (let j = 0; j < trip.value.billsList[i].cart?.length; j++) {
//                 sum += trip.value.billsList[i].cart[j].count;
//             }
//         }
//     }
//     return sum;
// });

let finalCost = computed(() => {
    // if (!isInWaitingList.value) {
    let sum = 0;
    for (let date of tripDates.value) {
        for (let cost of date.selectedCosts) {
            sum += cost.cost * cost.count;
        }
    }
    return sum;
    // } 
    // else {
    //     let fixedCost = trip.value.transports[0].price
    //     let sum = 0;
    //     for (let date of tripDates.value) {
    //         for (let cost of date.selectedCosts) {
    //             sum += fixedCost * cost.count;
    //         }
    //     }
    //     return sum;
    // }
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
function getLink() {

    return API_URL + route.fullPath
}

let buyTripDialog = () => {

    if (userStore.user.email) {
        if (!selectedDate.value.selected) {
            tripDates.value[0].selected = true;
            selectedDate.value = tripDates.value[0];
        }
        buyDialog.value = true;
    } else {
        router.push("/reg");
    }

};
function selectDate(index) {
    for (let date of tripDates.value) {
        date.selected = false;
    }
    tripDates.value[index].selected = !tripDates.value[index].selected;
    selectedDate.value = tripDates.value[index];
}

function getCustomersCount(billsList) {
    let res = 0;
    for (let bill of billsList) {
        for (let cartItem of bill.cart) {
            res += cartItem.count;
        }
    }
    return res;
}

let getCurrentCustomerNumber = computed(() => {
    return getCustomersCount(selectedDate.value.billsList) +
        selectedDate.value.selectedCosts.reduce((acc, cost) => {
            return acc + cost.count;
        }, 0)
})

async function refreshDates() {
    let response = await tripStore.getFullTripById(_id);
    let tripFromDb = response.data;

    tripDates.value = [];
    trip.value = tripFromDb;
    //сортируем транспорт по возрастанию
    if (trip.value.transports.length) {
        trip.value.transports = _.sortBy(tripFromDb.transports, [function (o) { return o.capacity; }])
    }

    selectedStartLocation.value = trip?.value.locationNames[0].name
    if (trip.value.start >= Date.now()) {
        tripDates.value.push({
            _id: trip.value._id,
            start: trip.value.start,
            end: trip.value.end,
            selected: true,
            selectedCosts: [],
            billsList: trip.value.billsList,
        });

        for (let cost of tripFromDb.cost) {
            tripDates.value[0].selectedCosts.push({
                cost: cost.price,
                count: 0,
                costType: cost.first,
            });
        }
    }

    for (let child of trip.value.children) {
        if (child.start >= Date.now()) {
            let toPush = { _id: child._id._id, start: child.start, end: child.end, billsList: child._id.billsList, selectedCosts: [], selected: false };
            for (let cost of tripFromDb.cost) {
                toPush.selectedCosts.push({
                    cost: cost.price,
                    count: 0,
                    costType: cost.first,
                });
            }
            tripDates.value.push(toPush);
        }
    }
    selectDate(0);
}
const print = async () => {
    await htmlToPaper('printMe');
};

let getStartLocationNames = computed(() => {

    let starts = trip.value.includedLocations.coordinates

    let results = []
    for (let i = 0; i < starts.length; i++) {
        for (let j = 0; j < locationStore.locations.length; j++) {

            if (starts[i][0] == locationStore.locations[j].coordinates[0]) {

                results.push(locationStore.locations[j].shortName)
            }
        }
    }
    return results.join(', ')
})

async function buyTrip() {
    if (userStore.user.email) {
        // цены нужно поменять
        // if (isInWaitingList.value) {
        //     for (let c of selectedDate.value.selectedCosts) {
        //         c.cost = trip.value.transports[0].price
        //         c.costType = 'в листе ожидания'
        //     }
        // }
        if (getCurrentCustomerNumber.value > trip.value.maxPeople) {
            message.config({ duration: 3, top: "90vh" });
            message.success({ content: `Осталось всего ${trip.value.maxPeople - tripStat.value.amount} мест` });
            return
        }
        if (trip.value.transports.length && people_amount.value !== selected_seats.value.length) {
            message.config({ duration: 3, top: "90vh" });
            message.error({ content: `Выберите места в количестве ${people_amount.value} шт.` });
            return
        }

        if (selectedDate.value.selected && finalCost.value > 0) {
            let bill = {
                isWaitingList: isInWaitingList.value,
                date: Date.now(),
                isBoughtNow: buyNow.value,
                cart: selectedDate.value.selectedCosts,
                tripId: selectedDate.value._id,
                selectedStartLocation: selectedStartLocation.value,
                seats: selected_seats.value,
                userInfo: {
                    _id: userStore.user._id,
                    fullname: userStore.user.fullinfo.fullname,
                    phone: userStore.user.fullinfo.phone,
                },
                touristsList: [{
                    _id: userStore.user._id,
                    fullname: userStore.user.fullinfo.fullname,
                    phone: userStore.user.fullinfo.phone,
                }]
            };
            selected_seats.value = []
            updateSeats()
            let tinkoffUrl = ''
            if (buyNow.value) {
                const orderId = Date.now().toString()
                let { data, token, success } = await tinkoffPlugin.initPayment(orderId, bill.cart, userStore.user.email, trip.value.tinkoffContract, trip.value.name)
                if (!success) {
                    message.config({ duration: 3, top: "90vh" });
                    message.error({ content: "Ошибка при оплате" });
                    return
                }
                bill.tinkoff = {
                    orderId: data.OrderId,
                    amount: data.Amount,
                    token,
                    paymentId: data.PaymentId
                }
                tinkoffUrl = data.PaymentURL
            }

            for (let i = 0; i < bill.cart.length; i++) {
                if (bill.cart[i].count == 0) {
                    bill.cart.splice(i, 1);
                }
            }

            if (bill.cart.length != 0) {
                userStore
                    .buyTrip(selectedDate.value._id, bill)
                    .then(async (response) => {
                        if (response.status == 200) {
                            message.config({ duration: 3, top: "90vh" });
                            message.success({ content: "Тур заказан!" });
                            await refreshDates();
                            buyDialog.value = false;
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
            if (tinkoffUrl) {
                router.push({ name: 'TinkoffPayment', query: { url: tinkoffUrl } })
            }
        } else {
            message.config({ duration: 3, top: "90vh" });
            message.error({ content: "Заполните количество" });
        }
    } else {
        message.config({ duration: 3, top: "90vh" });
        message.success({ content: "Нужен телефон" });
    }
}


function detectIsWaiting(isWaiting) {
    isInWaitingList.value = isWaiting
}

const phoneRegex = /^((8|7|\+7|\+8)[\- ]?)?[\d\- ]{5,10}$/gm
const formSchema = yup.object({
    fullname: yup
        .string("неверный формат")
        .required("заполните поле")
        .min(5, "минимум 5 символов"),
    phone: yup
        .string().matches(phoneRegex, "введите № телефона"),


});



let isNoPlaces = computed(() => {
    if (selectedDate.value.billsList) {
        return (
            trip.value.maxPeople -
            getCustomersCount(selectedDate.value.billsList) -
            selectedDate.value.selectedCosts.reduce((acc, cost) => {
                return acc + cost.count;
            }, 0) <
            0
        );
    }
    return false;
});

let people_amount = computed(() => selectedDate.value.selectedCosts.reduce((acc, cost) => acc + cost.count, 0))

async function updateBus() {
    let transports = trip.value.transports.filter(bus => bus.capacity >= getCurrentCustomerNumber.value)
    transports = _.sortBy(transports, [o => o.capacity])
    let transport = transports[0]

    let bus_id = transport?.transportType.bus_id
    if (!bus_id) return show_old_bus.value = true
    show_old_bus.value = false

    bus.value = await useBus().getById(bus_id)
    updateSeats()
}

onMounted(async () => {

    await refreshDates();
    watch(selectedDate, updateBus, { immediate: true })
    watch(people_amount, (newValue, oldValue) => {
        updateBus()
        updateSeats()
        if (getCurrentCustomerNumber.value > trip.value.maxPeople) {
            message.config({ duration: 3, top: "90vh" });
            message.success({ content: `Осталось всего ${trip.value.maxPeople - getCustomersCount(selectedDate.value.billsList)} мест` });
        }
        selected_seats.value = []
    })
});
</script>
<template>
    <div style="overflow-x: hidden">
        <BackButton :backRoute="backRoute" />
        <a-row class="justify-center d-flex">
            <a-col :xs="22" :xl="16" class="mb-32">
                <h2 class="ma-0">{{ trip.name }}</h2>

                <p><i> {{ trip.offer }}</i> </p>

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



                        <div style="float: right;">
                            <span style="opacity: 0.7; cursor: pointer;" class="mdi mdi-24px mdi-printer ma-8 "
                                @click="print()"></span>

                          
                             
                                    <span style="opacity: 0.7;"
                                        class="mdi mdi-24px mdi-share-variant-outline ma-8" @click="startShare()"></span>
                        
                        </div>

                        <div>
                            Старт: <b> {{ getStartLocationNames }}</b>
                        </div>

                        <div>
                            Продолжительность: <b>{{ trip.duration }}</b>
                        </div>
                        <div>
                            Ключевые точки: <b>{{ trip.tripRoute }}</b>
                        </div>
                        <div class="d-flex">
                            Дата начала тура: &nbsp
                            <div>
                                <a-checkable-tag class="pretty-tag" v-for="(date, index) of tripDates"
                                    :checked="date.selected" @change="selectDate(index)">
                                    <b>
                                        {{ clearData(date.start) }} -
                                        {{ clearData(date.end) }}
                                    </b>
                                    ({{ getCustomersCount(date.billsList) + "/" + trip.maxPeople }} чел.)
                                </a-checkable-tag>
                            </div>
                        </div>
                        <div v-if="tripDates.length < 2">
                            <div>Количество человек:</div>
                            <div style="width: 50%">
                                <b>
                                    <a-progress
                                        :percent="(getCustomersCount(selectedDate.billsList) / trip.maxPeople) * 100"
                                        :format="() => `${getCustomersCount(selectedDate.billsList)}/${trip.maxPeople} чел`">
                                    </a-progress></b>
                            </div>
                        </div>

                        <div class="d-flex">
                            Цена:&nbsp
                            <div>
                                <div v-for="(item, index) in trip.cost" :key="index" class="cost">
                                    {{ item.first }}: <b>{{ item.price }} руб.</b>
                                </div>
                            </div>


                        </div>
                        <div v-if="trip.bonuses.length" class="d-flex">
                            Бонусы:&nbsp
                            <div>
                                <div v-for="(item, index) in trip.bonuses" :key="index">
                                    <i> {{ item.type }} <b>{{ item.bonus }}</b> </i>
                                </div>
                            </div>

                        </div>
                        <!-- <div v-if="trip.transports?.length">
                            <WaitingList :tripsCount="getCustomersCount(selectedDate.billsList)"
                                :transport="trip.transports ?? []" />
                        </div> -->
                        <div class="d-flex justify-center ma-8" v-if="trip.maxPeople -
             getCustomersCount(selectedDate.billsList) -
            selectedDate.selectedCosts.reduce((acc, cost) => {
                return acc + cost.count;
            }, 0) >
            0
            ">
                            <a-button type="primary" class="lets_go_btn" style="display: flex; justify-content: center"
                                @click="buyTripDialog()">
                                Купить
                            </a-button>
                        </div>

                        <div>
                            <b v-if="trip.maxPeople -
            getCustomersCount(selectedDate.billsList) -
            selectedDate.selectedCosts.reduce((acc, cost) => {
                return acc + cost.count;
            }, 0) <=
            0
            ">
                                мест больше нет
                            </b>
                        </div>

                    </a-col>

                    <a-col :xs="24">
                        <span v-html="trip.description"></span>
                    </a-col>
                    <a-divider class="ma-0"></a-divider>
                    <a-col :xs="24" v-if="trip.returnConditions" class="mb-16">
                        <b>Условия возврата:</b> {{ trip.returnConditions }}
                    </a-col>

                    <div id="printMe" style="display: none">
                        <h2 class="ma-0">{{ trip.name }}</h2>
                        <p><i> {{ trip.offer }}</i></p>
                        <div>
                            Старт: <b>{{ trip.startLocation.name }}</b>
                        </div>

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
                                    :checked="date.selected" @change="selectDate(index)">
                                    <b>
                                        {{ clearData(date.start) }} -
                                        {{ clearData(date.end) }}
                                    </b>
                                    ({{ getCustomersCount(date.billsList) + "/" + trip.maxPeople }} чел.)
                                </a-checkable-tag>
                            </div>
                        </div>
                        <div>
                            Цена:
                            <div v-for="(item, index) in trip.cost" :key="index" class="cost">
                                {{ item.first }} : <b>{{ item.price }} руб.</b>
                            </div>
                        </div>
                        <div v-if="trip.bonuses.length">
                            Бонусы:
                            <div v-for="(item, index) in trip.bonuses" :key="index">
                                <i>{{ item.type }}: {{ item.bonus }}</i>
                            </div>
                        </div>
                        <span v-html="trip.description"></span>

                    </div>

                </a-row>
            </a-col>
        </a-row>
        <a-modal v-model:open="buyDialog" :footer="null" @cancel="refreshDates(trip)">
            <Form :validation-schema="formSchema" v-slot="{ meta }" @submit="buyTrip" class="mt-16">
                <a-row :gutter="[4, 8]">

                    <a-col :span="24" :md="12">
                        <Field name="fullname" v-slot="{ value, handleChange }"
                            v-model="userStore.user.fullinfo.fullname">
                            <a-input @change="handleChange" :value="value" placeholder="Иванов Иван Иванович"></a-input>
                        </Field>

                        <Transition name="fade">
                            <ErrorMessage name="fullname" class="error-message" />
                        </Transition>
                    </a-col>
                    <a-col :span="24" :md="12">
                        <Field name="phone" v-slot="{ value, handleChange }" v-model="userStore.user.fullinfo.phone">
                            <a-input @change="handleChange" :value="value" placeholder="791275288874" size="medium"
                                :controls="false" style="width:100%"></a-input>
                        </Field>

                        <Transition name="fade">
                            <ErrorMessage name="phone" class="error-message" />
                        </Transition>
                    </a-col>
                    <a-col :span="24" v-if="trip.locationNames.length > 1">
                        <div class="d-flex direction-column">
                            Место посадки
                            <a-select placeholder="г.Глазов" v-model:value="selectedStartLocation">
                                <a-select-option v-for="item in trip.locationNames"
                                    :value="item.name"></a-select-option>
                            </a-select>
                        </div>
                    </a-col>
                    <a-col :span="24">
                        <div>Даты: <b>
                                {{ clearData(selectedDate.start) + " - " + clearData(selectedDate.end) }}
                            </b>
                        </div>

                        <div>
                            Туристы:
                            <b :style="isNoPlaces ? 'color: red' : ''">
                                {{
            getCustomersCount(selectedDate.billsList) +
            selectedDate.selectedCosts.reduce((acc, cost) => {
                return acc + cost.count;
            }, 0) +
            "/" +
            trip.maxPeople
        }}
                                чел.
                            </b>
                        </div>
                    </a-col>
                    <a-col :span="24">
                        <div>Цены:</div>
                        <div v-if="isInWaitingList && trip?.transports?.length" style="color: #ff6600">
                            Вы в листе ожидания
                        </div>
                        <div class="d-flex space-between align-center" v-for="cost of selectedDate.selectedCosts">

                            <div>
                                {{ cost.costType }}
                            </div>
                            <!-- <div v-if="isInWaitingList">
                                {{ trip.transports[0].price }} руб.
                            </div>
                            <div v-else>{{ cost.cost }} руб.</div> -->
                            <div>{{ cost.cost }} руб.</div>
                            <div class="d-flex direction-column">
                                <span style="font-size: 8px">кол-во</span>
                                <a-input-number v-model:value="cost.count" :min="0"
                                    :max="trip.maxPeople - getCustomersCount(selectedDate.billsList)"
                                    placeholder="чел"></a-input-number>
                            </div>
                        </div>
                    </a-col>
                    <a-col :span="24" class="d-flex justify-end">
                        <b>Итого: {{ finalCost }} руб.</b>
                    </a-col>

                    <div v-if="trip.partner">
                        <h4 class="warning">Наличие мест требует уточнения!</h4>
                    </div>

                    <!-- <a-col :span="24">
                        <WaitingList v-if="people_amount > 0 || show_old_bus" v-model:selected="selected_bus"
                            v-model:waiting="waiting_bus" @isUserWaiting="detectIsWaiting"
                            :selected_seats="selected_seats" :show_old_bus="trip.transports?.length && show_old_bus"
                            :tripsCount="getCurrentCustomerNumber" :transport="trip.transports ?? []" choise />
                    </a-col> -->

                    <a-col v-if="bus && people_amount > 0" :span="24" class="mb-8">
                        <div>Выберите места</div>
                        <div style="font-size:0.8em; opacity: 0.8;">{{ bus.name }}</div>
                        <Bus @select="updateSeats" v-model:selected_seats="selected_seats" :free_seats="free_seats"
                            :max_count="people_amount" :bus="bus" style="width: 150px;" />
                    </a-col>

                    <a-col :span="24">
                        <div class="d-flex space-around">
                            <a-button html-type="submit" class="btn" @click="buyNow = false" :disabled="isNoPlaces">
                                Заказать
                            </a-button>
                            <div class="buy-btn" v-if="!trip.partner">
                                <div>
                                    <a-button html-type="submit" :disabled="isNoPlaces" @click="buyNow = true"
                                        type="primary" class="lets_go_btn">
                                        оплатить
                                    </a-button>
                                </div>
                                <div class="d-flex justify-center">
                                    <img :src="TinkoffLogo" class="tinkoff-logo">
                                </div>
                            </div>
                        </div>
                    </a-col>
                </a-row>
            </Form>
        </a-modal>
    </div>
</template>
<style lang="scss" scoped>
.pretty-tag {
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

.mdi-printer:hover {
    color: #ff6600;
}

.warning {
    color: red;
    font-style: italic;
}

.buy-btn {
    display: flex;
    flex-direction: column;

    .tinkoff-logo {
        height: 20px;
        width: 90px;
    }

    img {
        -moz-user-select: -moz-none;
        -khtml-user-select: none;
        -webkit-user-select: none;
        -o-user-select: none;
        user-select: none;
    }

}

.btn {
    border-radius: 15px;
}
</style>
