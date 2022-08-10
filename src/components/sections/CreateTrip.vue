<script setup>
import { useRouter } from 'vue-router'

let router = useRouter()
</script>
<template>
  <a-row type="flex" justify="center" class="create_trip_bg pt-16 pb-16">
    <a-col :xs="22" :lg="16">
      <a-row type="flex" justify="space-between">
        <a-col :xs="{ span: 20, offset: 2 }" :md="12" :lg="8">
          <img src="https://themiscochat.com/wp-content/uploads/2022/04/couple-relaxing-beach-vacation.webp" />
        </a-col>

        <a-col :xs="{ span: 20, offset: 2 }" :md="{ span: 6, offset: 3 }">
          <h2>Создай свой тур</h2>
          <p>Твой тур - твои правила</p>
          <a-button type="primary" class="lets_go_btn" @click="router.push('/create')">Создать</a-button>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>
<style scoped>
.create_trip_bg {
  background: #f7f7f7;
  min-height: 25vh;
}

.col {
  display: flex;
  flex-direction: column;
}

/* 
Зачем так сложно?
.col :nth-child(2n + 1) {
  margin: 0px;
} */

img {
  /* Картинку штырит, лучше, чтобы она была 100% ширины родителя. А высота сама поставится
    width: 25vw;
    height: 29vh;
  */
  width: 100%;
  aspect-ratio: 18/10;
  border-radius: 25px;
}
</style>
