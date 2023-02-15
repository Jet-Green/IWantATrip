<script setup>
import { onMounted } from "vue";
import { useAuth } from "../stores/auth";
import { useRouter } from "vue-router";
import BackButton from "../components/BackButton.vue";
import AboutClient from "../components/_cabinet/AboutClient.vue";
import CreatedTrips from "../components/_cabinet/CreatedTrips.vue";
import PurchasedTrips from "../components/_cabinet/PurchasedTrips.vue";
import CreatedObjects from "../components/_cabinet/CreatedObjects.vue";
import MyCompanions from "../components/_cabinet/MyCompanions.vue";

const userStore = useAuth();
const router = useRouter();
const logOut = () => {
  userStore.logout();
  router.push("/");
};
onMounted(() => {
  // console.log(userStore.user);
});
</script>
<template>
  <div>
    <BackButton></BackButton>

    <a-row type="flex" justify="center">
      <a-col :xs="22" :sm="12">
        <h2>
          Кабинет
          <span @click="logOut()" class="mdi mdi-24px mdi-logout" style="cursor: pointer; float: right">
          </span>
        </h2>
      </a-col>
    </a-row>
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="16">
        <a-tabs>
          <a-tab-pane key="1" tab="О пользователе">
            <AboutClient />
          </a-tab-pane>
          <a-tab-pane v-if="userStore.user?.trips?.length" key="2" tab="Созданные туры">
            <CreatedTrips />
          </a-tab-pane>
          <a-tab-pane key="3" tab="Купленные туры">
            <PurchasedTrips />
          </a-tab-pane>
          <a-tab-pane v-if="userStore.user?.guideElements?.length" key="4" tab="Созданные объекты">
            <CreatedObjects />
          </a-tab-pane>
          <a-tab-pane v-if="userStore.user?.companionRequests?.length" key="5" tab="Попутчики">
            <MyCompanions />
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<style lang="scss" scoped>

</style>
