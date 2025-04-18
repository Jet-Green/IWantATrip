<script setup>
import { ref, watch, onMounted } from "vue";
import { useAuth } from "../stores/auth";
import { useRouter, useRoute, RouterView } from "vue-router";
import BackButton from "../components/BackButton.vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import ruRU from 'ant-design-vue/es/locale/ru_RU';

const userStore = useAuth();
const router = useRouter();
const route = useRoute();

let breakpoints = useBreakpoints(breakpointsTailwind);
let sm = breakpoints.smaller("md");
let isCreator = userStore.user.tinkoffContract || false
let isPlaceCreator = userStore.user.tinkoffContract || false
let isTasksManager = userStore.user.roles.includes('tasksManager')
let isAdmin = userStore.user.roles.includes('admin')
let isManager = userStore.user.roles.includes('manager')

// чтобы не сбрасывалось при обновлении
let current = ref([route.path]);

let showBookingNotifications = ref(false)

const open = ref(true);


let cab = ref(null);
let tur = ref(null);
let companions = ref(null);
let crm = ref(null);

const logOut = () => {
  userStore.logout();
  router.push("/");
};
watch(current, (newRout) => {

  router.push(newRout[0])
})
watch(() => route.path, (newRoute) => {
  current.value[0] = newRoute
})

onMounted(async () => {

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
            <span ref='cab' v-if=!sm>О пользователе</span>
            <span v-else class="mdi mdi-24px mdi-account-outline" style="color: #245159; "></span>
          </a-menu-item>
          <a-menu-item key="/cabinet/my-companions">
            <span ref='companions' v-if=!sm>Попутчики</span>
            <span v-else class="mdi mdi-24px mdi-human-capacity-decrease" style="color: #245159; "></span>
          </a-menu-item>
          <a-sub-menu key="sub1">
            <template #title>
              <span ref='tur' v-if=!sm>Туры</span>
              <span v-else class="mdi mdi-24px mdi-map-outline" style="color: #245159; "></span>
            </template>
            <a-menu-item v-if="isCreator" key="/cabinet/created-trips">Созданные</a-menu-item>
            <a-menu-item key="/cabinet/bought-trips">Купленные</a-menu-item>
            <a-menu-item key="/cabinet/booking-trips">Заказанные</a-menu-item>
            <a-menu-item v-if="isCreator" key="/calc">Калькулятор</a-menu-item>
            <a-menu-item v-if="isCreator" key="/cabinet/find-buyer">Найти покупателя</a-menu-item>
          </a-sub-menu>
          <a-menu-item key="/cabinet/excursions">
            <span v-if=!sm>Экскурсии</span>
            <span v-else class="mdi mdi-24px mdi-account-group" style="color: #245159;"></span>
          </a-menu-item>
          <a-menu-item key="/cabinet/my-places">
            <span v-if=!sm>Места</span>
            <span v-else class="mdi mdi-24px mdi-map-marker-outline" style="color: #245159;"></span>
          </a-menu-item>
          <a-sub-menu key="sub4" v-if="isTasksManager || isCreator">
            <template #title>
              <span ref='crm' v-if=!sm>CRM</span>
              <span v-else class="mdi mdi-24px mdi-calendar-check-outline" style="color: #245159; "></span>
            </template>
            <a-menu-item key="/cabinet/tasks">Задачи</a-menu-item>
            <a-menu-item v-if="isCreator" key="/cabinet/partners">Партнеры</a-menu-item>

          </a-sub-menu>

          <a-menu-item key="/cabinet/booking-notifications" v-if="showBookingNotifications">
            <span v-if=!sm>Заказы</span>
            <span v-else class="mdi mdi-24px mdi-hand-wave-outline" style="color: #245159; "></span>
          </a-menu-item>
          <a-sub-menu key="sub2" v-if="isAdmin||isManager">


            <template #title>
              <span v-if=!sm>Админ</span>
              <span v-else class="mdi mdi-24px mdi-cog-outline" style="color: #245159; cursor: pointer"></span>
            </template>
            <a-sub-menu key="sub01">

              <template #title>
                Модерация
              </template>
              <a-menu-item key="/cabinet/moderation-trips/not-moderated-trips">Туры</a-menu-item>
              <a-menu-item key="/cabinet/catalog-trips-moderation/on-moderation">Каталог</a-menu-item>
              <a-menu-item key="/cabinet/moderation-companions">Попутчики</a-menu-item>
              <a-menu-item key="/cabinet/moderation-excursions">Экскурсии</a-menu-item>
              <a-menu-item key="/cabinet/moderation-places/on-moderation">Места</a-menu-item>
            </a-sub-menu>
            <a-menu-item key="/cabinet/orders">Заказы</a-menu-item>
            <a-menu-item v-if="isAdmin" key="/cabinet/interface">Интерфейс</a-menu-item>
            <a-sub-menu key="sub02">

              <template #title>
                Гид
              </template>
              <a-menu-item key="/cabinet/transport">Транспорт</a-menu-item>
            </a-sub-menu>
            <a-menu-item v-if="isAdmin"
              key="/cabinet/management">Управление</a-menu-item>

            <a-sub-menu key="sub3" v-if="isAdmin">

              <template #title>
                Договоры
              </template>

              <a-menu-item 
                key="/cabinet/admin-contracts-list">Список</a-menu-item>
            </a-sub-menu>

            <a-menu-item v-if="isManager" key="/cabinet/determinate-winner">
              Розыгрыш
            </a-menu-item>
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
