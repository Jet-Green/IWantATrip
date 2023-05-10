<script setup>
import { computed } from "vue";
import { ref } from "vue";
import { func } from "vue-types";
import { useAuth } from "../../stores/auth";
import { EditOutlined} from '@ant-design/icons-vue';
const userStore = useAuth();
const user = userStore.user;
const info = userStore.user.fullinfo;
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
console.log(user);
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
  <div v-if="info && user" @change=" onChange = true">
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

      <a-row :xs="22" :md="18" :lg="16">
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

        <a-col :xs="12" :md="8" v-if="info.companyName">
          <a-typography-text type="secondary">Название фирмы</a-typography-text>
          <a-typography-paragraph v-model:content="companyName" editable />
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="24" :md="12" v-if="info.creatorsType">
          <a-typography-text type="secondary">Статус пользователя</a-typography-text>
          
          <a-typography-paragraph  v-if="!onChange" v-model:content="creatorsType" editable>
            <template #editableIcon >
              <edit-outlined @click="onChange = true"/>
           </template>
          </a-typography-paragraph>

          <a-select v-else :trigger="['click']" v-model:value="info.creatorsType" :bordered="false">
            <a-select-option value="author">Автор тура</a-select-option>
            <a-select-option value="operator">Туроператор</a-select-option>
            <a-select-option value="creator">Турагенство</a-select-option>
          </a-select>


        </a-col>

        <a-col :span="24" :md="12" v-if="info.type" >
          <a-typography-text type="secondary">Юридический статус</a-typography-text>
          <a-typography-paragraph  v-if="!onChange" v-model:content="type" editable>
            <template #editableIcon >
              <edit-outlined @click="onChange = true"/>
           </template>
          </a-typography-paragraph>

          <a-select v-else :trigger="['click']" v-model:value="info.type" :bordered="false">
            <a-select-option value="phys">Физическое лицо</a-select-option>
            <a-select-option value="company">Юридическое лицо</a-select-option>
            <a-select-option value="indpred">Инд. предприниматель</a-select-option>
          </a-select>

        </a-col>

        <a-col :xs="11" :md="8" v-if="info.govermentRegNumber">
          <a-typography-text type="secondary">ИНН</a-typography-text>
          <a-typography-paragraph v-model:content="govermentRegNumber" editable />
        </a-col>
      </a-row>
      <a-button class="lets_go_btn mt-8" type="primary" size="large" v-show="onChange" html-type="submit">Отправить</a-button>
    </form>
  </div>
</template>
<style></style>
