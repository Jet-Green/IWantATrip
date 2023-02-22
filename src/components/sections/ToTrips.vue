<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const emit = defineEmits(["inputName"]);

let router = useRouter();

let search = ref("");

function find() {
  router.push({
    name: "TripsPage",
    query: { search: search.value },
  });
}
// function toEventPage() {
//   router.push({ name: "EventPage", params: { type: "event" } });
// }
</script>
<template>
  <a-row
    type="flex"
    justify="center"
    align="middle"
    class="section_bg mt-24 pt-16 pb-16"
  >
    <a-col :span="24">
      <h2 style="text-align: center; color: white">
        Найди идеальный отдых
      </h2>
    </a-col>
    <a-col :xs="22" :md="16" :lg="14">
      <a-row :gutter="[8, 8]" type="flex" justify="center">
        <a-col :xs="24" :md="12">
          <a-input-search
            v-model:value="search"
            placeholder="поиск"
            enter-button
            style="z-index: 0"
            @search="find()"
          />
        </a-col>
        <a-col :span="24" class="d-flex justify-center">
          <a-button
            class="lets_go_btn ma-16"
            type="primary"
            size="large"
            @click="find()"
          >
            Найти
          </a-button>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<style lang="scss" scoped>
.section_bg {
  background: rgba(67, 65, 79);
}
</style>
