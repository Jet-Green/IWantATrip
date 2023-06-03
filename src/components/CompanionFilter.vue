<script setup>
import { ref, onMounted, watch, reactive } from "vue";
import { useRouter } from "vue-router";
import { useCompanions } from "../stores/companions";

const companionStore = useCompanions();
let router = useRouter();
let visible = ref(false);
let date = ref(null)
let query = reactive({
  strQuery: "",
  gender: "",
  age: {
    start: "",
    end: ""
  },
  start: "",
  end: "",

})


function find() {
  query.strQuery = query.strQuery.trim()
  if (query.strQuery.length == 0 || query.strQuery.length > 2) {
    companionStore.fetchCompanions(query);
  }
}

watch(query, () => {
  if (query.strQuery == "" || query.gender == "" || query.age.start || query.age.end || query.start || query.end) {
    find();
  }
});
watch(date, (newDate) => {
  query.start = newDate ? date.value[0].$d.getTime() : ""
  query.end = newDate ? date.value[1].$d.getTime() : ""
});

onMounted(() => {
  find()
});
</script>
<template>
  <a-row>

    <a-col :xs="24">
      <a-row type="flex" justify="center">
        <a-col :xs="24" class="d-flex">
          <a-input-search v-model:value="query.strQuery" placeholder="поиск" enter-button style="z-index: 0"
            @search="find()" />
          <span class="mdi mdi-24px mdi-filter-outline ml-16" :class="{ active_filter: visible, filter: !visible }"
            @click="visible = !visible"></span>
        </a-col>

      </a-row>
    </a-col>
    <a-col :xs="24">
      <Transition name="fade">
        <div v-if="visible">
          <a-row class="d-flex justify-center direction-column" :gutter="[4, 4]">
            <a-col :xs="24" class="d-flex direction-column">
              <label for="gender">пол</label>
              <a-select name="gender" v-model:value="query.gender" :bordered="true" class="selector" style="width:100%">
                <a-select-option value=""> </a-select-option>
                <a-select-option v-for="(l, index) of ['Мужчина', 'Женщина']" :value="l" :key="index">
                  {{ l }}
                </a-select-option>
              </a-select>
            </a-col>
            <a-col :xs="24" class="d-flex direction-column">
              <label for="age">возраст</label>
              <div name="age" class="d-flex align-center label">
                от <a-input type="number" v-model:value="query.age.start" :min="0" />
                до <a-input type="number" v-model:value="query.age.end" :min="0" />
              </div>
            </a-col>

            <a-col :xs="24">
              <label for="date">дата</label>
              <a-range-picker name="date" style="width:100%" v-model:value="date" />
            </a-col>
            <!-- <a-col :xs="24" class="d-flex justify-center">
                                                            <a-button @click="find" class="lets_go_btn" type="primary">поиск</a-button>
                                                          </a-col> -->

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

label,
.label {
  font-size: 10px;
}
</style>
