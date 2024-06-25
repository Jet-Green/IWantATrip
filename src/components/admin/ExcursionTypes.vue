<script setup>
import { ref, onMounted } from "vue"
import { useAppState } from '../../stores/appState';

const appStateStore = useAppState()

let typeStr = ref("")
let directionTypeStr = ref("")
let directionPlace = ref("")

let types = ref([])
async function refreshTypes() {
  if (!appStateStore.appState[0].excursionTypes)
    await appStateStore.refreshState()

  let typesFromDb = appStateStore.appState[0].excursionTypes
  let treeData = []

  for (let i = 0; i < typesFromDb.length; i++) {
    treeData.push({
      title: typesFromDb[i].type,
      key: `${i}`,
      children: []
    })
    for (let j = 0; j < typesFromDb[i].direction.length; j++) {
      treeData[i].children.push({
        title: typesFromDb[i].direction[j].directionType,
        key: `${i}-${j}`,
        children: []
      })
      for (let k = 0; k < typesFromDb[i].direction[j].directionPlace.length; k++) {
        treeData[i].children[j].children.push({
          title: typesFromDb[i].direction[j].directionPlace[k],
          key: `${i}-${j}-${k}`
        })
      }
    }
  }
  types.value = treeData
}
async function deleteType(keyToDelete) {
  let t = types.value
  for (let i = 0; i < t.length; i++) {
    if (t[i].key == keyToDelete) {
      let res = await appStateStore.deleteExcursionType({ type: t[i].title })
      if (res.status == 200) {
        refreshTypes()
      }
      return
    }
    for (let j = 0; j < t[i].children.length; j++) {
      if (t[i].children[j].key == keyToDelete) {
        let res = await appStateStore.deleteExcursionType({ directionType: t[i].children[j].title })
        if (res.status == 200) {
          refreshTypes()
        }
        return
      }
      for (let k = 0; k < t[i].children[j].children.length; k++) {
        if (t[i].children[j].children[k].key == keyToDelete) {
          let res = await appStateStore.deleteExcursionType({ directionPlace: t[i].children[j].children[k].title })
          if (res.status == 200) {
            refreshTypes()
          }
          return
        }
      }
    }
  }
}

async function addType() {
  if (typeStr.value.trim().length == 0) return
  let res = await appStateStore.addExcursionType({ type: typeStr.value.trim(), directionType: directionTypeStr.value.trim(), directionPlace: directionPlace.value.trim() });
  if (res.status == 200) {
    await refreshTypes()
  }
}

onMounted(async () => {
  await refreshTypes()
})
</script>
<template>
  <a-col :span="24">
    <h3>Типы экскурсии</h3>
  </a-col>
  <a-row style="max-height: 50vh; overflow-y: scroll; margin: 0 0 16px 0;">
    <a-col :span="24">
      <a-tree :show-line="false" :tree-data="types" class="mt-16 mb-16" :selectable="false">
        <template #title="{ key, title }">
          <a-popconfirm title="Удалить?" ok-text="Да" cancel-text="Нет" @confirm="deleteType(key)">
            {{ title }}
          </a-popconfirm>
        </template>
      </a-tree>
    </a-col>
  </a-row>
  <a-row :gutter="[8, 8]">
    <a-col :span="24" :lg="8">
      Тип экскурсии
      <a-input placeholder="профориентация" size="large" v-model:value="typeStr" class="w-100">
      </a-input>
    </a-col>
    <a-col :span="24" :lg="8">
      Тип места
      <a-input placeholder="медицина" size="large" v-model:value="directionTypeStr" class="w-100">
      </a-input>
    </a-col>
    <a-col :span="24" :lg="8">
      Место
      <a-input placeholder="поликлиника" size="large" v-model:value="directionPlace" class="w-100"></a-input>
    </a-col>
    <a-col :span="24" class="d-flex justify-center">
      <a-button @click="addType" type="primary" class="lets_go_btn">отправить</a-button>
    </a-col>
  </a-row>
</template>