<script setup>
import { useAuth } from "../stores/auth";
import { useRouter } from "vue-router";
import BackButton from "../components/BackButton.vue";

const user = useAuth();
const router = useRouter();
const logOut = () => {
  user.logout();
  router.push("/");
};
</script>
<template>
  <div>
    <BackButton></BackButton>

    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="12">
        <h2>
          Кабинет
          <span
            @click="logOut()"
            class="mdi mdi-24px mdi-logout"
            style="cursor: pointer; float: right"
          >
          </span>
        </h2>
      </a-col>
    </a-row>
  </div>
</template>

<style lang="scss" scoped>
</style>