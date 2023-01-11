<script setup>
import { reactive } from "vue";

import { useRouter } from "vue-router";

import {useCompanions} from "../../stores/companions"

import person from "../../assets/icons/person_black_24dp.svg";

const companionStore = useCompanions()

let router = useRouter();

const toCompanionsPage = () => {
  router.push({ name: "CompanionsPage" });
};
</script>
<template>
  <a-row display="flex" justify="center">
    <a-col :lg="10" :xs="24" align="middle">
      <h2 class="mt-16">Найди попутчиков</h2>

      <div class="scroll">
        <div
          v-for="(companion, i) in companionStore.companions"
          :key="i"
          style="margin: 15px 25px 15px 25px"
          
        >
          <div class="d-flex direction-column align-center ">
            <span v-if="companion.gender == 'Male'" class="mdi mdi-24px mdi-account-cowboy-hat-outline men"></span>
            <span v-else class="mdi mdi-24px mdi-account-outline women"></span>
            <span class="ma-0" style="font-size: 16px;line-height: 15px">{{ companion.name }}</span>
            <span class="ma-0" style="font-size: 13px; line-height: 10px">{{ companion.age }} лет</span>
          </div>
        </div>
      </div>

      <a-button
        type="primary"
        size="large"
        class="ma-16 lets_go_btn"
        @click="router.push('/companions')"
      >
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

.women {
  color: rgb(255, 102, 0);
}
.men {
  color: rgba(34, 176, 214);
  
}

</style>
