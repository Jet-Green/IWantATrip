<script setup>
import { computed, watch, toRefs } from 'vue';

let props = defineProps({
    bus: {
        type: Object,
        required: true
    },
    selected_seats: {
        type: Array,
        default: []
    },
    free_seats: { 
        type: Array,
        default: []
    },
    max_count: {
        type: Number,
        default: 1
    },
    preview: Boolean
})
let emit = defineEmits(['update:bus', 'update:selected_seats'])

let { bus, free_seats, max_count } = toRefs(props)
let preview = props.preview

let selected_seats = computed({
    get() {
        return props.selected_seats
    },
    set(value) {
        emit('update:selected_seats', value)
    }
})

function select(num) {
    if (bus.value.stuff.includes(num) || !free_seats.value.includes(num) || preview) return

    if (selected_seats.value.includes(num)) {
        selected_seats.value = selected_seats.value.filter(item => item !== num)
    }
    else if (selected_seats.value.length >= max_count.value) {
        return
    } 
    else {
        selected_seats.value.push(num)
    }
}
</script>

<template>
    <div style="container-type: inline-size;">
        <div class="bus" ref="bus_el" :style="{
            'aspect-ratio': bus.aspect_ratio
        }" :class="{ 'no-select': preview }">
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
                    background: preview ? (bus.stuff.includes(seat.number) ? '#E87C64' : '#D9D9D9') : selected_seats.includes(seat.number) ? '#83F14F' : bus.stuff.includes(seat.number) || !free_seats.includes(seat.number) ? '#E87C64' : '#D9D9D9'
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
    border-radius: calc(22/225*100cqw);
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
    overflow: hidden;
    align-items: center;
    font-weight: bold;
	font-size: 7.5cqw;
    object-fit: cover;
}
.no-select * {
    cursor: default !important;
}
</style>