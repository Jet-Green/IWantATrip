<script setup>
import { ref, computed, reactive, toRef } from "vue";
import _ from 'lodash'

let props = defineProps({
    tripsCount: Number,
});

let tripsCount = ref(props.tripsCount)

// let tripsCount = ref(35)
// сортированнный по capacity
let transports = reactive([
    {
        type: "машина",
        capacity: 5,
        waiting: 3
    },
    {
        type: "минивен",
        capacity: 14,
        waiting: 10
    },
    {
        type: "микроавтобус",
        capacity: 25,
        waiting: 17
    },
    {
        type: "автобус",
        capacity: 45,
        waiting: 30
    }
])



let selectTransport = computed(() => {
    let selected = {}
    let wait = {}
    let isWaiting = true
    for (let i = 0; i < transports.length; i++) {
        if (tripsCount.value <= transports[i].capacity) {
            if (tripsCount.value > transports[i].waiting) {
                selected = transports[i]
                isWaiting = false
                if (transports[i + 1]) {
                    wait = transports[i + 1]
                    wait.start = transports[i].capacity + 1

                } else {
                    wait = {}
                }
                break
            } else {
                wait = transports[i]
                if (i > 0) {
                    selected = transports[i - 1]
                    wait.start = transports[i - 1].capacity + 1
                } else {
                    selected = {}
                }
                break
            }
        }
        if (tripsCount.value <= transports[0].waiting) {
            selected = {}
            wait = transports[0]
        }
    }
    return { selected, wait, isWaiting }
})




</script>

<template>
    <div>
        <a-row :gutter="[16]">
            <a-col  v-if="!_.isEmpty(selectTransport.selected)">
                <div>Едет: <b>{{ selectTransport.selected?.type }}</b> </div>
                <div class="transport">
                    <img src="../assets/images/back.png" style="height: 100%" alt="">
                    <div v-for="seat, i in selectTransport.selected?.capacity" class="passenger-seat"
                        :class="[seat == tripsCount ? 'current-passenger' : '']">
                    </div>
                    <img src="../assets/images/front.png" style="height: 100%" alt="">
                </div>
            </a-col>
            <a-col  v-if="!_.isEmpty(selectTransport.wait)">
                <div>Заполняем: {{ selectTransport.wait?.type }}</div>
                <div class="transport">
                    <img src="../assets/images/back.png" style="height: 100%" alt="">
                    <div v-for="seat, i in selectTransport.wait?.capacity"
                        :class="[seat <= selectTransport.wait.waiting ? 'waiting-passenger' : 'passenger-seat', seat < selectTransport.wait.start ? 'hide' : '', seat == tripsCount ? 'current-passenger' : '']">
                    </div>
                    <img src="../assets/images/front.png" style="height: 100%" alt="">
                </div>

            </a-col>
        </a-row>
    </div>
</template>
<style lang="scss" scoped>
.waitinf-list {
    display: flex;
}

.transport {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    height: 36px;
    width: fit-content;
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    border-radius: 15px;
    min-width: 75px;
}

.passenger-seat {

    width: 6px;
    aspect-ratio: 1;
    border-radius: 50%;
    margin: 2px;
    background-color: rgb(111, 133, 43)
}

.waiting-passenger {
    width: 6px;
    aspect-ratio: 1;
    border-radius: 50%;
    margin: 2px;
    background-color: rgb(255, 84, 14)
}

.hide {
    background-color: rgb(229, 229, 229);
}

.current-passenger {
    width: 8px;
    aspect-ratio: 1;
    border-radius: 50%;
    background: #227597
}
</style>