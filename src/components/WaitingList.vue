<script setup>

import { ref, computed, watch, reactive, onMounted } from "vue";
let tourist = ref(15)
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

let selected = {}
let wait = {}
let minStart = 0
let selectTransport = computed(() => {

    for (let i = 0; i < transports.length; i++) {
        if (tourist.value <= transports[i].capacity && tourist.value > transports[i].waiting) {
            selected = transports[i]
            if (transports[i + 1]) {
                wait = transports[i + 1]
                wait.start = transports[i].capacity + 1

            } else {
                wait = {}
            }

            
        }
        if (tourist.value <= transports[0].waiting) {
            selected = {}
            wait = transports[0]
        }
    }
    return { selected, wait }
})




</script>

<template>
    {{ selectTransport }}
    <div>
        <a-input style="width:200px" v-model:value="tourist" type="number" :min="0" />
        <a-row class="ma-16 justify-center direction-column">

            <div>Едет</div>
            <a-col>
                <div class="transport">
                    <div v-for="seat, i in selectTransport.selected?.capacity" class="passenger-seat"
                        :class="[seat == tourist ? 'current-passenger' : '']">

                    </div>
                </div>


            </a-col>

            <div>Набирается</div>
            <a-col>
                <div class="transport">
                    <div v-for="seat, i in selectTransport.wait?.capacity"
                        :class="[seat <= selectTransport.wait.waiting ? 'waiting-passenger' : 'passenger-seat', seat < selectTransport.wait.start ? 'hide' : '', seat == tourist ? 'current-passenger' : '']">
                    </div>
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
    border: 1px solid black;
    height: 50px;
    width: fit-content;




}

.passenger-seat {

    width: 10px;
    height: 10px;
    margin: 5px;
    background-color: blue;
}

.waiting-passenger {
    width: 10px;
    height: 10px;
    margin: 5px;
    background-color: red;
}

.hide {
    background-color: rgb(229, 229, 229);
}

.current-passenger {
    width: 15px;
    height: 15px;
    border: 2px solid black;
}
</style>