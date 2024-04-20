<script setup>
import { ref, watch, onMounted } from "vue";
import { useAuth } from "../stores/auth";
import { useRouter, RouterView } from "vue-router";
import BackButton from "../components/BackButton.vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import ruRU from 'ant-design-vue/es/locale/ru_RU';

const userStore = useAuth();
const router = useRouter();

let breakpoints = useBreakpoints(breakpointsTailwind);
let sm = breakpoints.smaller("md");

// чтобы не сбрасывалось при обновлении
let current = ref([router.currentRoute.value.path]);

let showBookingNotifications = ref(false)

const open = ref(false);
let currentStep = ref(0);

let cab = ref(null);
let tur = ref(null);
let companions = ref(null);


const steps = [
  {
    title: 'Кабинет',
    description: 'личный кабинет с информацией о пользователе',
    placement: 'bottom',
    target: () => cab.value,
  },
  {
    title: 'Туры',
    description: 'купленные и созданные туры',
    placement: 'bottom',
    target: () => tur.value,
  },
  {
    title: 'Попутчики',
    description: 'информация о созданных попутчикач',
    placement: 'bottom',
    target: () => companions.value,
  }
];
function openCabinetTour(state, step = 0) {
  open.value = state
  if (step > 0) {
    return userStore.showTour(step, 'cabinetTour', userStore.user._id)
  }
  return userStore.showTour(0, 'cabinetTour', userStore.user._id)
}
const next = () => {
  currentStep.value++;
};

const logOut = () => {
  userStore.logout();
  router.push("/");
};
watch(current, (newRout, oldRout) => {
  router.push(newRout[0])
})

onMounted(async () => {
  await userStore.getTourStatus(userStore.user._id)
  if (window.screen.width >= 800) {
    if (userStore.user?.educationTours?.cabinetTour + 1 < steps.length) {
      currentStep.value = userStore.user?.educationTours?.cabinetTour
      openCabinetTour(true, userStore.user?.educationTours?.cabinetTour)
    }
    if (!userStore.user?.educationTours?.cabinetTour) {
      openCabinetTour(true, 0)
    }

  }
  // for (let n of userStore.user?.notifications) {
  //   if (n.type == 'BookingTrip' && n.send == true) {
  //     showBookingNotifications.value = true
  //     break
  //   }
  // }
})
</script>

<template>
  <div>
    <BackButton></BackButton>
    <a-config-provider :locale="ruRU">
      <a-tour :open="open" v-model:current="currentStep" :steps="steps" @finish='openCabinetTour(false, currentStep)'
        @click="next" @close='openCabinetTour(false, currentStep)'>
      </a-tour>
    </a-config-provider>

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
            <span v-else class="mdi mdi-24px mdi-account-outline" style="color: #245159; cursor: pointer"></span>
          </a-menu-item>
          <a-sub-menu key="sub1">
            <template #title>
              <span ref='tur' v-if=!sm>Туры</span>
              <span v-else class="mdi mdi-24px mdi-map-outline" style="color: #245159; cursor: pointer"></span>
            </template>
            <a-menu-item key="/cabinet/created-trips">Созданные</a-menu-item>
            <a-menu-item key="/cabinet/bought-trips">Купленные</a-menu-item>
            <a-menu-item key="/cabinet/booking-trips">Заказанные</a-menu-item>
            <a-menu-item key="/calc">Калькулятор</a-menu-item>
            <a-menu-item key="/cabinet/find-buyer">Найти покупателя</a-menu-item>
          </a-sub-menu>
          <a-menu-item key="/cabinet/my-companions">
            <span ref='companions' v-if=!sm>Попутчики</span>
            <span v-else class="mdi mdi-24px mdi-human-capacity-decrease"
              style="color: #245159; cursor: pointer"></span>
          </a-menu-item>
          <a-menu-item key="/cabinet/booking-notifications" v-if="showBookingNotifications">
            <span v-if=!sm>Заказы</span>
            <span v-else class="mdi mdi-24px mdi-hand-wave-outline" style="color: #245159; cursor: pointer"></span>
          </a-menu-item>
          <a-sub-menu key="sub2" v-if="userStore.user.roles.includes('manager')">

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
            </a-sub-menu>
            <a-menu-item key="/cabinet/orders">Заказы</a-menu-item>
            <a-menu-item v-if="userStore.user.roles.includes('admin')" key="/cabinet/interface">Интерфейс</a-menu-item>
            <a-sub-menu key="sub02">

              <template #title>
                Гид
              </template>
              <a-menu-item key="/cabinet/transport">Транспорт</a-menu-item>
            </a-sub-menu>
            <a-menu-item v-if="userStore.user.roles.includes('admin')"
              key="/cabinet/management">Управление</a-menu-item>

            <a-sub-menu key="sub3">

              <template #title>
                Договоры
              </template>
              <a-menu-item v-if="userStore.user.roles.includes('admin')"
                key="/cabinet/add-admin-contract">Добавить</a-menu-item>
              <a-menu-item v-if="userStore.user.roles.includes('admin')"
                key="/cabinet/admin-contracts-list">Список</a-menu-item>
            </a-sub-menu>
            <!-- <a-menu-item v-if="userStore.user.roles.includes('admin')" key="/cabinet/scripts"
              style="color: red">Scripts</a-menu-item> -->
            <a-menu-item v-if="userStore.user.roles.includes('admin')" key="/cabinet/determinate-winner">
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
