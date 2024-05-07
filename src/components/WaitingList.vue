<script setup>
import { computed, reactive, toRefs, watch, ref } from "vue";
import _ from 'lodash'

let props = defineProps({
    tripsCount: Number,
    transport: Array,
    selected: Object,
    waiting: Object,
    show_old_bus: Boolean,
    selected_seats: Array
});
let emit = defineEmits(['isUserWaiting', 'update:selected', 'update:waiting'])

const { tripsCount, show_old_bus, selected_seats } = toRefs(props);
// let tripsCount = ref(35)
// сортированнный по capacity
let transports = reactive(props.transport)

let visible = ref(false)
let visible2 = ref(false)
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


watch(tripsCount, () => { 
    emit('isUserWaiting', selectTransport.value.isWaiting)
    emit('update:selected', selectTransport.value.selected)
    emit('update:waiting', selectTransport.value.wait)
}, { immediate: true })
</script>

<template>
    <div>
        <a-row :gutter="[16]">
            <a-col v-if="!_.isEmpty(selectTransport.selected)">
                <div>Едет: <b>{{ selectTransport.selected?.transportType.name }}</b> </div>
                <div v-if="!show_old_bus"><strong>{{ selected_seats && selected_seats.length ? `Вы выбрали ${selected_seats.join(', ')}` : 'Выберите места' }}</strong></div>

                <a-popover v-model:open="visible" @click="visible = !visible">
                    <template #content>
                        <div class="d-flex align-center">
                            <div class="current-passenger"></div> &nbsp- текущий турист
                        </div>
                        <div class="d-flex align-center">
                            <div class="passenger-seat "></div> &nbsp- вы едете
                        </div>
                        <div class="d-flex align-center">
                            <div class="waiting-passenger"></div> &nbsp- в листе ожидания
                        </div>
                        <!-- <div class="d-flex align-center">
                            <div class="hide"></div> &nbsp- из меньшего транспорта
                        </div> -->

                    </template>



                    <div class="transport" v-if="show_old_bus">
                        <img src="../assets/images/back.png" style="height: 100%" alt="">

                        <div v-for="seat, i in selectTransport.selected?.capacity" class="passenger-seat"
                            :class="[seat == tripsCount ? 'current-passenger' : '']">


                        </div>
                        <img src="../assets/images/front.png" style="height: 100%" alt="">
                    </div>
                </a-popover>
            </a-col>
            <a-col v-if="!_.isEmpty(selectTransport.wait)">
                <div>Заполняется: {{ selectTransport.wait?.transportType.name }}</div>
                <div v-if="!show_old_bus"><strong>{{ selected_seats && selected_seats.length ? `Вы выбрали ${selected_seats.join(', ')}` : 'Выберите места' }}</strong></div>

                <a-popover v-model:open="visible2" @click="visible2 = !visible2">
                    <template #content>
                        <div class="d-flex align-center">
                            <div class="current-passenger"></div> &nbsp- текущий турист
                        </div>
                        <div class="d-flex align-center">
                            <div class="passenger-seat "></div> &nbsp- вы едете
                        </div>
                        <div class="d-flex align-center">
                            <div class="waiting-passenger"></div> &nbsp- в листе ожидания
                        </div>
                        <div class="d-flex align-center">
                            <div class="hide"></div> &nbsp- из меньшего транспорта
                        </div>

                    </template>
                    <div class="transport" v-if="show_old_bus">
                     
                        <img src="../assets/images/back.png" style="height: 100%" alt="">

                        <div v-for="seat, i in selectTransport.wait?.capacity"
                            :class="[seat <= selectTransport.wait.waiting ? 'waiting-passenger' : 'passenger-seat', seat < selectTransport.wait.start ? 'hide' : '', seat == tripsCount ? 'current-passenger' : '']">
                        </div>

                        <img src="../assets/images/front.png" style="height: 100%" alt="">

                    </div>

                </a-popover>

            </a-col>
        </a-row>
    </div>
</template>
<style lang="scss" scoped>
.transport {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    height: 36px;
    width: fit-content;
    cursor: pointer;
    // border-top: 1px solid black;
    // border-bottom: 1px solid black;
    // border-top-left-radius: 15px;
    // border-bottom-left-radius: 15px;
    min-width: 50px;
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
    width: 6px;
    aspect-ratio: 1;
    border-radius: 50%;
    margin: 2px;
    background-color: rgb(229, 229, 229);
}

.current-passenger {
    width: 8px;
    aspect-ratio: 1;
    border-radius: 50%;
    border: solid 2px black;
    // background: #227597
}
</style>