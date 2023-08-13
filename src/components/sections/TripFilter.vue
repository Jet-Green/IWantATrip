<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useTrips } from '../../stores/trips.js'

import dayjs from "dayjs";
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";
import 'dayjs/locale/ru';
dayjs.locale('ru');

const ruLocale = locale;

let props = defineProps({
  search: String,
});

const router = useRouter();
const tripStore = useTrips();

let time = ref(null);
let query = ref("");

let loading = ref(false)

let visible = ref(false);

function find() {
  query.value = query.value.trim()
  console.log("find")
  tripStore.searchCursor = 1
  tripStore.filteredTrips = []
  tripStore.cursor = 1
  tripStore.trips = []
  tripStore.fetchTrips(
    query.value,
    time.value ? time.value[0].$d.getTime() : "",
    time.value ? time.value[1].$d.getTime() : "",
  );
}


onMounted(() => {
  if (props.search) {
    query.value = props.search;
  }

});
</script>
<template>
  <a-row type="flex" justify="center" align="middle" class="section_bg ">
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
          <a-row type="flex" justify="center" class="mt-16">
            <a-col :xs="24" :md="12">
              <a-range-picker style="width: 100%" v-model:value="time" :locale="ruLocale" />
            </a-col>
          </a-row>
          <a-row type="flex" justify="center" class="mt-8">
            <a-button @click="find" type="primary" class="lets_go_btn">поиск</a-button>
          </a-row>
        </div>
      </Transition>
    </a-col>
  </a-row>
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
</style>
