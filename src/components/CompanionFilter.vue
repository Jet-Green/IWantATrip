<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { useTrips } from "../stores/trips";



const tripsStore = useTrips();

let router = useRouter();

let where = ref("");
let time = ref(null);


let visible = ref(false);

let query = ref("");

function find() {
  tripsStore.searchTrips(query.value, where.value, {
    start: time.value ? time.value[0].$d.getTime() : "",
    end: time.value ? time.value[1].$d.getTime() : "",
  });
}

watch(query, (newQuery) => {
  if (newQuery == "") {
    find();
  }
});
watch(where, (newPlace) => {
  find();
});

onMounted(() => {

});
</script>
<template>
  <a-row>
    <a-col :xs="24">
      <a-row type="flex" justify="center">
        <a-col :xs="24" class="d-flex">
          <a-input-search v-model:value="query" placeholder="поиск" enter-button style="z-index: 0" @search="find()" />
          <span class="mdi mdi-24px mdi-filter-outline ml-16" :class="{ active_filter: visible, filter: !visible }"
            @click="visible = !visible"></span>

        </a-col>
     
      </a-row>
      <Transition name="fade">
        <div v-if="visible">
          <a-row type="flex" justify="center">
            <a-col :xs="24">
              <label for="gender">пол</label>
              <a-select name="gender" style="width: 100%" v-model:value="where" :bordered="true"
               class="selector">
                <a-select-option value=""> </a-select-option>
                <a-select-option v-for="(l, index) of ['Мужчину', 'Женщину', 'Не важно']" :value="l" :key="index">
                  {{ l }}
                </a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" >
            <a-col :xs="24">
              <label for="age">возраст</label>
              <div name="age" class="d-flex align-en">
                от <a-input type="number" :min="0"  />
                до <a-input type="number" :min="0" />
              </div>
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" >
            <a-col :xs="24">
              <label for="data">дата</label>
              <a-range-picker name="data" style="width: 100%" v-model:value="time" />
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" class="mt-8">
            <a-button @click="find" class="lets_go_btn" type="primary">поиск</a-button>
          </a-row>
        </div>
      </Transition>
    </a-col>
  </a-row>
</template>

<style lang="scss" scoped>
.active_filter {
  color: #ff6600;
  cursor: pointer;
}

.filter {
  color: #227597;
  cursor: pointer;
}
label{
  font-size:8px;
}
</style>
