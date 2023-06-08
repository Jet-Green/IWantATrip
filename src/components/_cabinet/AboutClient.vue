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

      <a-row :xs="22" :md="18" :lg="16" class="cols-container">
        <a-col :xs="24" :md="8">
          <a-typography-text type="secondary" class="w-100">E-mail</a-typography-text>
          <a-typography-paragraph class="w-100" v-model:content="user.email" />
        </a-col>

        <a-col :xs="24" :md="8">
          <a-typography-text type="secondary" class="w-100">Телефон</a-typography-text>
          <a-typography-paragraph v-model:content="info.phone" editable @click="onChange = true" class="w-100" />
        </a-col>

        <a-col :xs="24" :md="8">
          <a-typography-text type="secondary" class="w-100">Юридический статус</a-typography-text>
          <a-select @click="onChange = true" :trigger="['click']" v-model:value="info.type" :bordered="false"
            class="w-100">
            <a-select-option value="phys">Физическое лицо</a-select-option>
            <a-select-option value="indpred">Инд. предприниматель</a-select-option>
            <a-select-option value="company">Юридическое лицо</a-select-option>
          </a-select>
        </a-col>

        <a-col :xs="24" :md="8">
          <a-typography-text type="secondary" class="w-100">Статус пользователя</a-typography-text>
          <a-select @click="onChange = true" :trigger="['click']" v-model:value="info.creatorsType" :bordered="false"
            class="w-100">
            <a-select-option value="author">Автор тура</a-select-option>
            <a-select-option value="operator" v-if="info.type != 'phys'">Туроператор</a-select-option>
            <a-select-option value="agency"
              v-if="info.type != 'phys' && info.type != 'entrepreneur'">Турагенство</a-select-option>
          </a-select>
        </a-col>

        <a-col :xs="24" :md="8" v-if="info.type == 'company'">
          <a-typography-text type="secondary" class="w-100">Название фирмы</a-typography-text>
          <a-typography-paragraph v-model:content="info.companyName" editable @click="onChange = true" class="w-100" />
        </a-col>
        <a-col :xs="24" :md="8" v-else>
          <a-typography-text type="secondary" class="w-100">Фамилия Имя</a-typography-text>
          <a-typography-paragraph v-model:content="info.fullname" editable @click="onChange = true" class="w-100" />
        </a-col>

        <a-col :xs="24" :md="8" v-if="info.type != 'phys'">
          <a-typography-text type="secondary" class="w-100">ИНН</a-typography-text>
          <a-typography-paragraph class="w-100" @click="onChange = true" v-model:content="info.govermentRegNumber"
            editable />
        </a-col>
      </a-row>
      <a-button class="lets_go_btn mt-8" type="primary" size="large" v-show="onChange"
        html-type="submit">Отправить</a-button>
    </form>
  </div>
</template>
<style lang="scss" scoped>
.w-100 {
  width: 100%;
}
</style>
