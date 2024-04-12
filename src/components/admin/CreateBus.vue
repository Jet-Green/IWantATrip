<script setup>
import { ref, watch } from 'vue';
import _ from 'lodash'

let bus = ref({
	name: '',
	author: '',
	rows: null,
	seats_in_row: null,
	aspect_ratio: null,
	stuff: []
})

let seats = ref([])
let seats_numbers = ref([])
let result = ref([])
let bus_el = ref()

watch([() => bus.value.rows, () => bus.value.seats_in_row], ([rows, seats_in_row]) => {
	seats.value = []
	seats_numbers.value = []
	bus.value.stuff = []
	for (let i = 0; i <= rows * seats_in_row; i++) {
		seats.value.push({ number: '' })
	}
})

watch(seats, value => {
	result.value = []
	let bus_rect = bus_el.value.getBoundingClientRect()

	value.forEach((seat, index) => {
		if (!seat.number) return

		let seat_el = document.getElementById('seat-'+index)
		let seat_rect = seat_el.getBoundingClientRect()
		result.value.push({
			number: seat.number,
			x: (seat_rect.x - bus_rect.x) / bus_rect.width,
			y: (seat_rect.y - bus_rect.y) / bus_rect.height,
			width: seat_rect.width / bus_rect.width,
			height: seat_rect.height / bus_rect.height,
		})
	})

	seats_numbers.value = value.filter(seat => seat.number).map(seat => seat.number)
	bus.value.stuff = bus.value.stuff.filter(seat => seats_numbers.value.includes(seat))
	bus.value.aspect_ratio = bus_rect.width / bus_rect.height
}, { deep: true })
</script>

<template>
	<a-row type="flex" justify="center">
	<a-col :xs="22" :lg="16">
		<h2>Создать автобус</h2>
		
		<a-row class="mt-8" :gutter="[0, 8]">
			<a-col :span="14">
				Название
				<a-input v-model:value="bus.name" placeholder="Сапсан"></a-input>
			</a-col>
			<a-col :span="14">
				Автор
				<a-input v-model:value="bus.author" placeholder="Турагенство Галина"></a-input>
			</a-col>
			<a-col :span="24">
				Кол-во рядов
				<a-input-number min="1" v-model:value="bus.rows"></a-input-number>
			</a-col>
			<a-col :span="24">
				Кол-во мест в ряду
				<a-input-number min="1" max="5" v-model:value="bus.seats_in_row"></a-input-number>
			</a-col>
			<a-col :span="14">
				Служебные места
				<a-select
					v-model:value="bus.stuff"
					:options="seats_numbers.map(num => ({ value: num }))"
					mode="multiple"
					style="width: 100%;"
					placeholder="1, 2"
				></a-select>
			</a-col>

			<a-col :span="24" style="overflow: auto;" class="mt-16">
				<div class="background" ref="bus_el" :style="`grid-template-rows: repeat(${bus.rows}, 1fr); grid-template-columns: repeat(${bus.seats_in_row}, 1fr);`" id="bus">
					<input 
						v-for="index in _.range(bus.rows * bus.seats_in_row)"
						v-model="seats[index].number" 
						:id="`seat-${index}`"
						type="text"
						class="seat"
						autocomplete="off"
						:style="`border: ${seats[index].number ? '1px solid #555555' : '1px dashed #333333'};
								 background: ${seats[index].number ? bus.stuff.includes(seats[index].number) ? '#E87C64' : '#D9D9D9' : '#FFFFFF'};
						`" 
					/>
					
					<div style="
						position: absolute; 
						left: 25px; 
						top: 25px; 
						height: 53px; 
						width: 46px; 
						background: url(/driver-seat.svg) 50% 50% no-repeat; 
						background-size: cover;
					" />
				</div>
			</a-col>
			<a-col :span="24">
				{{ bus }}

				{{ seats_numbers }}
				
				{{ result }}
			</a-col>
		</a-row>
	</a-col>
	</a-row>
</template>

<style lang="scss" scoped>
.background {
	border-radius: 24px;
	border-width: 2.5px;
	border-style: solid;
	border-color: #8F8F8F;
}
#bus {
	padding: 95px 14px 25px 14px;
	position: relative;
	display: grid;
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
	aspect-ratio: 1;
}
</style>