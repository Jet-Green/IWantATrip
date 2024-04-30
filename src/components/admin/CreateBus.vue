<script setup>
import { onMounted, ref, watch } from 'vue';
import _ from 'lodash'
import Bus from '../Bus.vue';
import { useBus } from '../../stores/bus';
import { message } from "ant-design-vue";
import { useRouter } from 'vue-router';

let router = useRouter()

let bus = ref({
	name: '',
	author: '',
	rows: null,
	seats_in_row: null,
	aspect_ratio: null,
	seats: [],
	stuff: []
})

/** Места (dev) */
let seats = ref([])
/** Все номера мест */
let seats_numbers = ref([])
/** HTML автобуса */
let bus_el = ref()

// На изменение кол-ва рядов и мест в ряду всё очищаем и ставим нулевые места
watch([() => bus.value.rows, () => bus.value.seats_in_row], ([rows, seats_in_row], [old_rows, old_seats_in_row]) => {
	if (rows === old_rows) {
		seats.value = []
		seats_numbers.value = []
		bus.value.stuff = []
		for (let i = 0; i < rows * seats_in_row; i++) {
			seats.value.push({ number: '' })
		}
	}
	else if (rows > old_rows) {
		for (let i = 0; i < seats_in_row; i++) {
			seats.value.push({ number: '' })
		}
	}
	else {
		for (let i = 0; i < seats_in_row; i++) {
			seats.value.pop()
		}
	}
})

onMounted(() => watch(seats, value => {
	bus.value.seats = []
	let bus_rect = bus_el.value.getBoundingClientRect()

	value.forEach((seat, index) => {
		if (!seat.number) return

		let seat_el = document.getElementById(`seat-${index}`)
		let seat_rect = seat_el.getBoundingClientRect()
		bus.value.seats.push({
			number: seat.number,
			x: (seat_rect.x - bus_rect.x) / bus_rect.width, // часть от длины
			y: (seat_rect.y - bus_rect.y) / bus_rect.height, // часть от высоты
			width: seat_rect.width / bus_rect.width, // часть длины
			height: seat_rect.height / bus_rect.height, // часть высоты
		})
	})

	seats_numbers.value = value.filter(seat => seat.number).map(seat => seat.number)
	bus.value.stuff = bus.value.stuff.filter(seat => seats_numbers.value.includes(seat))
	bus.value.aspect_ratio = bus_rect.width / bus_rect.height
}, { deep: true }))

let valid = ref()
watch(bus, () => {
	valid.value = seats_numbers.value.length && (new Set(seats_numbers.value)).size === seats_numbers.value.length && bus.value.name && bus.value.author
}, { immediate: true, deep: true })

async function send() {
    let res = await useBus().createBus(bus.value)
	
	if (res.status === 200) {
		message.config({ duration: 0.5, top: '70vh' })
		message.success({
		  	content: 'Успешно!',
		  	onClose: () => router.back()
		})
	}
}

document.addEventListener('keydown', event => {
    if (!document.activeElement) return

	if (event.code === 'ArrowUp') {
		let id = 'seat-' + (Number(document.activeElement.id.split('-')[1]) - bus.value.seats_in_row)
        let input = document.getElementById(id)
		input?.focus()
    }
	if (event.code === 'ArrowRight') {
		let id = 'seat-' + (Number(document.activeElement.id.split('-')[1]) + 1)
        let input = document.getElementById(id)
		input?.focus()
    }
    if (event.code === 'ArrowDown') {
		let id = 'seat-' + (Number(document.activeElement.id.split('-')[1]) + bus.value.seats_in_row)
        let input = document.getElementById(id)
		input?.focus()
    }
	if (event.code === 'ArrowLeft') {
		let id = 'seat-' + (Number(document.activeElement.id.split('-')[1]) - 1)
        let input = document.getElementById(id)
		input?.focus()
    }
})
</script>

<template>
	<a-row type="flex" justify="center">
	<a-col :xs="22" :lg="16">
		<h2>Создать автобус</h2>
		
		<a-row class="mt-8" :gutter="[0, 8]">
			<a-col :xs="24" :lg="14">
				Название
				<a-input v-model:value="bus.name" placeholder="Сапсан"></a-input>
			</a-col>
			<a-col :xs="24" :lg="14">
				Автор
				<a-input v-model:value="bus.author" placeholder="Турагенство Галина"></a-input>
			</a-col>
			<a-col :xs="24" :lg="24">
				Кол-во рядов
				<a-input-number :min="1" placeholder="10" v-model:value="bus.rows"></a-input-number>
			</a-col>
			<a-col :xs="24" :lg="24">
				Кол-во мест в ряду
				<a-input-number :min="1" :max="6" placeholder="5" v-model:value="bus.seats_in_row"></a-input-number>
			</a-col>
			<a-col :xs="24" :lg="14">
				Служебные места
				<a-config-provider>
					<template #renderEmpty>
						<div style="text-align: center; color: black;">Нет номеров</div>
					</template>

					<div class="config-provider">
						<a-select
							v-model:value="bus.stuff"
							:options="seats_numbers.map(num => ({ value: num }))"
							mode="multiple"
							style="width: 100%;"
							placeholder="1, 2"
						/>
					</div>
				</a-config-provider>
			</a-col>

			<a-col :span="24" style="overflow: auto;" class="mt-16">
				<div id="bus" ref="bus_el" :style="{
					'grid-template-rows': `repeat(${bus.rows}, 1fr)`, 
					'grid-template-columns': `repeat(${bus.seats_in_row}, 1fr)`
				}">
					<input 
						v-for="index in _.range(bus.rows * bus.seats_in_row)"
						v-model="seats[index].number" 
						:id="`seat-${index}`"
						type="text"
						class="seat"
						autocomplete="off"
						:style="{
							border: seats[index].number ? '1px solid #555555' : '1px dashed #333333',
							background: seats[index].number ? bus.stuff.includes(seats[index].number) ? '#E87C64' : '#D9D9D9' : '#FFFFFF'
						}" 
					/>
					
					<div class="driver" />
				</div>
			</a-col>

			<a-col :span="24" class="mt-16">
				<a-button @click="send" class="lets_go_btn" :disabled="!valid">
					Отправить
				</a-button>
			</a-col>

			<a-col :spam="24" v-if="!valid" style="color: red;" class="mt-4">
				Недостаточно данных или есть повторы
			</a-col>
		</a-row>
	</a-col>
	</a-row>
</template>

<style lang="scss" scoped>
#bus {
	padding: 95px 14px 25px 14px;
	position: relative;
	display: grid;
	border-radius: 22px;
	border-width: 2.5px;
	border-style: solid;
	border-color: #8F8F8F;
	justify-items: center;
	min-width: 225px;
	max-width: 225px;
	min-height: 300px;
	width: auto;
	gap: 6px;
}
.seat {
	z-index: 100;
	transition: all .15s;
	font-weight: bold;
	font-size: 17px;
	text-align: center;
	width: 100%;
	max-width: 60px;
	min-width: 0;
	aspect-ratio: 1;
}
.driver { 
	position: absolute; 
	left: 25px; 
	top: 25px; 
	height: 53px; 
	width: 46px; 
	background: url(/driver-seat.svg) 50% 50% no-repeat; 
	background-size: cover;
}
</style>