<script setup>
import { computed } from "vue";
import { ref } from "vue";
import { useAuth } from "../../stores/auth";
const userStore = useAuth();
const user = userStore.user;
const info = userStore.user.fullinfo;
console.log(info);
let onChange = ref(false);
const companyName = computed(() => {
  return info.companyName ? info.companyName : "**********";
});

const creatorsType = computed(() => {
  return info.creatorsType == "author"
    ? "Автор тура"
    : info.creatorsType == "operator"
    ? "Туроператор"
    : "Турагенство";
});

const type = computed(() => {
  return info.type == "phys"
    ? "Физическое лицо"
    : info.type == "company"
    ? "Юридическое лицо"
    : "Индивидуальный предприниматель";
});

const govermentRegNumber = computed(() => {
  return info.govermentRegNumber ? info.govermentRegNumber : "**********";
});
function submit() {
  userStore
    .updateUser({
      email: user.email,
      fullinfo: info,
    })
    .then((response) => {
      userStore.user = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
</script>
<template>
  <div v-if="info && user">
    <form
      action="POST"
      @submit.prevent="submit"
      @change="onChange = true"
      enctype="multipart/form-data"
    >
      <a-row>
        <a-avatar
          style="margin-right: 8px; font-size: large; font-weight: bold"
          size="large"
          >{{ user.fullname[0] }}</a-avatar
        >
        <h3 style="font-size: 28px; font-weight: bold">{{ user.fullname }}</h3>
      </a-row>

      <a-row :xs="22" :md="18" :lg="16" style="padding-left: 12px">
        <a-col :xs="11" :md="8" :lg="5">
          <a-typography-text type="secondary">E-mail</a-typography-text>
          <a-typography-paragraph v-model:content="user.email" />
        </a-col>

        <a-col :xs="11" :md="8" :lg="5">
          <a-typography-text type="secondary">Телефон</a-typography-text>
          <a-typography-paragraph v-model:content="info.phone" editable />
        </a-col>

        <a-col :xs="11" :md="8" :lg="5">
          <a-typography-text type="secondary">Отображаемое имя</a-typography-text>
          <a-typography-paragraph v-model:content="info.fullname" editable />
        </a-col>

        <a-col :xs="11" :md="8" :lg="5">
          <a-typography-text type="secondary">Название фирмы</a-typography-text>
          <a-typography-paragraph v-model:content="companyName" editable />
        </a-col>
      </a-row>

      <a-row :xs="22" :md="18" :lg="16" style="padding-left: 12px">
        <a-col :xs="11" :md="8" :lg="5">
          <a-typography-text type="secondary">Статус пользователя</a-typography-text>
          <a-typography-paragraph v-model:content="creatorsType" editable />
        </a-col>

        <a-col :xs="11" :md="8" :lg="5">
          <a-typography-text type="secondary">Юр. статус</a-typography-text>
          <a-typography-paragraph v-model:content="type" editable />
        </a-col>

        <a-col :xs="11" :md="8" :lg="5">
          <a-typography-text type="secondary">ИНН</a-typography-text>
          <a-typography-paragraph v-model:content="govermentRegNumber" editable />
        </a-col>
      </a-row>

      <a-button
        v-show="onChange"
        class="mt-16"
        type="primary"
        size="large"
        html-type="submit"
        >Отправить
      </a-button>
    </form>
  </div>
</template>
<style></style>
