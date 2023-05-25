<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";


let props = defineProps({
  search: String,
});

let router = useRouter();

// let where = ref("");
let time = ref(null);
let query = ref("");

let loading = ref(false)




// let locations = computed(() => {
//   let result = [];
//   // проблема, надо получить направления и посчитать на сервере, мы не будем загружать все на клиента
//   for (let t of tripStore.trips) {
//     if (t.location == "") {
//       continue;
//     }
//     result.push(t.location.toLowerCase());
//   }
//   // получаем уникальные значения
//   return [...new Set(result)];
// });

let visible = ref(false);

function find() {
  tripStore.searchTrips(query.value,  {
    start: time.value ? time.value[0].$d.getTime() : "",
    end: time.value ? time.value[1].$d.getTime() : "",
  });
}

watch(query, (newQuery) => {
  newQuery = newQuery.trim()
  if (newQuery.length > 2) {
    find();
  }
});

onMounted(() => {


  if (props.search) {
    query.value = props.search;
  }
  if (query.value  && time.value) {
    tripStore.searchTrips(query.value, {
      start: time.value ? time.value[0].$d.getTime() : null,
      end: time.value ? time.value[1].$d.getTime() : null,
    });
  }
});
</script>
<template>
  <a-row type="flex" justify="center" align="middle" class="section_bg pa-16">
    <a-col :xs="22" :md="12">
      <a-row class="mb-8" type="flex" justify="center">
        <a-col :xs="24" :md="12" class="d-flex">
          <a-input-search v-model:value="query" placeholder="поиск" enter-button style="z-index: 0" @search="find()" />
          <span class="mdi mdi-24px mdi-filter-outline ml-16" :class="{ active_filter: visible, filter: !visible }"
            @click="visible = !visible"></span>
        </a-col>
      </a-row>
      <Transition name="fade">
        <div v-if="visible">
          <!-- <a-row type="flex" justify="center">
            <a-col :xs="24" :md="12">
              <a-select style="width: 100%" v-model:value="where" :bordered="true" class="selector">
                <a-select-option value=""> </a-select-option>
                <a-select-option v-for="(l, index) of locations" :value="l" :key="index">
                  {{ l }}
                </a-select-option>
              </a-select>
            </a-col>
          </a-row> -->
          <a-row type="flex" justify="center" class="mt-16">
            <a-col :xs="24" :md="12">
              <a-range-picker style="width: 100%" v-model:value="time" />
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" class="mt-8">
            <a-button @click="find" type="primary">поиск</a-button>
          </a-row>
        </div>
      </Transition>
    </a-col>
  </a-row>
</template>

<style lang="scss" scoped>
.section_bg {
  background: rgba(67, 65, 79);
}

.active_filter {
  color: #ff6600;
  cursor: pointer;
}

.filter {
  color: white;
  cursor: pointer;
}
</style>
