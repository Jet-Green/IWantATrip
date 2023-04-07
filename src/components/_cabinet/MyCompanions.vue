<script setup>
import { ref, onMounted } from "vue";
import { useAuth } from "../../stores/auth";
import { useCompanions } from "../../stores/companions";
import dayjs from "dayjs";
import { DownOutlined } from '@ant-design/icons-vue';

const userStore = useAuth();
const companionStore = useCompanions();
const companionIds = userStore.user?.createdCompanions;

let companions = ref();

const clearData = (dataString) => {
  return new Date(Number(dataString))
    .toLocaleDateString("ru-Ru", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
    })
    .replaceAll("/", ".");
};

const visible = ref(false);
const showModal = (companion) => {
  this.name  =  companion.name
  visible.value = true;
  
};
const handleOk = e => {
  console.log(e);
  visible.value = false;
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
};
onMounted(async () => {
  let createdCompanions = [];
  for (let id of companionIds) {
    const response = await companionStore.getById(id);
    createdCompanions.push(response.data);
  }
  console.log(createdCompanions);
  companions.value = createdCompanions.filter((element) => element !== null);
});
</script>

<template>
  <a-row :gutter="[8, 8]" class="mt-8">
    <a-col v-for="(companion, index) in companions" :key="index" :lg="8" :sm="12" :xs="24">
      <a-card class="card" hoverable>
        <div>
          <span class="mdi mdi-human-male-female"></span>{{ companion?.name }}
          <span class="mdi mdi-human-cane"></span>{{ ageString(companion?.age) }}
        </div>

        <div>
          <span class="mdi mdi-compass-outline"></span>{{ companion?.direction }}
        </div>
        <div :class="[
          companion?.companionGender == 'Мужчина'
            ? 'male'
            : companion?.companionGender == 'Женщина'
              ? 'female'
              : 'not-matter',
        ]">
          <span :class="
            companion?.companionGender == 'Женщина'
              ? 'mdi mdi-gender-female'
              : companion?.companionGender == 'Мужчина'
                ? 'mdi mdi-gender-male'
                : 'mdi mdi-human-male-female'
          "></span>{{
  companion?.companionGender == "Мужчина"
  ? "Мужчину"
  : companion?.companionGender == "Женщина"
    ? "Женщину"
    : "Не важно"
}}
        </div>
        <div>
          <span class="mdi mdi-calendar-arrow-right"></span>
          {{ `c ${clearData(companion?.start)}` }}
          <span class="mdi mdi-calendar-arrow-left"></span>
          {{ `по ${clearData(companion?.end)}` }}
        </div>

        <div>
          <span class="mdi mdi-list-status"></span>{{ companion?.description }}
        </div>
        <!-- <a-tooltip placement="bottom">
                <template #title>
                  <span>отклик</span>
                </template>
              </a-tooltip> -->
        <div>
          <a-button @click="showModal(companion.companionRequests)">Попутчики <DownOutlined /></a-button>
          <a-modal v-model:visible="visible" title="Ваши попутчики" width="100%" wrap-class-name="full-modal" @ok="handleOk">
            {{ name }}
            <!-- <a-col :lg="12" :sm="12" :xs="24" v-for="request in companion?.companionRequests" :key="request.name">
                    <a-card class="card" hoverable>
                      <span class="mdi mdi-human-male-female"></span>
                      {{ request?.name }}
                      {{ request?.surname }}
                      <span class="mdi mdi-human-cane"></span>{{ ageString(request?.age) }} {{ request?.gender }}
                      {{ request?.phone }}
                      <a-divider class="ma-4"></a-divider>
                      <div class="d-flex justify-end">
                        <a-button>Хочу</a-button>
                      </div>
                    </a-card>
                  </a-col> -->
          </a-modal>
        </div>
      </a-card>
    </a-col>
  </a-row>
  <a-divider />
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
