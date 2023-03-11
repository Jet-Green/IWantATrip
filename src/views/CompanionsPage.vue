<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCompanions } from "../stores/companions";
import BackButton from "../components/BackButton.vue";
import CompanionFilter from "../components/CompanionFilter.vue";

const companionStore = useCompanions();
let router = useRouter();

const clearData = (dataString) => {
  return new Date(Number(dataString))
    .toLocaleDateString("ru-Ru", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    })
    .replaceAll("/", ".");
};
const ageString = (age) => {
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
        <a-row class="d-flex space-between align-center" :gutter="[8, 8]">
          <a-col :md="8" :xs="24" :sm="12">
            <CompanionFilter />
          </a-col>

          <a-col :md="8" :xs="24" :sm="12" class="d-flex justify-center">
            <a-button
              class="lets_go_btn"
              type="primary"
              size="large"
              @click="router.push('/add-companion')"
              >Добавить себя</a-button
            >
          </a-col>
        </a-row>
        <a-row :gutter="[8, 8]" class="mt-8">
          <a-col
            :lg="8"
            :sm="12"
            :xs="24"
            v-for="(companion, i) in companionStore.filteredСompanions"
            :key="i"
          >
            <a-card class="card">
              <div>
                <span class="mdi mdi-human-male-female"></span
                >{{ companion.name }} <span class="mdi mdi-human-cane"></span
                >{{ ageString(companion.age) }}
              </div>

              <div>
                <span class="mdi mdi-compass-outline"></span
                >{{ companion.direction }}
              </div>
              <div
                :class="[
                  companion.companionGender == 'Мужчина'
                    ? 'male'
                    : companion.companionGender == 'Женщина'
                    ? 'female'
                    : 'not-matter',
                ]"
              >
                <span
                  :class="
                    companion.companionGender == 'Женщина'
                      ? 'mdi mdi-gender-female'
                      : companion.companionGender == 'Мужчина'
                      ? 'mdi mdi-gender-male'
                      : 'mdi mdi-human-male-female'
                  "
                ></span
                >{{
                  companion.companionGender == "Мужчина"
                    ? "Мужчину"
                    : companion.companionGender == "Женщина"
                    ? "Женщину"
                    : "Не важно"
                }}
              </div>
              <div>
                <span class="mdi mdi-calendar-arrow-right"></span>
                {{ `c ${clearData(companion.start)}` }}
                <span class="mdi mdi-calendar-arrow-left"></span>
                {{ `по ${clearData(companion.end)}` }}
              </div>

              <div>
                <span class="mdi mdi-list-status"></span
                >{{ companion.description }}
              </div>
              <a-tooltip placement="bottom">
                <template #title>
                  <span>отклик</span>
                </template>
                <a-button
                  shape="circle"
                  class="accept"
                  @click="
                    router.push({
                      path: '/add-feedback',
                      query: { companion_id: companion._id },
                    })
                  "
                >
                  <span class="mdi mdi-thumb-up-outline"></span>
                </a-button>
              </a-tooltip>
            </a-card>
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
  width: 100%;
  background: #f6f6f6;
  padding: 8px;
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

