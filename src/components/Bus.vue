<script setup>
import { computed, onMounted, ref } from 'vue';

let props = defineProps({
    bus: Object,
    selected_seats: Array,
    free_seats: Array
})
let emit = defineEmits(['update:bus', 'update:selected_seats'])

let bus = props.bus
let free_seats = props.free_seats
let selected_seats = computed({
    get() {
        return props['selected_seats']
    },
    set(value) {
        emit('update:selected_seats', value)
    }
})

function select(num) {
    if (bus.stuff.includes(num) || !free_seats.includes(num)) return

    if (selected_seats.value.includes(num)) {
        selected_seats.value = selected_seats.value.filter(item => item !== num)
    } else {
        selected_seats.value.push(num)
    }
}
</script>

<template>
    <div style="container-type: inline-size;">
        <div class="bus" ref="bus_el" :style="{
            'aspect-ratio': bus.aspect_ratio
        }">
            <div
                v-for="seat in bus.seats" 
                @click="select(seat.number)"
                class="seat" 
                :style="{
                    cursor: bus.stuff.includes(seat.number) || !free_seats.includes(seat.number) ? 'not-allowed' : 'pointer',
                    left: seat.x * 100 + '%',
                    top: seat.y * 100 + '%',
                    width: seat.width * 100 + '%',
                    height: seat.height * 100 + '%',
                    background: selected_seats.includes(seat.number) ? '#83F14F' : bus.stuff.includes(seat.number) || !free_seats.includes(seat.number) ? '#E87C64' : '#D9D9D9'
                }"
            >
                {{ seat.number }}
            </div>
    
            <div class="driver" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.bus { 
    position: relative;
	border-width: 2.5px;
	border-style: solid;
	border-color: #8F8F8F;
    border-radius: calc(24/225*100cqw);
	width: 100%;
}
.driver {
    position: absolute; 
    width: calc(46/225*100%); 
    left: calc(25/255*100cqw);
    top: calc(25/255*100cqw);
    aspect-ratio: 46/53;
    background: url(/driver-seat.svg) 50% 50% no-repeat; 
    background-size: cover;
}
.seat {
    position: absolute;
    border: 1px solid #555555;
    transition: all .15s;
    user-select: none;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
	font-size: 100%;
}
</style>