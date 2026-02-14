<script setup>
import { ref, watch, onMounted } from "vue";
import { useAuth } from "../stores/auth";
import { useRouter, useRoute, RouterView } from "vue-router";
import BackButton from "../components/BackButton.vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";


const userStore = useAuth();
const router = useRouter();
const route = useRoute();

let breakpoints = useBreakpoints(breakpointsTailwind);
let sm = breakpoints.smaller("md");
let isCreator = userStore.user.tinkoffContract || false
let isPlaceCreator = userStore.user.tinkoffContract || false
// let isGuide = userStore.user.roles.includes('guide')
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
let cabinetGuide = ref(null)

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
          <MdiIcon @click="logOut()" style="cursor: pointer; float: right" name="logout" size="24px" />
        </h2>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16" class="mb-8">
        <a-menu v-model:selectedKeys="current" mode="horizontal">
          <a-menu-item key="/cabinet/me">
            <span ref='cab' v-if=!sm>О пользователе</span>
            <MdiIcon v-else style="color: #245159; " name="account-outline" size="24px" />
          </a-menu-item>
          <a-menu-item key="/cabinet/my-companions">
            <span ref='companions' v-if=!sm>Попутчики</span>
            <MdiIcon v-else style="color: #245159; " name="human-capacity-decrease" size="24px" />
          </a-menu-item>
          <a-sub-menu key="sub1">
            <template #title>
              <span ref='tur' v-if=!sm>Туры</span>
              <MdiIcon v-else style="color: #245159; " name="map-outline" size="24px" />
            </template>
            <a-menu-item v-if="isCreator" key="/cabinet/created-trips">Созданные</a-menu-item>
            <a-menu-item key="/cabinet/bought-trips">Купленные</a-menu-item>
            <a-menu-item key="/cabinet/booking-trips">Заказанные</a-menu-item>
            <a-menu-item v-if="isCreator" key="/calc">Калькулятор</a-menu-item>
            <a-menu-item v-if="isCreator" key="/cabinet/find-buyer">Найти покупателя</a-menu-item>
          </a-sub-menu>
          <a-menu-item key="/cabinet/excursions">
            <span v-if=!sm>Экскурсии</span>
            <MdiIcon v-else style="color: #245159;" name="account-group" size="24px" />
          </a-menu-item>
          <a-menu-item key="/cabinet/cabinet-guides">
            <span ref='cabinetGuide' v-if=!sm>Гиды</span>
            <MdiIcon v-else style="color: #245159; " name="nature-people" size="24px" />
          </a-menu-item>
          <a-menu-item key="/cabinet/my-places">
            <span v-if=!sm>Места</span>
            <MdiIcon v-else style="color: #245159;" name="map-marker-outline" size="24px" />
          </a-menu-item>
          <a-menu-item key="/cabinet/my-tracks">
            <span v-if=!sm>Маршруты</span>
            <MdiIcon v-else style="color: #245159;" name="routes" size="24px" />
          </a-menu-item>
          <a-sub-menu key="sub4" v-if="isTasksManager || isCreator">
            <template #title>
              <span ref='crm' v-if=!sm>CRM</span>
              <MdiIcon v-else style="color: #245159; " name="calendar-check-outline" size="24px" />
            </template>
            <a-menu-item key="/cabinet/tasks">Задачи</a-menu-item>
            <a-menu-item v-if="isCreator" key="/cabinet/partners">Партнеры</a-menu-item>

          </a-sub-menu>



          <a-menu-item key="/cabinet/booking-notifications" v-if="showBookingNotifications">
            <span v-if=!sm>Заказы</span>
            <MdiIcon v-else style="color: #245159; " name="hand-wave-outline" size="24px" />
          </a-menu-item>
          <a-sub-menu key="sub2" v-if="isAdmin || isManager">


            <template #title>
              <span v-if=!sm>Админ</span>
              <MdiIcon v-else style="color: #245159; cursor: pointer" name="cog-outline" size="24px" />
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
              <a-menu-item key="/cabinet/moderation-tracks/on-moderation">Маршруты</a-menu-item>
              <a-menu-item key="/cabinet/moderation-guides/on-moderation">Гиды</a-menu-item>
            </a-sub-menu>
            <a-menu-item key="/cabinet/orders">Заказы</a-menu-item>
            <a-menu-item v-if="isAdmin" key="/cabinet/interface">Интерфейс</a-menu-item>
            <a-sub-menu key="sub02">

              <template #title>
                Сервисы
              </template>
              <a-menu-item key="/cabinet/transport">Транспорт</a-menu-item>
            </a-sub-menu>
            <a-menu-item v-if="isAdmin" key="/cabinet/management">Управление</a-menu-item>

            <a-sub-menu key="sub3" v-if="isAdmin">

              <template #title>
                Договоры
              </template>

              <a-menu-item key="/cabinet/admin-contracts-list">Список</a-menu-item>
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
