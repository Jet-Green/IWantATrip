<script setup>
import { ref } from "vue";
import { useLocations } from '../../stores/locations'

const locationStore = useLocations()
let cards = ref([
  {
    title: "Места",
    icon: "mdi-map-marker-outline",
    route: { name: 'Places', hash: '#top' },
    isShow: true,

  },
  // {
  //   title: "Маршруты",
  //   icon: "mdi-routes",
  //   route: "/tracks-list",
  //   isShow: true,

  // },
  {
    title: "Экскурсии",
    icon: "mdi-crowd",
    route: "/excursions",
    isShow: true,

  },
  {
    title: "Гиды",
    icon: "mdi-account-tie-voice-outline",
    route: "/guides",
    isShow: true,

  },
  {
    title: "Афиши",
    icon: "mdi-movie-roll",
    route: "/poster",
    isShow: true,

  },
  {
    title: "Транспорт",
    icon: "mdi mdi-train-car",
    route: "/transport",
    isShow: true,

  },
  {
    title: "Гостиницы",
    icon: "mdi-home-city-outline",
    route: "/stay",
    isShow: true,

  },


  // {
  //   title: "Фотобанк",
  //   icon: "mdi-camera",
  //   route: "/photos",
  //   isShow: true,

  // },

  // {
  //   title: "Аренда",
  //   icon: "mdi-tent",
  //   route: "/enter",
  //   isShow: false,

  // },
  // {
  //   title: "Сувениры",
  //   icon: "mdi-gift-outline",
  //   route: "/souvenirs",
  //   isShow: false,

  // },
]);


// watch(locationStore, () => {

//   locationStore.location.shortName == 'Глазов'&& locationStore.location.shortName? cards.value[5].isShow = true : cards.value[5].isShow = false
// })
</script>

<template>
  <a-row class="guide justify-center">
    <a-col :xs="22" :md="20" :xl="16">
      <h2 class="text-center">В городе</h2>
      <h3 class="city-name text-center">
        {{ locationStore.location?.shortName || 'Выберите город' }}
      </h3>

      <a-row :gutter="[12, 12]" class="justify-center">
        <a-col v-for="(card, index) in cards" :key="index" :xs="12" :md="8">
          <router-link :to="card.isShow ? card.route : ''" class="guide-card" :class="{ opacity: !card.isShow }">
            <div class="card-content">
              <span class="mdi" :class="card.icon"></span>
              <span class="card-title">{{ card.title }}</span>
            </div>
          </router-link>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>
<style lang="scss" scoped>
.text-center {
  text-align: center;
}

.guide {
  padding: 40px 0;
}

h2 {
  font-size: clamp(1rem, -0.1932rem + 3.4091vw, 2.5rem);
  font-weight: 900;
  line-height: 1;
  margin-bottom: 8px;
}

.city-name {
  font-size: clamp(1.25rem, 0.3864rem + 2.2727vw, 2rem);
  font-weight: 400;
  color: #FF6600;
  margin-bottom: 24px;
}

.guide-card {
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 24px 16px;
  cursor: pointer;
  transition: all 0.28s ease;
  text-decoration: none;
  color: inherit;
  height: 100%;

  &:hover {
    border-color: #FF6600;
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: scale(0.98);
  }

  &.opacity {
    background: #f5f5f5;
    cursor: default;
    pointer-events: none;
  }
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;

  .mdi {
    font-size: 2rem;
    color: #63BED8;
  }

  .card-title {
    font-size: clamp(0.875rem, 0.5rem + 0.9375vw, 1rem);
    font-weight: 600;
  }
}
</style>
