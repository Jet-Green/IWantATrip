<script setup>
import { ref, onMounted } from "vue";
import { useAuth } from "../../stores/auth";
import { useCompanions } from "../../stores/companions";
import { useRouter } from "vue-router";

const userStore = useAuth();
const router = useRouter();
const companionStore = useCompanions();
const companionIds = userStore.user?.createdCompanions;

let companions = ref([]);

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

const handleOk = (e) => {
  visible.value = false;
};

const ageString = (age) => {
  if (age >= 10 && age <= 20) {
    return `${age} лет`;
  }
  age = String(age);
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
const toCompanionResposes = (companion) => {
  companionStore.currentCompanion = companion;
  router.push("/cabinet/responses");
};
async function deleteCompanion(_id) {
  let res = await companionStore.deleteCompanion(_id, userStore.user._id);

  if (res.status == 200)
    await updateCompanions()
}

async function updateCompanions() {
  let createdCompanions = [];
  for (let id of companionIds) {
    const response = await companionStore.getById(id);
    createdCompanions.push(response.data);
  }
  companions.value = createdCompanions.filter((element) => element !== null);
}

onMounted(async () => {
  await updateCompanions()
});
</script>
<template>
  <a-col :span="24" class="mb-8">
    <h3>Мои попутчики</h3>
  </a-col>
  <a-row v-if="companions.length" :gutter="[8, 8]">
    <a-col v-for="(companion, index) in companions" :key="index" :lg="8" :sm="12" :xs="24">
      <a-card class="card" hoverable>
        <div>
          <MdiIcon name="human-male-female" />{{ companion?.name }}
          <MdiIcon name="human-cane" />{{ ageString(companion?.age) }}
        </div>

        <div>
          <MdiIcon name="compass-outline" />{{ companion?.direction }}
        </div>
        <div :class="[
          companion?.companionGender == 'Мужчина'
            ? 'male'
            : companion?.companionGender == 'Женщина'
              ? 'female'
              : 'not-matter',
        ]">
          <MdiIcon v-if="request.gender == Female" name="gender-female" />
          <MdiIcon v-if="request.gender == Male" name="gender-female" />
          <MdiIcon v-else name="human-male-female" />
          {{
            companion?.companionGender == "Мужчина"
              ? "Мужчину"
              : companion?.companionGender == "Женщина"
                ? "Женщину"
                : "Не важно"
          }}
        </div>
        <div>
          <MdiIcon name="calendar-arrow-right" />
          {{ `c ${clearData(companion?.start)}` }}
          <MdiIcon name="calendar-arrow-left" />
          {{ `по ${clearData(companion?.end)}` }}
        </div>

        <div>
          <MdiIcon name="list-status" />{{ companion?.description }}
        </div>

        <div class="d-flex justify-center">
          <a-popconfirm title="Вы уверены?" ok-text="Да" cancel-text="Нет" @confirm="deleteCompanion(companion._id)">
            <MdiIcon style="color: #ff6600; cursor: pointer; font-size: 20px" name="delete" />
          </a-popconfirm>
          <MdiIcon style="cursor: pointer; font-size: 20px" @click="toCompanionResposes(companion)"
            name="information-outline" class="ml-4" />
        </div>
      </a-card>
    </a-col>
  </a-row>
  <a-row v-else>
    <a-col :span="24">
      нет попутчиков
    </a-col>
  </a-row>
</template>

<style lang="scss" scoped></style>
