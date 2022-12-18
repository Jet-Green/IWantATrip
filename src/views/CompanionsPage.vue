<script setup>
import { useRouter } from "vue-router";
import { useCompanions } from "../stores/companions";
import BackButton from "../components/BackButton.vue";

const companionStore = useCompanions();
let router = useRouter();

const clearData = (dataString) => {
  const dataFromString = new Date(dataString);
  return dataFromString.toLocaleDateString();
};
</script>
<template>
  <div>
    <BackButton></BackButton>

    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <h2>Ищу попутчика</h2>
        <a-row type="flex" justify="center">
          <a-col class="d-flex justify-center">
            <a-button
              class="lets_go_btn ma-16"
              type="primary"
              size="large"
              @click="router.push('/add-companion')"
              >Добавить себя</a-button
            >
          </a-col>
        </a-row>
        <a-row
          v-for="(companion, i) in companionStore.companions"
          :key="i"
          :class="companion.gender == 'Male' ? 'men' : 'women'"
          class="space-between align-center"
        >
          <a-col>
            {{ companion.name }}
          </a-col>
          <a-col> возраст {{ companion.age }} </a-col>
          <a-col>
            <a-button>+</a-button>
          </a-col>
          <a-divider class="ma-4" />
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<style lang="scss" scoped>
.men {
  background: rgba(255, 102, 0, 0.1);
}
.women {
  background: rgba(34, 176, 214, 0.1);
}
</style>
