<script setup>
import { onMounted } from "vue";

import { useRouter } from "vue-router";

import { useCompanions } from "../../stores/companions";

const companionStore = useCompanions();

let router = useRouter();

const toCompanionsPage = () => {
  router.push({ name: "CompanionsPage" });
};
onMounted(async () => {
  if (companionStore.companions.length == 0)
    await companionStore.fetchCompanions()
})
</script>
<template>
  <a-row display="flex" justify="center">
    <a-col :lg="10" :xs="24" align="middle">
      <h2 class="mt-16">Найди попутчиков</h2>

      <div class="scroll">
        <div v-for="(companion, i) in companionStore.companions" :key="i" style="margin: 15px 25px 15px 25px">
          <div class="d-flex direction-column align-center">
            <span v-if="companion.gender == 'Мужчина'" class="mdi mdi-24px mdi-face-man-outline men"></span>
            <span v-if="companion.gender == 'Женщина'" class="mdi mdi-24px mdi-face-woman-outline woman"></span>
            <span class="ma-0" style="font-size: 16px; line-height: 15px">{{
              companion.name
            }}</span>
            <span class="ma-0" style="font-size: 13px; line-height: 10px">{{ companion.age }} лет</span>
          </div>
        </div>
      </div>

      <a-button type="primary" class="ma-16 lets_go_btn" @click="router.push('/companions')">
        найти
      </a-button>
    </a-col>
  </a-row>
</template>
<style lang="scss" scoped>
.person_icon {
  height: 70px;
}

.scroll {
  overflow-x: scroll;
  display: flex;
}

.woman {
  color: rgb(255, 102, 0);
}

.men {
  color: rgba(34, 176, 214);
}
</style>
