<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCompanions } from "../stores/companions";
import BackButton from "../components/BackButton.vue";
import CompanionFilter from "../components/CompanionFilter.vue";

const companionStore = useCompanions();
let router = useRouter();

const clearData = (dateNumber) => {
  let date = new Date(dateNumber).toLocaleDateString("ru-Ru", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  })
  if (date !== 'Invalid Date' && date) {
    return date
  }
  return ''
}
const ageString = (age) => {
  age = age.toString()
  if (age >= 10 && age <= 20) {
    return `${age} лет`;
  }
  let arr = age.split("");
  let lastNumber = arr[arr.length - 1];
  if (lastNumber == 1) {
    return `${age} год`;
  }
  if (lastNumber == 2 || lastNumber == 3 || lastNumber == 4) {
    return `${age} года`;
  }
  return `${age} лет`;
}; // это гениально
</script>
<template>
  <div>
    <BackButton />
    <a-row class="d-flex justify-center">
      <a-col :xs="22" :lg="16">
        <h2>Ищу попутчика</h2>
      </a-col>
    </a-row>

    <a-row class="d-flex justify-center">
      <a-col :lg="16" :xs="22">
        <a-row class="d-flex align-center direction-column" :gutter="[8, 8]">
          <a-col :md="8" :xs="24" :sm="12">
            <CompanionFilter />
          </a-col>

          <a-col :md="8" :xs="24" :sm="12" class="d-flex justify-center">
            <a-button type="primary" @click="router.push('/add-companion')" class="lets_go_btn">Добавить
              себя</a-button>
          </a-col>
        </a-row>
        <a-row :gutter="[8, 8]" class="mt-8">
          <a-col v-if="companionStore.companions.length != 0" :lg="8" :sm="12" :xs="24"
            v-for="(companion, i) in companionStore.companions" :key="i">
            <a-card class="card" hoverable>
              <div>
                <span class="mdi mdi-human-male-female"></span>{{ companion.name }} <span
                  class="mdi mdi-human-male-height"></span>{{ ageString(companion.age) }}
              </div>

              <div>
                <span class="mdi mdi-map-marker-outline"></span>{{ companion.startLocation.shortName }}
              </div>

              <div>
                <span class="mdi mdi-compass-outline"></span>{{ companion.direction }}
              </div>
              <div :class="[
        companion.companionGender == 'Мужчина'
          ? 'male'
          : companion.companionGender == 'Женщина'
            ? 'female'
            : 'not-matter',
      ]">
                <span :class="companion.companionGender == 'Женщина'
        ? 'mdi mdi-gender-female'
        : companion.companionGender == 'Мужчина'
          ? 'mdi mdi-gender-male'
          : 'mdi mdi-human-male-female'
        "></span>
                {{ companion.companionGender == "Мужчина" ? "Мужчину" : companion.companionGender ==
        "Женщина" ? "Женщину" : "Не важно"
                }}
              </div>
              <div>
                <span class="mdi mdi-calendar-arrow-right"></span>
                {{ `c ${clearData(companion.start)}` }}
                <span class="mdi mdi-calendar-arrow-left"></span>
                {{ `по ${clearData(companion.end)}` }}
              </div>

              <div>
                <span class="mdi mdi-list-status"></span>{{ companion.description }}
              </div>
              <a-tooltip placement="bottom">
                <template #title>
                  <span>отклик</span>
                </template>
                <a-button shape="circle" class="accept" @click="
        router.push({
          path: '/add-feedback',
          query: { companion_id: companion._id },
        })
        ">
                  <span class="mdi mdi-thumb-up-outline"></span>
                </a-button>
              </a-tooltip>
            </a-card>
          </a-col>
          <a-col v-else style="text-align: center" :span="24">
            <div style="display: flex; flex-direction: column; margin-top: 16px;">
              <div class="d-flex justify-center">
                <img src="../assets/images/notfound.jpg" alt="not found" style="height: 150px;">
              </div>
              <h3>извини, я не нашёл</h3>
            </div>
          </a-col>
        </a-row>
      </a-col>
    </a-row>
  </div>
</template>

<style lang="scss" scoped>
.women {
  background: rgba(255, 102, 0, 0.05);
}

.men {
  background: rgba(34, 176, 214, 0.05);
}

.table_header {
  text-align: center;
  // background: rgba(34, 176, 214, 0.05) ;
}

.card {
  position: relative;

  .mdi {
    margin: 4px;
  }

  .accept {
    position: absolute;
    top: -6px;
    right: -6px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .male {
    color: rgba(34, 176, 214);
  }

  .female {
    color: rgb(255, 102, 0);
  }

  .not-matter {
    color: rgb(111, 133, 43);
  }
}
</style>
