<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../../stores/auth";

let router = useRouter();
const userStore = useAuth();
const user = userStore.user;
let isCreator = userStore.user.tinkoffContract || false;
let info = reactive({
  fullname: "",
  phone: "",
});
let isChange = ref(false);
const actionCards = [
  {
    title: "Создать тур",
    description: "Создайте авторский тур и настройте маршрут под свою идею.",
    route: "/create-no-help",
    onlyCreator: true,
    group: "tours",
  },
  {
    title: "Создать тур в каталоге",
    description: "Создайте тур, который можно будет использовать в будущем.",
    route: "/create-catalog-trip",
    onlyCreator: true,
    group: "tours",
  },
  {
    title: "Подать идею",
    description: "Предложите новую идею и получите обратную связь.",
    route: "/send-idea",
    group: "peopleAndIdeas",
  },
  {
    title: "Создать экскурсию",
    description: "Добавьте отдельную экскурсию для ваших клиентов.",
    route: "/create-excursion",
    group: "content",
  },
  {
    title: "Добавить гида",
    description: "Создайте карточку гида для туров и экскурсий.",
    route: "/create-guide",
    group: "peopleAndIdeas",
  },
  {
    title: "Создать место",
    description: "Добавьте точку интереса, которую можно включать в маршруты.",
    route: "/create-place",
    group: "content",
  },
  {
    title: "Создать маршрут",
    description: "Соберите новый маршрут из выбранных мест.",
    route: "/create-track",
    group: "content",
  },
];

const actionGroups = [
  { key: "tours", title: "Туры" },
  { key: "content", title: "Контент платформы" },
  { key: "peopleAndIdeas", title: "Люди и идеи" },
];

const visibleActionGroups = computed(() =>
  actionGroups
    .map((group) => ({
      ...group,
      cards: actionCards.filter(
        (card) =>
          card.group === group.key && (!card.onlyCreator || isCreator)
      ),
    }))
    .filter((group) => group.cards.length)
);

let updateFullInfo = async () => {
  await userStore.updateFullinfo(userStore.user._id, info);
  isChange.value = false;
};
let changeFullInfo = async () => {
  isChange.value = true;
};

onMounted(() => {
  if (userStore.user.fullinfo) {
    info = userStore.user.fullinfo;
  }
});
</script>

<template>
  <div v-if="user" style="margin-bottom: 60px;">
    <a-row :gutter="[8, 8]">
      <a-col :xs="24" :md="12">
        <a-badge-ribbon text="Вход">
          <a-card class="card">
            <h2>
              <a-avatar style="margin-right: 8px; font-size: large; font-weight: bold" size="large">{{ user.fullname[0]
              }}</a-avatar>
              {{ user.fullname }}
            </h2>
            <p>
              E-mail: <b>{{ user.email }}</b>
            </p>
          </a-card>
        </a-badge-ribbon>
      </a-col>
      <a-col :xs="24" :md="12">
        <a-badge-ribbon text="Для заказов" color="#239FCB">
          <a-card class="card">
            <div class="d-flex">
              <span style="padding-right: 8px"> ФИО:</span>
              <b>
                <a-typography-paragraph v-model:content="info.fullname" :editable="{
                  onEnd: updateFullInfo,
                  onChange: changeFullInfo,
                }" />
              </b>
            </div>
            <div class="d-flex">
              <span style="padding-right: 8px"> Телефон:</span>
              <b>
                <a-typography-paragraph v-model:content="info.phone" :editable="{
                  onEnd: updateFullInfo,
                  onChange: changeFullInfo,
                }" />
              </b>
            </div>
            <div class="d-flex justify-center">
              <a-button v-if="isChange" @click="updateFullInfo" type="primary">Сохранить изменения</a-button>
            </div>
          </a-card>
        </a-badge-ribbon>
      </a-col>
      <a-col v-if="user.tinkoffContract?._id" :xs="24" :md="12">
        <a-badge-ribbon text="Договор" color="#977458">
          <a-card class="card">
            <div>
              Название: <b>{{ user.tinkoffContract.fullName }}</b>
            </div>

            <div>
              E-mail: <b>{{ user.tinkoffContract.email }}</b>
            </div>

            <div>
              ИНН: <b>{{ user.tinkoffContract.inn }}</b>
            </div>

            <div>
              Ставка платформы:
              <b>{{ user.tinkoffContract.bankAccount.tax }} %</b>
            </div>
          </a-card>
        </a-badge-ribbon>
      </a-col>
    </a-row>

    <div v-for="group in visibleActionGroups" :key="group.key" class="actions-group">
      <h4 class="actions-group__title">{{ group.title }}</h4>
      <a-row :gutter="[12, 12]" class="actions-row">
        <a-col v-for="card in group.cards" :key="card.route" :xs="12" :sm="12" :md="8" :lg="6">
          <a-card hoverable class="action-card" @click="router.push(card.route)">
            <div class="action-card__cta"><span class="mdi mdi-open-in-new"></span></div>
            <h3 class="action-card__title">{{ card.title }}</h3>
            <p class="action-card__description">{{ card.description }}</p>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  border-radius: 15px;
  width: 100%;
  min-height: 110px;
  padding: 12px;
  padding-top: 30px;

}

.actions-row {
  margin-bottom: 16px;
}

.actions-group {
  margin-top: 16px;
}

.actions-group__title {
  margin: 0 0 10px 2px;
  font-size: 14px;
  font-weight: 700;
  color: #122033;
}

.action-card {
  height: 100%;
  border-radius: 10px;
  border: 1px solid #ff6600;
  background: #fff;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.action-card:deep(.ant-card-body) {
  position: relative;
  min-height: 112px;
  padding: 12px;
  padding-right: 34px;
  display: flex;
  flex-direction: column;
}

.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(255, 102, 0, 0.2);
}

.action-card__title {
  margin: 0 0 6px 0;
  font-size: 14px;
  font-weight: 700;
  color: #122033;
}

.action-card__description {
  margin: 0;
  color: rgba(18, 32, 51, 0.78);
  font-size: 12px;
  line-height: 1.35;
  line-clamp: 2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.action-card__cta {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 17px;
  line-height: 1;
  color: #ff6600;
}
</style>
