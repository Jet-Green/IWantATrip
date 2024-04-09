<script setup>
import { ref, watch } from 'vue';

let bus = ref({
	name: '',
	author: '',
	rows: null,
	seats_in_row: null,
	stuff: []
})

let seats = ref([])
let result = ref([])
let bus_el = ref()

watch([() => bus.value.rows, () => bus.value.seats_in_row], ([rows, seats_in_row]) => {
	seats.value = []
	for (let i = 0; i <= rows * seats_in_row; i++) {
		seats.value.push({ number: '' })
	}
})

watch(seats, value => {
	result.value = []
	value.forEach((seat, index) => {
		if (!seat.number) return

		let seat_el = document.getElementById('seat-'+index)
		result.value.push({
			number: seat.number,
			x: (seat_el.getBoundingClientRect().x - bus_el.value.getBoundingClientRect().x) / bus_el.value.getBoundingClientRect().width,
			y: (seat_el.getBoundingClientRect().y - bus_el.value.getBoundingClientRect().y) / bus_el.value.getBoundingClientRect().height,
			width: seat_el.getBoundingClientRect().width / bus_el.value.getBoundingClientRect().width,
			height: seat_el.getBoundingClientRect().height / bus_el.value.getBoundingClientRect().height,
		})
	})
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
				<a-input-number min="1" v-model:value="bus.seats_in_row"></a-input-number>
			</a-col>

			<a-col :span="24" style="overflow: auto;" class="mt-16">
				<div class="background" ref="bus_el" :style="`position: relative; grid-template-rows: repeat(${bus.rows}, 1fr); grid-template-columns: repeat(${bus.seats_in_row}, 1fr);`" id="bus">
					<input 
						v-for="index in bus.rows * bus.seats_in_row"
						v-model="seats[index-1].number" 
						:id="'seat-' + (index-1)"
						type="text"
						:style="`
							z-index: 100;
							transition: all .15s;
							border: ${seats[index-1].number ? '1px solid #555555' : '1px dashed #333333'};
							background: ${seats[index-1].number ? '#D9D9D9' : '#FFFFFF'}; 
							font-weight: bold;
							font-size: 17px;
							text-align: center;
							min-height: 30px;
							width: 100%;
							height: 100%;
					`" />
					
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
			{{ result }}
			<a-col :span="24">

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
	display: grid;
	min-width: 225px;
	max-width: 225px;
	min-height: 600px;
	width: auto;
	gap: 6px;
}
</style>