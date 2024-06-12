<script setup>
import { ref, onMounted } from "vue"
import { useAppState } from '../../stores/appState';

const appStateStore = useAppState()

let typeStr = ref("")
let directionTypeStr = ref("")
let directionPlace = ref("")

let types = ref([])
let currentDirectionTypes = ref([])

function selectType(selected) {
  directionTypeStr.value = ''
  currentDirectionTypes.value = []
  for (let t of types.value) {
    if (t.value == selected) {
      currentDirectionTypes.value = t.direction.map((el) => { return { value: el.directionType, directionPlace: el.directionPlace } })
      break
    }
  }
}
function selectDirectionType(selected) {
  for (let dirType of currentDirectionTypes.value) {
    if (dirType.value == selected) {
      directionPlace.value = dirType.directionPlace
      break
    }
  }
}

async function addType() {
  let res = await appStateStore.addExcursionType({ type: typeStr.value, directionType: directionTypeStr.value, directionPlace: directionPlace.value });
  console.log(res);
}
onMounted(() => {
  let typesFromDb = appStateStore.appState[0].excursionTypes
  types.value = typesFromDb.map((el) => { return { value: el.type, direction: el.direction } })
})
</script>
<template>
  <a-row :gutter="[8, 8]">
    <a-col :span="24" :lg="8">
      Тип экскурсии
      <a-auto-complete placeholder="Профориентация" size="large" v-model:value="typeStr" :options="types" class="w-100"
        :filterOption="true" @select="selectType" @change="directionTypeStr = ''; directionPlace = ''">
      </a-auto-complete>
    </a-col>
    <a-col :span="24" :lg="8">
      Тип места
      <a-auto-complete placeholder="Медицина" size="large" v-model:value="directionTypeStr" class="w-100"
        :options="currentDirectionTypes" @select="selectDirectionType" @change="() => directionPlace = ''">
        <template #option="item">
          {{ item.value || 'пусто' }}
        </template>
      </a-auto-complete>
    </a-col>
    <a-col :span="24" :lg="8">
      Место
      <a-input placeholder="Поликлиника" size="large" v-model:value="directionPlace"
        class="w-100"></a-input>
    </a-col>
    <a-col :span="24" class="d-flex justify-center">
      <a-button @click="addType" type="primary" class="lets_go_btn">отправить</a-button>
    </a-col>
  </a-row>
</template>
<style scoped lang="scss">
.w-100 {
  width: 100%;
}
</style>