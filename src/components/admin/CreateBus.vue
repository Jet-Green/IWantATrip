<script setup>
import { onMounted, ref, watch } from 'vue';

let bus = ref({
	name: '',
	author: '',
	width: 800, // cm
	height: 255, // cm
})

let seat_size = ref({
	width: 45, // cm
	height: 45 // cm
})

let spawn = {
	x: 40, // cm
	y: 40 // cm
}

let seats = ref(localStorage.getItem('seats') ? JSON.parse(localStorage.getItem('seats')) : [])

let active_seat_id = ref()
let active_seat = seats[seats.value.findIndex(seat => seat._id === active_seat_id.value)]
let current_seat_number = ref()

function createSeat() {
	seats.value.push(
		Object.assign({ 
			_id: generateId(), 
			number: current_seat_number.value, 
			width: seat_size.value.width, 
			height: seat_size.value.height 
		}, spawn)
	)

	current_seat_number.value = null
}

function generateId() {
	return (Math.random() + 1).toString(36).substring(2)
} 

function mouseDown() {
	console.log('dfgdfg')
}

onMounted(() => {
	watch(seats, async value => {
		localStorage.setItem('seats', JSON.stringify(value))
		let container = document.getElementById('container')
		await new Promise(r => setTimeout(r, 100))
		value.forEach(seat_object => {
			let seat = document.getElementById(seat_object._id)
	
			seat.onmousedown = function(event) {
				let shiftX = event.clientX - seat.getBoundingClientRect().left
				let shiftY = event.clientY - seat.getBoundingClientRect().top
	
				moveAt(event.pageX, event.pageY)
	
				function moveAt(pageX, pageY) {
					let x = pageX - container.getBoundingClientRect().x - shiftX
					let y = pageY - container.getBoundingClientRect().y - shiftY
					seat.style.left = x + 'px'
					seat.style.top = y + 'px'
					seats.value[seats.value.findIndex(seat => seat._id === seat_object._id)].x = x
					seats.value[seats.value.findIndex(seat => seat._id === seat_object._id)].y = y
				}
	
				function onMouseMove(event) {
					moveAt(event.pageX, event.pageY)
				}
				document.addEventListener('mousemove', onMouseMove)
				seat.onmouseup = function() {
					document.removeEventListener('mousemove', onMouseMove)
					seat.onmouseup = null
				}
			}
			seat.ondragstart = function() {
				return false
			}
		})
	}, { deep: true, immediate: true })
})
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
					Длина автобуса
					<a-input-number min="200" v-model:value="bus.width"></a-input-number>
					см
				</a-col>
				<a-col :span="24">
					Ширина автобуса
					<a-input-number min="100" v-model:value="bus.height"></a-input-number>
					см
				</a-col>
				<a-col :span="24">
					Размер создаваемого места (ДхШ):

					<a-input-number v-model:value="seat_size.width" />
					см 
					<a-input-number v-model:value="seat_size.height" />
					см
				</a-col>
				<a-col :span="24">
					<a-row align="bottom" :gutter="[10, 0]">
						<a-col :span="10">
							Номер
							<a-input v-model:value="current_seat_number" placeholder="10A"></a-input>
						</a-col>
						<a-col :span="10">
							<a-button 
								@click="createSeat" 
								class="lets_go_btn" 
								:disabled="active_seat_id || !current_seat_number"
							>
								Создать
							</a-button>
						</a-col>
					</a-row>
				</a-col>
				<a-col :span="24">
					<a-button :disabled="!active_seat_id">Удалить место</a-button>
				</a-col>
				

				<a-col :span="24" style="overflow: auto;" class="mt-16">
					<div :style="`position: relative; width: ${bus.width}px; height: ${bus.height}px;`" id="container">
						<div 
							v-for="seat in seats" 
							:id="seat._id" 
							:style="`
								background: #D9D9D9; 
								z-index: 1000; 
								position: absolute; 
								display: flex;
								flex-direction: row;
								justify-content: center;
								font-weight: bold;
								font-size: 17px;
								cursor: pointer;
								align-items: center;
								top: ${seat.y}px; 
								left: ${seat.x}px; 
								width: ${seat.width}px; 
								height: ${seat.height}px;
						`">
							{{ seat.number }}
						</div>
						
						<div 
							style="
								position: absolute; 
								bottom: 25px; 
								left: 30px; 
								width: 53px; 
								height: 46px; 
								background: url(/driver-seat.svg) 50% 50% no-repeat; 
								background-size: cover;
							" 
							width="53" 
							height="46" 
						/>
						<div class="background" style="position: absolute; top: 0; right: 0; bottom: 0; left: 0;"></div>
					</div>
				</a-col>
			</a-row>
		</a-col>
	</a-row>
</template>

<style lang="scss" scoped>
.background {
	box-sizing: border-box;
	border-radius: 24px;
	border-width: 2.5px;
	border-style: solid;
	border-color: #8F8F8F;
}
</style>