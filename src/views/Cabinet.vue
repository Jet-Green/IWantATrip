<script setup>
import { ref, watch, onMounted } from "vue";
import { useAuth } from "../stores/auth";
import { useRouter, useRoute, RouterView } from "vue-router";
import BackButton from "../components/BackButton.vue";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import TripService from "../service/TripService";
import ExcursionService from "../service/ExcursionService";
import PlaceService from "../service/PlaceService";
import TrackService from "../service/TrackService";
import GuideService from "../service/GuideService";


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

let moderationCounts = ref({
  trips: null,
  excursions: null,
  places: null,
  tracks: null,
  guides: null,
})

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

const toArrayLength = (value) => {
  if (Array.isArray(value)) {
    return value.length
  }

  return 0
}

const fetchModerationCounts = async () => {
  const results = await Promise.allSettled([
    TripService.findForModeration(),
    ExcursionService.getExcursionsOnModeration(),
    PlaceService.getAll(1, { isModerated: false, isRejected: false }),
    TrackService.getAll(1, { isModerated: false, isRejected: false }),
    GuideService.getGuides(1, { search: "", isModerated: false, isRejected: false, isHidden: false }),
  ])

  const [tripsRes, excursionsRes, placesRes, tracksRes, guidesRes] = results

  moderationCounts.value = {
    trips: tripsRes.status === "fulfilled" ? toArrayLength(tripsRes.value?.data) : 0,
    excursions: excursionsRes.status === "fulfilled" ? toArrayLength(excursionsRes.value?.data) : 0,
    places: placesRes.status === "fulfilled" ? toArrayLength(placesRes.value?.data) : 0,
    tracks: tracksRes.status === "fulfilled" ? toArrayLength(tracksRes.value?.data?.tracks) : 0,
    guides: guidesRes.status === "fulfilled" ? toArrayLength(guidesRes.value?.data) : 0,
  }
}

onMounted(async () => {
  if (isAdmin || isManager) {
    await fetchModerationCounts()
  }
})
</script>

<template>
  <div style="background-color: white !important;">
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
          <a-menu-item key="/cabinet/cabinet-guides">
            <span ref='cabinetGuide' v-if=!sm>Гиды</span>
            <span v-else class="mdi mdi-24px mdi-nature-people" style="color: #245159; "></span>
          </a-menu-item>
          <a-menu-item key="/cabinet/my-places">
            <span v-if=!sm>Места</span>
            <span v-else class="mdi mdi-24px mdi-map-marker-outline" style="color: #245159;"></span>
          </a-menu-item>
          <a-menu-item key="/cabinet/my-tracks">
            <span v-if=!sm>Маршруты</span>
            <span v-else class="mdi mdi-24px mdi-routes" style="color: #245159;"></span>
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
          <a-sub-menu key="sub2" v-if="isAdmin || isManager">


            <template #title>
              <span v-if=!sm>Админ</span>
              <span v-else class="mdi mdi-24px mdi-cog-outline" style="color: #245159; cursor: pointer"></span>
            </template>
            <a-sub-menu key="sub01">

              <template #title>
                Модерация
              </template>
              <a-menu-item key="/cabinet/moderation-trips/not-moderated-trips">
                <span class="moderation-menu-item">
                  Туры
                  <a-badge
                    v-if="moderationCounts.trips > 0"
                    class="moderation-count-badge"
                    :count="moderationCounts.trips"
                  />
                </span>
              </a-menu-item>
              <a-menu-item key="/cabinet/catalog-trips-moderation/on-moderation">Каталог</a-menu-item>
              <a-menu-item key="/cabinet/moderation-companions">Попутчики</a-menu-item>
              <a-menu-item key="/cabinet/moderation-excursions">
                <span class="moderation-menu-item">
                  Экскурсии
                  <a-badge
                    v-if="moderationCounts.excursions > 0"
                    class="moderation-count-badge"
                    :count="moderationCounts.excursions"
                  />
                </span>
              </a-menu-item>
              <a-menu-item key="/cabinet/moderation-places/on-moderation">
                <span class="moderation-menu-item">
                  Места
                  <a-badge
                    v-if="moderationCounts.places > 0"
                    class="moderation-count-badge"
                    :count="moderationCounts.places"
                  />
                </span>
              </a-menu-item>
              <a-menu-item key="/cabinet/moderation-tracks/on-moderation">
                <span class="moderation-menu-item">
                  Маршруты
                  <a-badge
                    v-if="moderationCounts.tracks > 0"
                    class="moderation-count-badge"
                    :count="moderationCounts.tracks"
                  />
                </span>
              </a-menu-item>
              <a-menu-item key="/cabinet/moderation-guides/on-moderation">
                <span class="moderation-menu-item">
                  Гиды
                  <a-badge
                    v-if="moderationCounts.guides > 0"
                    class="moderation-count-badge"
                    :count="moderationCounts.guides"
                  />
                </span>
              </a-menu-item>
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

<style lang="scss" scoped>
.moderation-menu-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.moderation-count-badge {
  :deep(.ant-badge-count) {
    background: #ff4d00;
    color: #fff !important;
    min-width: 16px;
    height: 16px;
    line-height: 16px;
    padding: 0 5px;
    font-size: 10px;
    font-weight: 700;
    box-shadow: 0 0 0 1px rgba(255, 77, 0, 0.35);
  }
}
</style>
