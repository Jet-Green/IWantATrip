<script setup>
import { ref, onMounted, watch, computed, reactive } from "vue";

import "@vuepic/vue-datepicker/dist/main.css";

import { useAppState } from "../../stores/appState.js";

const appStateStore = useAppState()




let isFilterShow = ref(false);
let query = ref("");
function showFilter() {
  isFilterShow.value = true
}
function hideFilter() {
  isFilterShow.value = false
}

function find() {

}
function resetForm() {
  
}



let filterString = computed(() => {
  // let keyString = ''
  // let excFilter = excursionStore.excursionFilter
  // for (let key in excFilter) {
  //   if (key == 'start' && excFilter[key] ) {
  //     keyString = keyString + `c ${clearData(excFilter[key])}, ` 
  //     continue;
  //   }


  //   if (excFilter[key]) {

  //     keyString = keyString + `${excFilter[key]}, ` 
  //   }
  // }
  // return keyString.trim().slice(0, -1)
})

let buttonTitle = computed(() => {
  return  filterString.value? filterString.value: "Что, где?"
}
)





onMounted(async () => {

  // await appStateStore.refreshState();



});
</script>

<template>

  <a-row class="d-flex justify-center">
    <a-col :xs="24" :lg="12" :md="16" class="pa-16">
      <div style="background: #239fca; padding: 10px; border-radius: 12px; display: flex; align-items: center">
        <div color="#239FCA" @click="showFilter" class="filter-button" type="button">
          {{ buttonTitle }}
        </div>

        <!-- Если будет что-то в фильтре показывать  -->
        <a-button type="primary" shape="circle" class="ml-8" v-if="filterString" @click="resetForm">
          <span class="mdi mdi-close"></span>
        </a-button>
      </div>
    </a-col>
  </a-row>


  <a-modal v-model:open="isFilterShow" title="Поиск места" :zIndex=900>



    <a-row :gutter="[8, 8]" class="d-flex justify-center flex-wrap">
      <a-col :span="24" class="d-flex direction-column">


        <a-input v-model:value="query" placeholder="название, содержание?" name="search"
          style="z-index: 0; width: 100%; margin-bottom: 6px" />

      </a-col>
      <a-col :span="24">
        локация
      </a-col>
      <a-col :span="24">
        категория
      </a-col>


    </a-row>





    <template #footer>
      <a-button key="submit" style="border-radius: 18px" type="primary"
        @click="hideFilter(), find()">Показать</a-button>
      <a-button key="back" style="border-radius: 18px" @click="resetForm(), hideFilter()">Очистить</a-button>
    </template>
  </a-modal>
</template>

<style lang="scss" scoped>
// .section_bg {
//   background: rgba(67, 65, 79);
// }

.active_filter {
  color: #ff6600;
  cursor: pointer;
}

.filter {
  color: #227597;
  cursor: pointer;
}

.filter-button {
  background: white;
  border-color: #239fca;
  border-radius: 8px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.7);
}
</style>
