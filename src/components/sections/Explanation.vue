<script setup>
import { reactive } from 'vue'

const cards = reactive([
  {
    title: 'Создайте свой тур',
  },
  {
    title: 'Выберите тур',
  },
  {
    title: 'Найдите попутчиков для путешествия',
  },
  {
    title: 'Гид по вашему городу',
  },
])

</script>
<template>
  <a-row style="display: flex; justify-content: center">
    <a-col>
      <a-typography-title :level="1">
        Удобная платформа для путешествий!
      </a-typography-title>
    </a-col>
  </a-row>
  <a-row type="flex" justify="space-between">
    <a-col style="justify-content: center" v-for="(card, index) in cards" :xs="24" :sm="12" :md="6" class="pa-16">
      <a-col style="display: flex; justify-content: center;">
        <img style="border-radius: 20px; width: 100%"
          src="https://themiscochat.com/wp-content/uploads/2022/04/couple-relaxing-beach-vacation.webp " />
      </a-col>
      <a-col style="text-align: center;" class="mr-16 ml-16">
        <a-typography-title :level="4"> {{ card.title }} </a-typography-title>
      </a-col>
    </a-col>

  </a-row>
</template>
