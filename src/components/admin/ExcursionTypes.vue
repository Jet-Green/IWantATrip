<script setup>
import { ref, onMounted } from "vue"
import { useAppState } from '../../stores/appState';

const appStateStore = useAppState()

let typeStr = ref("")
let directionTypeStr = ref("")
let directionPlaceStr = ref("")

let types = ref([])

async function addType() {
  let res = await appStateStore.addExcursionType({ type: typeStr.value, directionType: directionTypeStr.value, directionPlace: directionPlaceStr.value });
  console.log(res);
}

onMounted(() => {
  types.value = appStateStore.appState[0].excursionTypes
})
</script>
<template>
  <a-row :gutter="[8, 8]">
    <a-col :span="24" :lg="8">
      <a-auto-complete placeholder="Тип экскурсии" size="large" v-model:value="typeStr" :options="types" class="w-100">
        <template #option="item">
          {{ item.type }}
        </template>
      </a-auto-complete>
    </a-col>
    <a-col :span="24" :lg="8">
      <a-auto-complete placeholder="Тип места" size="large" v-model:value="directionTypeStr"
        class="w-100"></a-auto-complete>
    </a-col>
    <a-col :span="24" :lg="8">
      <a-auto-complete placeholder="Место" size="large" v-model:value="directionPlaceStr"
        class="w-100"></a-auto-complete>
    </a-col>
    <a-button @click="addType">добавить</a-button>
  </a-row>
</template>
<style scoped lang="scss">
.w-100 {
  width: 100%;
}
</style>