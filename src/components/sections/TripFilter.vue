<script setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useTrips } from "../../stores/trips";

let props = defineProps({
  search: String,
});

let router = useRouter();
let where = ref(null);
let how = ref(null);
let time = ref(null);
let visible = ref(false);

let query = ref("");

function find() {
  useTrips().searchTrips(query.value);
}

watch(query, (newQuery) => {
  if (newQuery == "") {
    find("");
  }
});

onMounted(() => {
  if (props.search) {
    query.value = props.search;
  }
  useTrips().searchTrips(query.value);
});
</script>
<template>
  <a-row type="flex" justify="center" align="middle" class="section_bg pa-16">
    <a-col :xs="22" :md="12">
      <a-row class="ma-8" type="flex" justify="center">
        <a-col :xs="24" :md="12" class="d-flex">
          <a-input-search
            v-model:value="query"
            placeholder="поиск"
            enter-button
            style="z-index: 0"
            @search="find()"
          />
          <span
            class="mdi mdi-24px mdi-filter-outline ml-16"
            :class="{ active_filter: visible, filter: !visible }"
            @click="visible = !visible"
          ></span>
        </a-col>
      </a-row>
      <Transition name="fade">
        <a-row :gutter="[8, 8]" type="flex" justify="center" v-if="visible">
          <a-col :xs="12">
            <a-select
              style="width: 100%"
              placeholder="Куда едем"
              v-model:value="where"
              :bordered="true"
              size="large"
              class="selector"
            >
              <a-select-option value="1"> Туда </a-select-option>
            </a-select>
          </a-col>

          <a-col :xs="12">
            <a-select
              style="width: 100%"
              placeholder="Как едем"
              v-model:value="how"
              :bordered="true"
              size="large"
              class="selector"
            >
              <a-select-option value="1"> Так </a-select-option>
            </a-select>
          </a-col>

          <a-col :xs="12">
            <a-select
              style="width: 100%"
              placeholder="На сколько"
              v-model:value="time"
              :bordered="true"
              size="large"
              class="selector"
            >
              <a-select-option value="1"> На столько </a-select-option>
            </a-select>
          </a-col>

          <a-col :xs="12">
            <a-select
              style="width: 100%"
              placeholder="На сколько"
              v-model:value="time"
              :bordered="true"
              size="large"
              class="selector"
            >
              <a-select-option value="1"> На столько </a-select-option>
            </a-select>
          </a-col>
        </a-row>
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
