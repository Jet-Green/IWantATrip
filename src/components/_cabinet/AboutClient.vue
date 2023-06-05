<script setup>
import { computed, ref } from "vue";
import { useAuth } from "../../stores/auth";
import { message } from "ant-design-vue";

const userStore = useAuth();
const user = userStore.user;
let info = userStore.user.fullinfo;
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
      message.config({ duration: 3, top: "90vh" });
      message.success({ content: "Данные изменены!" });
      onChange.value = false
      console.log(onChange)
    })
    .catch((err) => {
      console.log(err);
    });

}
// watch(info.phone, () => {
//   onChange = true
//   console.log(info.phone)
// })
// watch(info,(newInfo,oldInfo) => {
// 	console.log('x '+newInfo.phone + 'y '+oldInfo.phone)
// })
</script>
<template>
  <div v-if="user">
    <form action="POST" @submit.prevent="submit" enctype="multipart/form-data">
      <a-row>
        <a-avatar style="margin-right: 8px; font-size: large; font-weight: bold" size="large">{{ user.fullname[0]
        }}</a-avatar>
        <h3 style="font-size: 28px; font-weight: bold">{{ user.fullname }}</h3>
      </a-row>

      <a-row :xs="22" :md="18" :lg="16">
        <a-col :xs="11" :md="8" :lg="5">
          <a-typography-text type="secondary">E-mail</a-typography-text>
          <a-typography-paragraph v-model:content="user.email" />
        </a-col>

        <a-col :xs="11" :md="8" :lg="5">
          <a-typography-text type="secondary">Телефон</a-typography-text>
          <a-typography-paragraph v-model:content="info.phone" editable @click="onChange = true" />
        </a-col>

        <a-col :xs="11" :md="8" :lg="5">
          <a-typography-text type="secondary">Отображаемое имя</a-typography-text>
          <a-typography-paragraph v-model:content="info.fullname" editable @click="onChange = true" />
        </a-col>

        <a-col :xs="12" :md="8">
          <a-typography-text type="secondary">Название фирмы</a-typography-text>
          <a-typography-paragraph v-model:content="info.companyName" editable @click="onChange = true" />
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="24" :md="12">
          <a-typography-text type="secondary">Статус пользователя</a-typography-text>

          <a-select @click="onChange = true" :trigger="['click']" v-model:value="info.creatorsType" :bordered="false">
            <a-select-option value="author">Автор тура</a-select-option>
            <a-select-option value="operator">Туроператор</a-select-option>
            <a-select-option value="agency">Турагенство</a-select-option>
          </a-select>


        </a-col>

        <a-col :span="24" :md="12">
          <a-typography-text type="secondary">Юридический статус</a-typography-text>
          <a-select @click="onChange = true" :trigger="['click']" v-model:value="info.type" :bordered="false">
            <a-select-option value="phys">Физическое лицо</a-select-option>
            <a-select-option value="company">Юридическое лицо</a-select-option>
            <a-select-option value="indpred">Инд. предприниматель</a-select-option>
          </a-select>

        </a-col>

        <a-col :xs="11" :md="8">
          <a-typography-text type="secondary">ИНН</a-typography-text>
          <a-typography-paragraph @click="onChange = true" v-model:content="info.govermentRegNumber" editable />
        </a-col>
      </a-row>
      <a-button class="lets_go_btn mt-8" type="primary" size="large" v-show="onChange"
        html-type="submit">Отправить</a-button>
    </form>
  </div>
</template>
<style></style>
