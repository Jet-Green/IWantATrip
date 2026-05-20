<script setup>
import { ref, computed, onMounted, getCurrentInstance, watch, reactive } from "vue";
import _ from 'lodash'
import tinkoffPlugin from '../plugins/tinkoff'
import TinkoffLogo from "../assets/images/tinkofflogo.svg"
import PlaceCard from "../components/cards/PlaceCard.vue";

import { useRoute, useRouter } from "vue-router";

import BackButton from "../components/BackButton.vue";
import datePlugin from '../plugins/dates'
import { useTrips } from "../stores/trips";
import { useAuth } from "../stores/auth";
import { message } from "ant-design-vue";
import { useLocations } from "../stores/locations";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from 'vee-validate';
import Bus from "../components/Bus.vue";
import { useBus } from "../stores/bus";
import { useShare } from '@vueuse/core'
const API_URL = import.meta.env.VITE_API_URL
import { useHead } from "@unhead/vue";


const app = getCurrentInstance();
const htmlToPaper = app.appContext.config.globalProperties.$htmlToPaper;

const router = useRouter();

const route = useRoute();

const _id = route.query._id;
const isHistory = route.query.history;
const tripStore = useTrips();
const userStore = useAuth();
const locationStore = useLocations();

let bus = ref()
let selected_seats = ref([])
let free_seats = ref([])
let show_old_bus = ref(true)
let tripDates = ref([]);
let trip = ref({});
let buyDialog = ref(false);
let buyNow = ref(false)
let selectedDate = ref({});
let selectedStartLocation = ref();
let isInWaitingList = ref(false)
let touristsList = ref([]);
let activeKey = ref(null)
let additionalServices = ref([])
let show = ref(false)



let link = computed(() => {
    return API_URL + route.fullPath
})

function goToPlacePage(_id) {

    router.push(`/place?_id=${_id}`);
}
const options = ref({
    url: link.value,
    title: trip.value.name,
    text: trip.value.description,
})

const { isSupported } = useShare(options)

async function startShare() {
    const { share } = useShare(options)
    try {
        return await share();
    } catch (err) {
        console.log(err);
    }
}

async function updateSeats() {
    if (!bus.value) return
    let bought_seats = await tripStore.getBoughtSeats(selectedDate.value._id)
    free_seats.value = bus.value.seats.map(seat => seat.number).filter(seat => !bought_seats.includes(seat) && !bus.value.stuff.includes(seat))
    selected_seats.value = selected_seats.value.filter(seat => free_seats.value.includes(seat))
}

async function changeTouristsField() {
    let tourists = people_amount.value - touristsList.value.length

    // if (people_amount.value == 1) return
    // Check if tourists is positive or negative
    if (tourists > 0) {

        // If positive, add objects to the array
        for (let i = 0; i < tourists; i++) {

            touristsList.value.push({
                fullname: "",
                phone: "",
            });

        }
    } else if (tourists < 0) {
        // If negative, remove objects from the end of the array
        for (let i = 0; i < Math.abs(tourists); i++) {
            if (touristsList.value.length > 0) {
                touristsList.value.pop();
            }
        }
    }
    // If touristsNumber is 0, do nothing
}


let backRoute = { name: 'TripsPage', hash: `#${_id}` };


const creatorsType = computed(() => {
    return trip.value.creatorForm[1] == "author"
        ? "автор тура"
        : trip.value.creatorForm[1] == "operator"
            ? "туроператор"
            : "турагенство";
});




let finalCost = computed(() => {
    // if (!isInWaitingList.value) {
    let sum = 0;
    for (let date of tripDates.value) {
        for (let cost of date.selectedCosts) {
            sum += cost.cost * cost.count;
        }
    }
    for (let service of additionalServices.value) {
        sum += service.price * service.count
    }
    return sum;

});

const clearData = (dateNumber) => {
    dateNumber = dateNumber - trip.value?.timezoneOffset
    const date = new Date(dateNumber);
    if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("ru-RU", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            timeZone: 'UTC' // Используем UTC для гарантии, что время будет в формате UTC
        });
    }
    return '';
};

function getImg(index) {
    return trip.value.images[index];
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

const customersByCostType = computed(() => {
    const result = {};
    const bills = selectedDate.value?.billsList ?? [];
    for (const bill of bills) {
        const cart = bill?.cart ?? [];
        for (const item of cart) {
            const type = item?.costType ?? 'Без типа';
            const count = Number(item?.count) || 0;
            result[type] = (result[type] || 0) + count;
        }
    }
    return result;
});

const firstAvailableCost = computed(() => {
    if (!trip.value?.cost?.length) return null
    return trip.value.cost.find(item => {
        const bought = customersByCostType.value[item.first] || 0
        return item.limit - bought > 0
    }) || null
})

const loyaltyCostDisplay = computed(() => {
    return firstAvailableCost.value || (trip.value?.cost?.length ? trip.value.cost[0] : null)
})

let getCurrentCustomerNumber = computed(() => {
    return getCustomersCount(selectedDate.value.billsList) +
        selectedDate.value.selectedCosts.reduce((acc, cost) => {
            return acc + cost.count;
        }, 0)
})

const firstPaymentPercentage = computed(() => {
    if (!trip.value?.loyalty?.enabled || trip.value?.loyalty?.type !== 'discount') {
        return 1;
    }

    if (trip.value.loyalty.discount?.isFixed) {
        return 1;
    }

    const paymentOrder = trip.value.loyalty.discount?.paymentOrder || "50/50";
    const [firstPart] = paymentOrder.split('/').map(Number);
    return firstPart / 100;
})

const loyaltyDiscountTotal = computed(() => {
    if (!trip.value?.loyalty?.enabled || trip.value?.loyalty?.type !== 'discount') return 0
    if (!trip.value.loyalty.discount?.isFixed) return 0
    const discountPerPerson = trip.value.loyalty.discount?.fixedDiscountPerPerson || 0
    if (discountPerPerson <= 0) return 0
    const totalParticipants = selectedDate.value?.selectedCosts?.reduce((sum, c) => sum + (c.count || 0), 0) || 0
    return discountPerPerson * totalParticipants
})

const isMaxDiscount = computed(() => {
    if (!trip.value?.loyalty?.enabled || trip.value?.loyalty?.type !== 'discount') return false
    const current = trip.value.loyalty.discount?.currentDiscountPerPerson || 0
    const max = trip.value.loyalty.discount?.maxDiscountPerPerson || 0
    return max > 0 && current >= max
})

const discountedFinalCost = computed(() => {
    return Math.max(0, finalCost.value - loyaltyDiscountTotal.value)
})

const firstPaymentCost = computed(() => {
    return Math.round(discountedFinalCost.value * firstPaymentPercentage.value);
})

const baseDiscountPerPerson = computed(() => {
    if (!trip.value?.loyalty?.enabled || trip.value?.loyalty?.type !== 'discount') return 0
    const percent = trip.value.loyalty.discount?.baseDiscountPercent || 0
    if (!loyaltyCostDisplay.value) return 0
    return Math.round(loyaltyCostDisplay.value.price * percent / 100)
})

const activeFreeServiceLevel = computed(() => {
    if (!trip.value?.loyalty?.enabled || trip.value?.loyalty?.type !== 'free_services') return null
    const levels = trip.value.loyalty.freeServices?.levels || []
    const currentCount = getCustomersCount(selectedDate.value?.billsList || [])
    let active = null
    for (const level of levels) {
        if (currentCount >= Number(level.peopleCount || 0)) {
            active = level
        }
    }
    return active
})

async function refreshDates() {
    let response = await tripStore.getTripById(_id);
    let tripFromDb = response.data;
    additionalServices.value = []
    for (let service of tripFromDb.additionalServices) {
        additionalServices.value.push({ ...service, count: 0 })
    }

    tripDates.value = [];
    trip.value = tripFromDb;
    //сортируем транспорт по возрастанию
    if (trip.value.transports.length) {
        trip.value.transports = _.sortBy(tripFromDb.transports, [function (o) { return o.capacity; }])
    }

    selectedStartLocation.value = trip?.value?.locationNames ? trip?.value?.locationNames[0]?.name : null
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
    if (trip.value.includedLocations) {
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
    }
    else { return "" }
})

let getSelectedUsersCount = computed(() => {
    let result = 0
    for (let date of tripDates.value) {
        for (let cost of date.selectedCosts) {
            result += cost.count
        }
    }
    return result
})

useHead(computed(() => ({
    title: trip.value?.name,
    meta: [
        {
            name: "description",
            content: trip.value?.offer,
        },
        {
            property: "og:title",
            content: trip.value?.name,
        },
        {
            name: "og:description",
            content: trip.value?.offer,
        },
        {
            name: "og:image",
            content: trip?.value?.images,
        },

        {
            name: "og:url",
            content: `${API_URL}/trip?_id=${trip.value?._id}`,
        },
    ],
    link: [{ rel: "canonical", href: `${API_URL}/trip?_id=${trip.value?._id}` }],
})));


async function buyTrip() {
    if (userStore.user.email) {
        // цены нужно поменять
        // if (isInWaitingList.value) {
        //     for (let c of selectedDate.value.selectedCosts) {
        //         c.cost = trip.value.transports[0].price
        //         c.costType = 'в листе ожидания'
        //     }
        // }



        if (!isTouristsListInfo.value.result) {
            message.config({ duration: 3, top: "90vh" });
            message.success({ content: `${isTouristsListInfo.value.message}` });
            return
        }
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
                additionalServices: additionalServices.value.filter((el) => el.count > 0),
                tripId: selectedDate.value._id,
                selectedStartLocation: selectedStartLocation.value,
                seats: selected_seats.value,
                touristsList: touristsList.value,
                userInfo: {
                    _id: userStore.user._id,
                    fullname: touristsList.value[0].fullname,
                    phone: touristsList.value[0].phone,
                },
            };
            if (bill.userInfo.phone == "") {
                bill.userInfo.fullname = touristsList.value[0].fullname
                bill.userInfo.phone = touristsList.value[0].phone
            }
            selected_seats.value = []
            updateSeats()
            let tinkoffUrl = ''
            let addServices = bill.additionalServices?.length ? bill.additionalServices : []

            if (buyNow.value) {
                const orderId = Date.now().toString()

                let paymentCart = bill.cart;

                const isLoyaltyDiscount = trip.value?.loyalty?.enabled && trip.value?.loyalty?.type === 'discount';

                if (isLoyaltyDiscount && loyaltyDiscountTotal.value > 0 && finalCost.value > 0) {
                    // Скидка зафиксирована — один платёж со скидкой
                    const ratio = discountedFinalCost.value / finalCost.value;
                    paymentCart = bill.cart.map(item => ({
                        ...item,
                        cost: Math.round(item.cost * ratio * 100) / 100
                    }));
                    addServices = addServices.map(service => ({
                        ...service,
                        price: Math.round(service.price * ratio * 100) / 100
                    }));
                } else if (isLoyaltyDiscount && firstPaymentPercentage.value < 1) {
                    // Скидка не зафиксирована — первый платёж (часть суммы)
                    paymentCart = bill.cart.map(item => ({
                        ...item,
                        cost: Math.round(item.cost * firstPaymentPercentage.value * 100) / 100
                    }));
                }

                let { data, token, success } = await tinkoffPlugin.initPayment(orderId, paymentCart, userStore.user.email, trip.value.tinkoffContract, trip.value.name, addServices)
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
                // window.open(tinkoffUrl, '_blank');
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


const phoneRegex = /^(?:\d{5}|\d{10}|\d{11})$/

const formSchema = yup.object({
    fullname: yup
        .string()
        .required("заполните поле"),
    phone: yup
        .string().matches(phoneRegex, "введите № телефона"),


});


let isTouristsListInfo = computed(() => {

    for (let tourist of touristsList.value) {
        const cleaned = tourist.phone.replace(/\D/g, '');

        if (
            !phoneRegex.test(cleaned)
        ) {
            return { result: false, message: "Проверьте телефоны" };
        }
        if (
            !tourist.fullname
        ) {
            return { result: false, message: "Заполните имена туристов" };
        }
    }
    return { result: true };

})

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

    watch(people_amount, (newValue, oldValue) => {
        updateBus()
        updateSeats()
        changeTouristsField()
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
        <BackButton :backRoute="backRoute" v-if="!isHistory" />
        <BackButton v-if="isHistory" />
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

                            <span style="opacity: 0.7;" class="mdi mdi-24px mdi-share-variant-outline ma-8"
                                @click="startShare()"></span>

                        </div>

                        <div v-if="getStartLocationNames != ''">
                            Старт: <b> {{ getStartLocationNames }}</b>
                        </div>
                        <div v-if="trip.tripRegion != ''">
                            Куда: <b> {{ trip.tripRegion }}</b>
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
                                <a-checkable-tag class="pretty-tag" v-for="(date, index) of tripDates" :key="index"
                                    :checked="date.selected" @change="selectDate(index)">
                                    <b>
                                        {{ clearData(date.start) }} -
                                        {{ clearData(date.end) }}
                                    </b>
                                    ({{ getCustomersCount(date.billsList) + " из " + trip.maxPeople }} чел.)

                                </a-checkable-tag>
                            </div>
                        </div>
                        <div v-if="tripDates.length < 2 && !trip.loyalty?.enabled">
                            <div>Количество человек:</div>


                            <div style="width: 50%" class="d-flex align-center">
                                <b style="flex: 1;" class="mr-8">
                                    <a-progress
                                        :percent="(getCustomersCount(selectedDate.billsList) / trip.maxPeople) * 100"
                                        :show-info="false"
                                    />
                                </b>
                                <span style="font-size: 14px; font-weight: bold;" class="mr-8">
                                  {{`${getCustomersCount(selectedDate.billsList)} из ${trip.maxPeople} чел`}}
                                </span>
                            </div>
                        </div>

                        <div class="d-flex">
                            Цена:&nbsp
                            <div style="font-size: 0.9em;">
                                <div v-for="(item, index) in trip.cost" :key="index" class="cost">

                                    <div v-if="(item.limit ?? trip.maxPeople) - (customersByCostType[item.first] || 0) !== 0">

                                        {{ item.first }}: <b>{{ item.price }} руб.</b>

                                        <span>
                                            <span>
                                              | мест -
                                              {{
                                                (item.limit ?? trip.maxPeople) -
                                                (customersByCostType[item.first] || 0)
                                              }}
                                            </span>
                                        </span>
                                    </div>
                                </div>

                            </div>


                        </div>
                        <div v-if="trip.bonuses.length" class="d-flex">
                            Бонусы:&nbsp
                            <div style="font-size: 0.9em;">
                                <div v-for="(item, index) in trip.bonuses" :key="index">
                                    <i> {{ item.type }} <b>{{ item.bonus }}</b> </i>
                                </div>
                            </div>

                        </div>

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

                        <div v-if="trip.loyalty?.enabled && trip.loyalty?.type === 'discount'" class="loyalty-discount-card">
                            <div v-if="trip.loyalty.discount?.baseDiscountPercent" class="loyalty-discount-card__row">
                                <span class="loyalty-discount-card__label">Базовая скидка</span>
                                <span class="loyalty-discount-card__value">{{ trip.loyalty.discount.baseDiscountPercent }}%<span v-if="loyaltyCostDisplay" class="loyalty-discount-card__hint"> ({{ Math.round(loyaltyCostDisplay.price * trip.loyalty.discount.baseDiscountPercent / 100) }}₽)</span></span>
                            </div>
                            <div v-if="tripDates.length < 2" class="loyalty-discount-card__row" style="flex-direction: column; align-items: stretch; gap: 4px;">
                                <span class="loyalty-discount-card__label">Количество человек в туре</span>
                                <div class="d-flex space-between align-center" style="width: 100%;">
                                    <span class="loyalty-discount-card__current">{{ getCustomersCount(selectedDate.billsList) }}</span>
                                    <span class="loyalty-discount-card__max">максимум {{ trip.maxPeople }}</span>
                                </div>
                                <a-progress
                                    :percent="(getCustomersCount(selectedDate.billsList) / trip.maxPeople) * 100"
                                    :show-info="false"
                                    strokeColor="#ff6600"
                                />
                            </div>

                            <div class="d-flex" style="gap: 10px;">
                                <div v-if="loyaltyCostDisplay" class="loyalty-discount-card__row" style="flex-direction: column; align-items: flex-start; gap: 4px;">
                                    <span class="loyalty-discount-card__label">Цена</span>
                                    <span class="loyalty-discount-card__value">
                                        <span class="loyalty-discount-card__new-price">
                                            {{ Math.max(0, loyaltyCostDisplay.price - (trip.loyalty.discount?.currentDiscountPerPerson || 0)) }} ₽
                                        </span>
                                        <span v-if="loyaltyCostDisplay.price !== Math.max(0, loyaltyCostDisplay.price - (trip.loyalty.discount?.currentDiscountPerPerson || 0))" class="loyalty-discount-card__old-price">{{ loyaltyCostDisplay.price }} ₽</span>
                                    </span>
                                </div>
                                <div class="loyalty-discount-card__row" :class="{ 'loyalty-discount-card__row--max': isMaxDiscount }" style="flex: 1; gap: 4px;">
                                    <div class="d-flex direction-column" style="flex: 1;">
                                        <span v-if="!isMaxDiscount" class="loyalty-discount-card__label">Скидка</span>
                                        <span class="loyalty-discount-card__subtitle" :class="{ 'loyalty-discount-card__subtitle--max': isMaxDiscount }">
                                            {{ isMaxDiscount ? 'Вам доступна максимальная скидка' : 'Чем больше человек в туре, тем больше выгода' }}
                                        </span>
                                    </div>
                                    <span class="loyalty-discount-card__value" style="text-align: right;">
                                        <span class="loyalty-discount-card__current-discount" :class="{ 'loyalty-discount-card__current-discount--max': isMaxDiscount }">{{ trip.loyalty.discount?.currentDiscountPerPerson || 0 }}</span>
                                        <br>
                                        <span class="loyalty-discount-card__max-discount" :class="{ 'loyalty-discount-card__max-discount--max': isMaxDiscount }">/ {{ trip.loyalty.discount?.maxDiscountPerPerson || 0 }} ₽</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div v-if="trip.loyalty?.enabled && trip.loyalty?.type === 'free_services' && tripDates.length < 2" class="loyalty-discount-card">
                            <div class="loyalty-discount-card__row" style="flex-direction: column; align-items: stretch; gap: 4px;">
                                <span class="loyalty-discount-card__label">Количество человек в туре</span>
                                <div class="d-flex space-between align-center" style="width: 100%;">
                                    <span class="loyalty-discount-card__current">{{ getCustomersCount(selectedDate.billsList) }}</span>
                                    <span class="loyalty-discount-card__max">максимум {{ trip.maxPeople }}</span>
                                </div>
                                <a-progress
                                    :percent="(getCustomersCount(selectedDate.billsList) / trip.maxPeople) * 100"
                                    :show-info="false"
                                    strokeColor="#ff6600"
                                />
                            </div>
                            <div
                                v-for="(level, index) in trip.loyalty.freeServices?.levels"
                                :key="index"
                                class="loyalty-discount-card__row"
                                :class="{ 'loyalty-discount-card__row--achieved': getCustomersCount(selectedDate.billsList) >= Number(level.peopleCount || 0) }"
                            >
                                <span class="loyalty-discount-card__label">
                                    {{ getCustomersCount(selectedDate.billsList) >= Number(level.peopleCount || 0) ? 'Вам доступна бесплатная услуга' : `При наборе ${level.peopleCount} человек, в подарок вы получите услугу` }}
                                    <span class="loyalty-discount-card__accent">«{{ level.service }}»</span>
                                </span>
                            </div>
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
                    <a-col :xs="24" v-if="trip?.places?.length">
                        <div>
                            <b>Мы посетим: </b>
                            <div class="d-flex flex-wrap">
                                <a-card v-for="place, index of trip.places" :key="index" class="pa-8 ml-8 mb-8 text "
                                    hoverable @click="goToPlacePage(place._id)"
                                    style="cursor: pointer; border: #239FCC 1px solid;">
                                    {{ place?.name }}
                                </a-card>
                            </div>


                        </div>
                    </a-col>
                    <a-col :xs="24">
                        <span v-html="trip.description"></span>
                    </a-col>
                    <a-col :xs="24" v-if="trip.dayByDayDescription.length">
                        <b>Программа по дням:</b>
                        <a-collapse v-model:activeKey="activeKey">
                            <a-collapse-panel v-for="day, index in trip.dayByDayDescription" :key="index" key="1"
                                :header="`${datePlugin.excursions.getNumeralDay(index)} день`">
                                <span v-html="day"></span>
                            </a-collapse-panel>

                        </a-collapse>
                    </a-col>
                    <a-divider class="ma-0"></a-divider>
                    <a-col :xs="24" v-if="trip.includedInPrice" class="mb-4">
                        <b>В стоимость включено:</b> {{ trip.includedInPrice }}
                    </a-col>
                    <a-col :xs="24" v-if="trip.paidExtra" class="mb-4">
                        <b>Дополнительно оплачивается:</b> {{ trip.paidExtra }}
                    </a-col>
                    <a-col :xs="24" v-if="trip.travelRequirement" class="mb-4">
                        <b>Требование к поездке:</b> {{ trip.travelRequirement }}
                    </a-col>

                    <a-col :xs="24" v-if="trip.returnConditions" class="mb-16">
                        <b>Условия возврата:</b>
                        <div v-html="trip.returnConditions"></div>
                    </a-col>

                    <div id="printMe" style="display: none">
                        <h2 class="ma-0">{{ trip.name }}</h2>
                        <p><i> {{ trip.offer }}</i></p>
                        <div v-if="trip?.startLocation?.name">
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
                                <a-checkable-tag class="pretty-tag" v-for="(date, index) of tripDates" :key="index"
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

                        <a-col :xs="24">
                            <div v-for="day, index in trip.dayByDayDescription" :key="index">
                                <div>
                                    <b>{{ datePlugin.excursions.getNumeralDay(index) }} день</b>
                                </div>
                                <span v-html="day"></span>
                            </div>
                        </a-col>
                        <div v-if="trip.includedInPrice">
                            <b>В стоимость включено:</b> {{ trip.includedInPrice }}
                        </div>
                        <div v-if="trip.paidExtra">
                            <b>Дополнительно оплачивается:</b> {{ trip.paidExtra }}
                        </div>
                        <div v-if="trip.travelRequirement">
                            <b>Требование к поездке:</b> {{ trip.travelRequirement }}
                        </div>

                        <div v-if="trip.returnConditions">
                            <b>Условия возврата:</b>
                            <div v-html="trip.returnConditions"></div>
                        </div>
                    </div>
                </a-row>
            </a-col>
        </a-row>
        <a-modal
            v-model:open="buyDialog"
            :footer="null"
            @cancel="refreshDates(trip)"
            :width="trip?.loyalty?.enabled ? 1093 : undefined"
            :wrapClassName="trip?.loyalty?.enabled ? 'loyalty-modal-wrap' : ''"
        >
            <Form @submit="buyTrip" :class="trip?.loyalty?.enabled ? 'lm-form' : 'mt-16'">
                <!-- ========== LOYALTY ENABLED: new layout ========== -->
                <template v-if="trip?.loyalty?.enabled">
                    <div class="lm-header">
                        Даты: <b class="lm-header__dates">{{ clearData(selectedDate.start) }} - {{ clearData(selectedDate.end) }}</b>
                    </div>

                    <div class="lm-body">
                        <!-- Left column: prices -->
                        <div class="lm-col-left">
                            <div class="lm-price-title">
                              Наличие мест требует уточнения!
                            </div>

                            <div class="lm-price-list">
                                <div v-for="(cost, index) of selectedDate.selectedCosts" :key="index" class="lm-price-row">
                                    <div class="lm-price-row__info">
                                        <div class="lm-price-row__type">{{ cost.costType }}</div>
                                    </div>
                                    <div class="lm-counter">
                                        <button type="button" class="lm-counter__btn"
                                            :disabled="cost.count <= 0"
                                            @click="cost.count = Math.max(0, cost.count - 1)">
                                            <span class="mdi mdi-minus"></span>
                                        </button>
                                        <input type="number" class="lm-counter__value"
                                            :value="cost.count"
                                            @input="cost.count = Math.max(0, Math.min(Number($event.target.value) || 0, trip.cost[index].limit ? trip.cost[index].limit - (customersByCostType[cost.costType] || 0) : trip.maxPeople - getCustomersCount(selectedDate.billsList)))"
                                        />
                                        <button type="button" class="lm-counter__btn"
                                            :disabled="(trip.cost[index].limit && customersByCostType[cost.costType] >= trip.cost[index].limit) || cost.count >= (trip.cost[index].limit ? trip.cost[index].limit - (customersByCostType[cost.costType] || 0) : trip.maxPeople - getCustomersCount(selectedDate.billsList))"
                                            @click="cost.count = Math.min(cost.count + 1, trip.cost[index].limit ? trip.cost[index].limit - (customersByCostType[cost.costType] || 0) : trip.maxPeople - getCustomersCount(selectedDate.billsList))">
                                            <span class="mdi mdi-plus"></span>
                                        </button>
                                    </div>
                                    <div class="lm-price-row__amount">{{ cost.cost }}₽</div>
                                </div>
                            </div>

                            <template v-if="trip.additionalServices?.length > 0">
                                <div class="lm-section-label">Дополнительные услуги</div>
                                <div class="lm-price-list">
                                    <div v-for="service of additionalServices" :key="service.index" class="lm-price-row">
                                        <div class="lm-price-row__info">
                                            <div class="lm-price-row__type">{{ service.name }}</div>
                                        </div>
                                        <div class="lm-counter">
                                            <button type="button" class="lm-counter__btn"
                                                :disabled="service.count <= 0"
                                                @click="service.count = Math.max(0, service.count - 1)">
                                                <span class="mdi mdi-minus"></span>
                                            </button>
                                            <input type="number" class="lm-counter__value"
                                                :value="service.count"
                                                @input="service.count = Math.max(0, Math.min(Number($event.target.value) || 0, getSelectedUsersCount))"
                                            />
                                            <button type="button" class="lm-counter__btn"
                                                :disabled="service.count >= getSelectedUsersCount"
                                                @click="service.count = Math.min(service.count + 1, getSelectedUsersCount)">
                                                <span class="mdi mdi-plus"></span>
                                            </button>
                                        </div>
                                        <div class="lm-price-row__amount">{{ service.price }}₽</div>
                                    </div>
                                </div>
                            </template>
                        </div>

                        <!-- Right column: tourists -->
                        <div class="lm-col-right">
                            <div class="lm-tourists-title">Туристы</div>
                            <div class="lm-tourists-scroll">
                                <div v-for="(tourist, index) in touristsList" :key="index" class="lm-tourist">
                                    <div class="lm-tourist__number">{{ index + 1 }} турист</div>
                                    <div class="lm-tourist__fields">
                                        <a-input v-model:value="touristsList[index].fullname" placeholder="Иванов Иван Иванович" />
                                        <a-input v-model:value="touristsList[index].phone" placeholder="79999999999" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Location selector -->
                    <div v-if="trip?.locationNames?.length > 1" class="lm-location">
                        <span>Место посадки</span>
                        <a-select placeholder="г.Глазов" v-model:value="selectedStartLocation" style="width: 100%;">
                            <a-select-option v-for="item in trip.locationNames" :value="item.name"></a-select-option>
                        </a-select>
                    </div>

                    <!-- Loyalty: discount type -->
                    <div v-if="trip?.loyalty?.type === 'discount'" class="modal-loyalty">
                        <div class="d-flex" style="gap: 10px; flex-wrap: wrap;">
                            <div v-if="trip.loyalty.discount?.baseDiscountPercent" class="modal-loyalty__card" style="flex: 1; min-width: 140px;">
                                <span class="modal-loyalty__label">Базовая скидка</span>
                                <span class="modal-loyalty__value">{{ trip.loyalty.discount?.baseDiscountPercent }}%
                                    <span class="modal-loyalty__hint">({{ baseDiscountPerPerson }}₽)</span>
                                </span>
                            </div>
                            <div style="flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 8px; padding: 10px 16px 0 16px; background: rgba(255, 255, 255, 0.5); border-radius: 20px;">
                                <div class="d-flex space-between align-center">
                                    <span class="modal-loyalty__label">Доп. скидка</span>
                                    <span v-if="isMaxDiscount" class="modal-loyalty__max-label">Вам доступна максимальная скидка</span>
                                </div>
                                <div class="d-flex" style="align-items: stretch; margin-inline: -16px">
                                    <div class="modal-loyalty__card" style="flex: 1; flex-direction: column; align-items: stretch; gap: 4px; border-radius: 20px 0 0 20px;">
                                        <span class="modal-loyalty__label">Количество человек в туре</span>
                                        <div class="modal-loyalty__progress-wrap">
                                            <span class="modal-loyalty__progress-text">{{ getCustomersCount(selectedDate.billsList) }} / {{ trip.maxPeople }}</span>
                                            <a-progress
                                                :percent="(getCustomersCount(selectedDate.billsList) / trip.maxPeople) * 100"
                                                :show-info="false"
                                                :strokeWidth="16"
                                                strokeColor="#ff6600"
                                            />
                                        </div>
                                    </div>
                                    <div class="modal-loyalty__discount-badge" :class="{ 'modal-loyalty__discount-badge--max': isMaxDiscount }">
                                        <span class="modal-loyalty__discount-label">Скидка</span>
                                        <div>
                                            <span class="modal-loyalty__discount-current">{{ trip.loyalty.discount?.currentDiscountPerPerson || 0 }}₽</span>
                                            <span class="modal-loyalty__discount-divider"> / {{ trip.loyalty.discount?.maxDiscountPerPerson || 0 }}₽</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Loyalty: free_services type -->
                    <div v-if="trip?.loyalty?.type === 'free_services'" class="modal-loyalty modal-loyalty--free">
                        <span class="modal-loyalty__section-title">Подарок</span>
                        <div class="modal-loyalty__card" style="flex-direction: column; align-items: stretch; gap: 4px;">
                            <span class="modal-loyalty__label">Количество человек в туре</span>
                            <div class="modal-loyalty__progress-wrap">
                                <span class="modal-loyalty__progress-text">{{ getCustomersCount(selectedDate.billsList) }} / {{ trip.maxPeople }}</span>
                                <a-progress
                                    :percent="(getCustomersCount(selectedDate.billsList) / trip.maxPeople) * 100"
                                    :show-info="false"
                                    :strokeWidth="16"
                                    strokeColor="#ff6600"
                                />
                            </div>
                        </div>
                        <div v-if="activeFreeServiceLevel" class="modal-loyalty__free-badge">
                            Вам доступна бесплатная услуга «{{ activeFreeServiceLevel.service }}»
                        </div>
                        <div v-for="(level, index) in trip.loyalty.freeServices?.levels" :key="index">
                            <div
                                v-if="getCustomersCount(selectedDate.billsList) < Number(level.peopleCount || 0)"
                                class="modal-loyalty__free-pending"
                            >
                                При наборе {{ level.peopleCount }} человек, в подарок вы получите услугу <span>«{{ level.service }}»</span>
                            </div>
                        </div>
                    </div>

                    <!-- Total cost -->
                    <div class="modal-loyalty__total">
                        <div>
                            <div class="modal-loyalty__total-title">Итоговая цена</div>
                            <div v-if="trip?.loyalty?.type === 'discount' && !trip?.loyalty?.discount?.isFixed" class="modal-loyalty__total-desc">
                                Оплата производится в 2 этапа, оплатите часть общей суммы сейчас, оставшуюся часть будет доступна после фиксации скидки, оставшаяся сумма будет пересчитана с учетом скидки
                            </div>
                            <div v-else-if="loyaltyDiscountTotal > 0" class="modal-loyalty__total-desc">
                                Цена пересчитана с учетом скидки
                            </div>
                        </div>
                        <div class="modal-loyalty__total-price">
                            <span v-if="loyaltyDiscountTotal > 0" class="modal-loyalty__total-final">{{ discountedFinalCost }}₽</span>
                            <span v-else-if="!trip?.loyalty?.discount?.isFixed && trip?.loyalty?.type === 'discount'" class="modal-loyalty__total-final">{{ firstPaymentCost }}₽</span>
                            <span v-else class="modal-loyalty__total-final">{{ finalCost }}₽</span>
                            <span v-if="loyaltyDiscountTotal > 0" class="modal-loyalty__total-old">{{ finalCost }}₽</span>
                        </div>
                    </div>

                    <!-- Bus seats -->
                    <div v-if="bus && people_amount > 0" class="lm-bus">
                        <div>Выберите места</div>
                        <div style="font-size:0.8em; opacity: 0.8;">{{ bus.name }}</div>
                        <Bus @select="updateSeats" v-model:selected_seats="selected_seats" :free_seats="free_seats"
                            :max_count="people_amount" :bus="bus" style="width: 150px;" />
                    </div>

                    <!-- Buttons -->
                    <div class="lm-actions">
                        <a-button html-type="submit" class="lm-actions__order" @click="buyNow = false" :disabled="isNoPlaces">
                            Заказать
                        </a-button>
                        <a-button v-if="!trip.partner || trip?.canSellPartnerTour"
                            html-type="submit" :disabled="isNoPlaces" @click="buyNow = true"
                            type="primary" class="lm-actions__pay">
                            Оплатить {{ firstPaymentCost > 0 && firstPaymentPercentage < 1 ? firstPaymentCost + '₽' : '' }}
                        </a-button>
                    </div>
                    <div class="lm-legal">
                        Выполняя покупки на платформе "Города и веси", вы соглашаетесь с
                        <b><router-link to="/documents" style="color:#ff6600">офертой</router-link></b>
                        и <b><router-link to="/documents" style="color:#ff6600">обработкой персональных данных по правилам платформы</router-link></b>
                    </div>
                </template>

                <!-- ========== LOYALTY DISABLED: old layout ========== -->
                <template v-else>
                    <a-row :gutter="[4, 8]" class="mb-8" v-for="(tourist, index) in touristsList" :key="index">
                        <a-col :span="24"> {{ index + 1 }} турист </a-col>
                        <a-col :span="24" :md="12">
                            <Field name="fullname">
                                <a-input v-model:value="touristsList[index].fullname"
                                    placeholder="Иванов Иван Иванович"></a-input>
                            </Field>
                        </a-col>
                        <a-col :span="24" :md="12">
                            <Field name="phone">
                                <a-input v-model:value="touristsList[index].phone" placeholder="791275288874" size="medium"
                                    :controls="false" style="width:100%"></a-input>
                            </Field>
                        </a-col>
                    </a-row>
                    <a-row :gutter="[4, 8]">
                        <a-col :span="24" v-if="trip?.locationNames?.length > 1">
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
                            <div class="d-flex space-between align-center"
                                v-for="cost, index of selectedDate.selectedCosts">

                                <div>
                                    {{ cost.costType }}
                                </div>
                                <div>{{ cost.cost }} руб.</div>

                                <div class="d-flex direction-column">
                                    <div> <span style="font-size: 8px">кол-во</span>
                                        <span style="font-size: 8px" v-if="trip.cost[index].limit"> (
                                            <span v-if="customersByCostType[cost.costType]"> {{
                                                customersByCostType[cost.costType] }}/</span>
                                            {{
                                                trip.cost[index].limit
                                            }})</span>
                                    </div>
                                    <a-input-number v-model:value="cost.count" :min="0"
                                        :disabled="trip.cost[index].limit && customersByCostType[cost.costType] >= trip.cost[index].limit"
                                        :max="trip.cost[index].limit ? trip.cost[index].limit - customersByCostType[cost.costType] : trip.maxPeople - getCustomersCount(selectedDate.billsList)"
                                        placeholder="чел">
                                    </a-input-number>
                                </div>
                            </div>
                        </a-col>
                        <a-col v-if="trip.additionalServices?.length > 0" :span="24">
                            <div>Дополнительные услуги</div>
                            <a-row v-for="service of additionalServices" :key="service.index" class="d-flex space-between">
                                <div class="d-flex align-center">
                                    {{ service.name }}
                                </div>
                                <div class="d-flex align-center">
                                    {{ service.price }} руб.
                                </div>
                                <div class="d-flex direction-column">
                                    <span style="font-size: 8px;">кол-во</span>
                                    <a-input-number v-model:value="service.count" :min="0" :max="getSelectedUsersCount"
                                        placeholder="чел"></a-input-number>
                                </div>
                            </a-row>
                        </a-col>

                        <a-col :span="24" class="d-flex direction-column align-end">
                            <b>Итого: {{ finalCost }} руб.</b>
                        </a-col>

                        <div v-if="!trip?.canSellPartnerTour && trip.partner">
                            <h4 class="warning">Наличие мест требует уточнения!</h4>
                        </div>

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
                                <div class="buy-btn" v-if="!trip.partner || trip?.canSellPartnerTour">
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
                            <div style="font-size:0.8em; padding-top:10px">
                                Выполняя покупки на платформе "Города и веси", вы соглашаетесь с
                                <b><router-link to="/documents" style="color:#ff6600">офертой</router-link></b>
                                и <b>
                                    <router-link to="/documents" style="color:#ff6600"> обработкой персональных
                                        данных по правилам платформы</router-link>
                                </b>
                            </div>
                        </a-col>
                    </a-row>
                </template>
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


.loyalty-discount-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-radius: 24px;
  padding: 10px;
  margin: 12px 0;
  background: #e6e6e6;
  max-width: 420px;

  :deep(.ant-progress) {
    margin: 0;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 14px;
    padding: 10px;
    background: #fff;
  }

  &__label {
    font-weight: 500;
    font-size: 12px;
    line-height: 120%;
    color: #434343;
  }

  &__value {
    font-weight: 600;
    font-size: 16px;
    line-height: 100%;
    color: #f60;
  }

  &__old-price {
    font-weight: 400;
    font-size: 12px;
    line-height: 100%;
    text-decoration: line-through;
    color: #4d4d4d;
    opacity: 0.5;
  }

  &__new-price {
    font-weight: 600;
    font-size: 20px;
    line-height: 100%;
    color: #f60;
  }

  &__hint {
    font-weight: 400;
    color: #363636;
  }

  &__current {
    font-weight: 600;
    font-size: 20px;
    line-height: 100%;
    color: #434343;
  }

  &__subtitle {
    font-weight: 400;
    font-size: 10px;
    line-height: 120%;
    color: #434343;
    opacity: 0.5;
    margin-top: 8px;
  }

  &__max {
    border-radius: 44px;
    padding: 6px 8px;
    background: #f5f5f5;
    font-weight: 400;
    font-size: 10px;
    line-height: 100%;
    color: #434343;
  }

  &__current-discount {
    font-weight: 600;
    font-size: 20px;
    line-height: 120%;
    color: #f60;

    &--max {
      color: #fff;
    }
  }

  &__max-discount {
    font-weight: 400;
    font-size: 14px;
    line-height: 120%;
    color: #8696a9;

    &--max {
      color: rgba(255, 255, 255, 0.7);
    }
  }

  &__row--max {
    background: #f60;
  }

  &__row--achieved {
    background: #f60;

    .loyalty-discount-card__label,
    .loyalty-discount-card__accent {
      color: #fff;
    }
  }

  &__subtitle--max {
    color: #fff;
    opacity: 1;
  }

  &__accent {
    color: #f60;
    font-weight: 600;
  }
}

// ====== Loyalty modal new layout ======
.lm-form {
  padding: 0;
  font-family: 'Montserrat', sans-serif;
}

.lm-header {
  font-weight: 500;
  font-size: 24px;
  color: #8c8c8c;
  margin-bottom: 20px;

  &__dates {
    font-weight: 600;
    color: #f60;
  }

  @media (max-width: 768px) {
    font-size: 16px;
  }
}

.lm-body {
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.lm-col-left, .lm-col-right {
  border-radius: 20px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.5);
  flex: 1;
  min-width: 0;
}

.lm-section-label {
  font-weight: 500;
  font-size: 13px;
  color: #434343;
  margin-top: 12px;
  margin-bottom: 4px;
}

.lm-price-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.lm-price-row {
  display: flex;
  align-items: center;
  gap: 8px;
  border-radius: 16px;
  padding: 12px 16px;
  background: #fff;

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__type {
    font-weight: 500;
    font-size: 16px;
    color: #8c8c8c;
  }

  &__limit {
    font-size: 10px;
    color: #999;
  }

  &__amount {
    font-weight: 600;
    font-size: 20px;
    color: #f60;
    white-space: nowrap;
    min-width: 70px;
    text-align: right;
  }
}

.lm-counter {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  border-radius: 43px;
  padding: 6px;
  height: 36px;
  background: #f3f3f3;

  &__btn {
    border: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #f60;
    color: #fff;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: opacity 0.2s, background 0.2s;
    padding: 0;
    line-height: 1;

    &:hover:not(:disabled) {
      background: #f60;
      color: #fff;
    }

    &:disabled {
      border-color: #d9d9d9;
      color: #d9d9d9;
      cursor: not-allowed;
    }
  }

  &__value {
    font-weight: 600;
    font-size: 16px;
    color: #434343;
    width: 32px;
    text-align: center;
    border: none;
    outline: none;
    background: transparent;
    padding: 0;
    -moz-appearance: textfield;
    appearance: textfield;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}

.lm-price-title, .lm-tourists-title {
  font-weight: 400;
  font-size: 16px;
  text-align: center;
  color: #434343;
  margin-bottom: 10px;
}

.lm-tourists-scroll {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 318px;
  overflow-y: auto;
  padding-right: 4px;
}

.lm-tourist {
  border-radius: 16px;
  padding: 10px 14px;
  background: #fff;

  &__number {
    font-weight: 500;
    font-size: 16px;
    color: #8c8c8c;
    margin-bottom: 4px;
  }

  &__fields {
    display: flex;
    gap: 4px;

    @media (max-width: 480px) {
      flex-direction: column;
    }

    :deep(.ant-input) {
      border-radius: 51px;
      padding: 8px;
      width: 224px;
      height: 33px;
      background: #f6f6f6;
      border: none;

      @media (max-width: 768px) {
        width: 100%;
      }
    }
  }
}

.lm-location {
  margin-top: 12px;
  padding: 10px 14px;
  border-radius: 16px;
  background: #fff;
}

.lm-bus {
  margin-top: 12px;
  padding: 10px 14px;
  border-radius: 16px;
  background: #fff;
}

.lm-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;

  &__order {
    border: 2px solid #f60 !important;
    border-radius: 39px !important;
    padding: 10px 20px !important;
    min-width: 224px !important;
    height: 44px !important;
    font-weight: 600 !important;
    font-size: 20px!important;
    color: #f60 !important;
    line-height: 1 !important;
    text-transform: capitalize !important;
    background: transparent !important;
  }

  &__pay {
    border: 2px solid #f60 !important;
    border-radius: 39px !important;
    padding: 10px 20px !important;
    min-width: 224px !important;
    height: 44px !important;
    font-weight: 600 !important;
    font-size: 20px!important;
    color: #fff !important;
    line-height: 1 !important;
    text-transform: capitalize !important;
    background: #f60 !important;
  }
}

.lm-legal {
  font-weight: 400;
  font-size: 12px;
  text-align: center;
  color: #434343;
  margin-top: 20px;
}

.modal-loyalty {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;

  &--free {
    border-radius: 20px;
    padding: 10px 0 0;
    width: 100%;
    max-width: 1053px;
    min-height: 123px;
    background: rgba(255, 255, 255, 0.5);

    @media (max-width: 768px) {
      border-radius: 14px;
      padding: 8px 0 0;
    }
  }

  :deep(.ant-progress) {
    margin: 0;

    .ant-progress-outer {
      border-radius: 8px !important;
      padding: 0 !important;
      max-width: 310px;
      height: 20px !important;
      background: #efefef !important;
      display: flex;

      @media (max-width: 768px) {
        max-width: 100%;
      }
    }

    .ant-progress-inner {
      border-radius: 6px !important;
      height: 100% !important;
      background: transparent !important;
    }

    .ant-progress-bg {
      border-radius: 6px !important;
      height: 100% !important;
    }
  }

  &__section-title {
    font-weight: 500;
    font-size: 16px;
    text-align: left;
    color: #8c8c8c;
    padding-left: 10px;
  }

  &__card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 20px;
    padding: 16px;
    background: #fff;
    flex: 1;
  }

  &__label {
    font-weight: 500;
    font-size: 16px;
    color: #8c8c8c;
  }

  &__value {
    font-weight: 600;
    font-size: 16px;
    color: #f60;
    white-space: nowrap;
  }

  &__hint {
    font-weight: 400;
    color: #363636;
  }

  &__max-label {
    font-weight: 500;
    font-size: 11px;
    color: #f60;
  }

  &__progress-wrap {
    position: relative;
    width: 100%;
  }

  &__progress-text {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 2px;
    left: 2px;
    z-index: 1;
    border-radius: 6px;
    padding: 0 8px;
    min-width: 46px;
    height: 16px;
    background: rgba(255, 255, 255, 0.9);
    font-weight: 600;
    font-size: 10px;
    line-height: 1;
    text-align: center;
    color: #3d3d3d;
    white-space: nowrap;
  }

  &__discount-badge {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    border-radius: 0 20px 20px 0;
    padding: 10px 16px;
    background: #f60;
    color: #fff;
    min-width: 100px;

    &--max {
      background: #f60;
    }
  }

  &__discount-label {
    font-weight: 500;
    font-size: 16px;
    color: #fff;
  }

  &__discount-current {
    font-weight: 600;
    font-size: 24px;
    color: #fff;
  }

  &__discount-divider {
    font-weight: 400;
    font-size: 24px;
    color: #fff;
    opacity: 0.6;
  }

  &__free-badge {
    border-radius: 12px;
    padding: 14px 16px;
    background: #f60;
    color: #fff;
    font-weight: 500;
    font-size: 14px;
  }

  &__free-pending {
    border-radius: 12px;
    padding: 10px 12px;
    background: #ffffff;
    margin-top: 4px;
    font-weight: 500;
    font-size: 16px;
    color: #8c8c8c;

    span {
      color: #f60;
    }
  }

  &__total {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-radius: 20px;
    padding: 16px;
    background: #fff;
    margin-top: 10px;
    gap: 16px;
  }

  &__total-title {
    font-weight: 600;
    font-size: 20px;
    color: #f60;
  }

  &__total-desc {
    font-weight: 500;
    font-size: 16px;
    color: #8c8c8c;
    max-width: 800px;
  }

  &__total-price {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    white-space: nowrap;
  }

  &__total-final {
    font-weight: 600;
    font-size: 24px;
    color: #f60;
  }

  &__total-old {
    font-weight: 400;
    font-size: 16px;
    text-decoration: line-through;
    color: #b4b4b4;
  }
}
</style>

<!-- Global styles for loyalty modal wrapper (ant-design modal renders outside scoped component) -->
<style lang="scss">
.loyalty-modal-wrap {
  .ant-modal {
    max-width: 1093px;
    width: 95% !important;

    @media (max-width: 768px) {
      width: 100% !important;
      max-width: 100%;
      margin: 0;
      top: 0;
      padding: 0;
    }
  }

  .ant-modal-content {
    border-radius: 40px;
    padding: 20px;
    box-shadow: 0 6px 17px 0 rgba(0, 0, 0, 0.16);
    background: #f3f3f3;

    @media (max-width: 768px) {
      border-radius: 20px;
      padding: 14px;
    }

    @media (max-width: 480px) {
      border-radius: 12px;
      padding: 10px;
    }
  }

  .ant-modal-body {
    padding: 0;
  }

  .ant-modal-close {
    top: 20px;
    right: 20px;
    border-radius: 12px;
    padding: 4px;
    width: 32px;
    height: 32px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;

    color: #f60;

    span {
      display: flex;
      color: #f60;
    }

    .ant-modal-close-x {
      color: #f60;
    }

    @media (max-width: 768px) {
      top: 14px;
      right: 14px;
    }
  }
}
</style>
