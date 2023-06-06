<script setup>
import { ref, watch } from "vue";
import { useAuth } from "../stores/auth";
import { useRouter, RouterView } from "vue-router";
import BackButton from "../components/BackButton.vue";

const userStore = useAuth();
const router = useRouter();
// чтобы не сбрасывалось при обновлении
let current = ref([router.currentRoute.value.path]);

const logOut = () => {
  userStore.logout();
  router.push("/");
};
watch(current, (newRout, oldRout) => {
  router.push(newRout[0])
})
</script>
<template>
  <div>
    <BackButton></BackButton>

    <a-row type="flex" justify="center">
      <a-col :xs="22" :sm="16">
        <h2>
          Кабинет
          <span @click="logOut()" class="mdi mdi-24px mdi-logout" style="cursor: pointer; float: right">
          </span>
        </h2>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16" class="mb-8">
        <a-menu v-model:selectedKeys="current" mode="horizontal">
          <a-menu-item key="/cabinet/me">
            О пользователе
          </a-menu-item>
          <a-sub-menu key="sub1">
            <template #title>Туры</template>
            <a-menu-item key="/cabinet/created-trips">Созданные</a-menu-item>
            <a-menu-item key="/cabinet/purchased-trips">Забронированные</a-menu-item>
            <a-menu-item key="/cabinet/booking-trips">Заказанные</a-menu-item>
          </a-sub-menu>
          <a-menu-item key="/cabinet/my-companions">
            Попутчики
          </a-menu-item>
          <a-sub-menu key="sub2">
            <template #title>Админ</template>
            <a-menu-item key="/cabinet/moderation">Модерация</a-menu-item>
            <a-menu-item key="/cabinet/orders">Заказы</a-menu-item>
            <a-menu-item key="/cabinet/interface">Интерфейс</a-menu-item>
          </a-sub-menu>
        </a-menu>

      </a-col>
      <a-col :xs="22" :lg="16">
        <RouterView />

      </a-col>
    </a-row>

  </div>
</template>

<style lang="scss" scoped></style>
