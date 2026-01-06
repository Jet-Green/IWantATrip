<script setup>
import { onMounted, reactive, ref } from "vue";
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
  <div v-if="user">
    <a-row :gutter="[8, 8]">
      <a-col :xs="24" :md="12">
        <a-badge-ribbon text="Вход">
          <a-card class="card">
            <h2>
              <a-avatar
                style="margin-right: 8px; font-size: large; font-weight: bold"
                size="large"
                >{{ user.fullname[0] }}</a-avatar
              >
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
                <a-typography-paragraph
                  v-model:content="info.fullname"
                  :editable="{
                    onEnd: updateFullInfo,
                    onChange: changeFullInfo,
                  }"
                />
              </b>
            </div>
            <div class="d-flex">
              <span style="padding-right: 8px"> Телефон:</span>
              <b>
                <a-typography-paragraph
                  v-model:content="info.phone"
                  :editable="{
                    onEnd: updateFullInfo,
                    onChange: changeFullInfo,
                  }"
                />
              </b>
            </div>
            <div class="d-flex justify-center">
              <a-button v-if="isChange" @click="updateFullInfo" type="primary"
                >Сохранить изменения</a-button
              >
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

    <a-row :gutter="[5]">
      <a-col v-if="isCreator">
        <a-button
          class="btn_light ma-8"
          @click="router.push('/create-no-help')"
        >
          Создать тур
        </a-button>
      </a-col>

      <a-col v-if="isCreator">
        <a-button
          class="btn_light ma-8"
          @click="router.push('/create-catalog-trip')"
        >
          Создать тур в каталоге
        </a-button>
      </a-col>
      <a-col>
        <a-button class="btn_light ma-8" @click="router.push('/send-idea')">
          Подать идею
        </a-button>
      </a-col>
      <a-col>
        <a-button
          class="btn_light ma-8"
          @click="router.push('/create-excursion')"
        >
          создать экскурсию
        </a-button>
      </a-col>
       <a-col>
        <a-button
          class="btn_light ma-8"
          @click="router.push('/create-guide')"
        >
          добавить гида
        </a-button>
      </a-col>
      <a-col>
        <a-button class="btn_light ma-8" @click="router.push('/create-place')">
          создать место
        </a-button>
      </a-col>
      <a-col>
        <a-button class="btn_light ma-8" @click="router.push('/create-track')">
          создать маршрут
        </a-button>
      </a-col>
    </a-row>
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
</style>
