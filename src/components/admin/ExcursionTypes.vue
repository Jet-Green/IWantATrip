<script setup>
import { ref, onMounted } from "vue"
import { useAppState } from '../../stores/appState';

const appStateStore = useAppState()

let typeStr = ref("")
let directionTypeStr = ref("")
let directionPlace = ref("")

let types = ref([])

async function addType() {
  let res = await appStateStore.addExcursionType({ type: typeStr.value, directionType: directionTypeStr.value, directionPlace: directionPlace.value });
  console.log(res);
}
onMounted(() => {
  let typesFromDb = appStateStore.appState[0].excursionTypes
  types.value = typesFromDb
})
</script>
<template>
  <a-row class="pr-16">
    <a-col :span="8">
      <h3>
        Тип
      </h3>
    </a-col>
    <a-col :span="8">
      <h3>
        Тип места
      </h3>
    </a-col>
    <a-col :span="8">
      <h3>
        Место
      </h3>
    </a-col>
  </a-row>
  <a-row class="mt-16 mb-16">
    <a-col :span="24" class="bold-text pt-16 pb-16" style="max-height: 50vh; overflow-y: scroll;">
      <a-row v-for="(t, index) of types" :key="index">
        <a-col :span="24">
          <a-row>
            <a-col :span="8">
              <b>
                {{ t.type }}
              </b>
            </a-col>
            <a-col :span="16">
              <a-row v-for="(d, index) of t.direction" :key="index">
                <a-col :span="12">
                  {{ d.directionType }}
                </a-col>
                <a-col :span="12">
                  <a-tag v-for="(place, index) of d.directionPlace" :key="index" class="tag">{{ place }}</a-tag>
                </a-col>
                <a-divider v-if="index != t.direction.length - 1" style="height: 1px; margin: 10px 0;"></a-divider>
              </a-row>
            </a-col>
          </a-row>
        </a-col>
        <a-divider v-if="index != types.length - 1" style="height: 1px; margin: 15px 0;"></a-divider>
      </a-row>
    </a-col>
  </a-row>
  <a-row :gutter="[8, 8]">
    <a-col :span="24" :lg="8">
      Тип экскурсии
      <a-input placeholder="Профориентация" size="large" v-model:value="typeStr" class="w-100">
      </a-input>
    </a-col>
    <a-col :span="24" :lg="8">
      Тип места
      <a-input placeholder="Медицина" size="large" v-model:value="directionTypeStr" class="w-100">
      </a-input>
    </a-col>
    <a-col :span="24" :lg="8">
      Место
      <a-input placeholder="Поликлиника" size="large" v-model:value="directionPlace" class="w-100"></a-input>
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

.bold-text {
  font-weight: 500;
  font-size: clamp(0.9375rem, 0.8381rem + 0.2841vw, 1.0625rem);
}
.tag {
  border-radius: 6px;
  margin: 2px;
  user-select: none;
}
</style>