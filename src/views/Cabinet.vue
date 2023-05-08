<script setup>
import { onMounted, ref, watch } from "vue";
import { useAuth } from "../stores/auth";
import { useRouter, RouterView } from "vue-router";
import BackButton from "../components/BackButton.vue";
import AboutClient from "../components/_cabinet/AboutClient.vue";
import CreatedTrips from "../components/_cabinet/CreatedTrips.vue";
import PurchasedTrips from "../components/_cabinet/PurchasedTrips.vue";
import CreatedObjects from "../components/_cabinet/CreatedObjects.vue";
import MyCompanions from "../components/_cabinet/MyCompanions.vue";
import BookingTrips from "../components/_cabinet/BookingTrips.vue";
import AdminPanel from '../components/_cabinet/AdminPanel.vue'

const userStore = useAuth();
const router = useRouter();

let current = ref(['/cabinet/me']);

const logOut = () => {
  userStore.logout();
  router.push("/");
};

const routeTo = (r) => {
  router.push(r)
}
watch(current, (newRout, oldRout) => {

  router.push(newRout[0])
})


onMounted(() => {

});
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
        <a-menu v-model:selectedKeys="current" mode="horizontal" >
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
            <a-menu-item key="setting:6">Модерация</a-menu-item>
            <a-menu-item key="setting:7">Интерфейс</a-menu-item>
            <a-menu-item key="setting:8">Управление</a-menu-item>
          </a-sub-menu>

        </a-menu>

      </a-col>
      <a-col :xs="22" :lg="16">
        <RouterView />

      </a-col>
    </a-row>

    <!-- <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <a-tabs activeKey="5">
          <a-tab-pane key="1" tab="О пользователе">
            <AboutClient />
          </a-tab-pane>
          <a-tab-pane v-if="userStore.user?.trips?.length" key="2" tab="Созданные туры">
            <CreatedTrips />
          </a-tab-pane>
          <a-tab-pane key="3" tab="Забронированные">
            <PurchasedTrips />
          </a-tab-pane>
          <a-tab-pane v-if="userStore.user?.guideElements?.length" key="4" tab="Созданные объекты">
            <CreatedObjects />
          </a-tab-pane>
          <a-tab-pane v-if="userStore.user?.createdCompanions?.length" key="5" tab="Попутчики">
            <MyCompanions />
          </a-tab-pane>
          <a-tab-pane key="6" tab="Заказ тура">
            <BookingTrips />
          </a-tab-pane>
          <a-tab-pane v-if="userStore.user?.roles.includes('admin')" key="7" tab="Админ панель">
            <AdminPanel />
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row> -->
  </div>
</template>

<style lang="scss" scoped></style>
