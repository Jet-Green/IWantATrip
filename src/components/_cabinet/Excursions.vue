<script setup>
import { ref, onMounted, computed } from 'vue'
import ExcursionCard from './ExcursionCard.vue';

import { useExcursion } from '../../stores/excursion'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute();

const excursionStore = useExcursion()


let excursions = ref([])
let query = ref('')
let filteredExcursion = computed(() => {
  if (query.value.length > 2) {
    localStorage.setItem("excursionQuery", query.value);
    return excursions.value.filter((excursion) => excursion.name.toLowerCase().includes(query.value.toLowerCase())
      || excursion.description.toLowerCase().includes(query.value.toLowerCase())
      || excursion.excursionType.type.toLowerCase().includes(query.value.toLowerCase())
      || excursion.excursionType.directionType.toLowerCase().includes(query.value.toLowerCase())
      || excursion.excursionType.directionPlace.toLowerCase().includes(query.value.toLowerCase())

    )
  } else {
    localStorage.setItem("excursionQuery", '');
    return excursions.value
  }

})



async function updateExcursion() {
  let response = await excursionStore.getUserExcursions()
  excursions.value = response.data
}

onMounted(async () => {
  query.value = localStorage.getItem("excursionQuery") ?? '';
  await updateExcursion()
})
</script>
<template>
  <div>

    <div class="pa-8">
      <div
        class="ma-8"
        style="max-width: 680px; color: rgba(0, 0, 0, 0.65); font-size: 15px; line-height: 1.45;"
      >
        <ol style="margin: 0; padding-left: 18px;">
          <li>
            Экскурсии <b>без дат</b> — их невозможно оплатить, только заказать.
          </li>
          <li>
            Экскурсии <b>с добавленными датами</b> — пользователь сможет оплатить только после набора порогового количества людей.
            После этого у вас появится кнопка <b>«Выставить счет всем участникам экскурсии»</b>.
          </li>
        </ol>
      </div>

      <div style="display: flex; justify-content: space-between; flex-wrap: wrap; align-items: center;">
        <a-button class="btn_light ma-8" @click="router.push('/create-excursion')">
          создать экскурсию
        </a-button>

        <a-input v-model:value="query" placeholder="поиск" style="width:180px" class="ma-8" />
      </div>
    </div>
    <a-row :gutter="[8, 8]">
      <a-col v-for="excursion in filteredExcursion" :span="24" :sm="12" :lg="8">
        <ExcursionCard :excursion="excursion" @updateExcursion="updateExcursion" />
      </a-col>
     
    </a-row>
  </div>
</template>