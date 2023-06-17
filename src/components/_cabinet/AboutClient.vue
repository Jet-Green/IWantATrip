<script setup>
import { computed, ref } from "vue";
import { useAuth } from "../../stores/auth";
import { message } from "ant-design-vue";

const userStore = useAuth();
const user = userStore.user;
let info = userStore.user.fullinfo;
let onChange = ref(false);
const isEdit = ref(false)

const companyName = computed(() => {
  return info.companyName ? info.companyName : "**********";
});

const creatorsType = computed(() => {
  return info.creatorsType == "author"
    ? "Автор тура"
    : info.creatorsType == "operator"
      ? "Туроператор"
      : "Турагентство";
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
      isEdit.value = false
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

      <a-row class="cols-container">
        <a-col :xs="24" :md="8">
          <a-typography-text type="secondary" class="w-100">E-mail</a-typography-text>
          <a-typography-paragraph class="w-100" v-model:content="user.email" />
        </a-col>

        <a-col :xs="24" :md="8">
          <a-typography-text type="secondary" class="w-100">Телефон</a-typography-text>
          <a-typography-paragraph v-model:content="info.phone" :editable="isEdit" class="w-100" />
        </a-col>
      </a-row>
      <div v-if="user.trips.length">
        <h3>О создателе тура</h3>

        <a-row>
          <a-col :xs="24" :md="8">
            <a-typography-text type="secondary" class="w-100">Юр. статус</a-typography-text>
            <a-select v-if="isEdit" :trigger="['click']" v-model:value="info.type" class="w-100 pa-4">
              <a-select-option value="phys">Физическое лицо</a-select-option>
              <a-select-option value="indpred">Инд. предприниматель</a-select-option>
              <a-select-option value="company">Юридическое лицо</a-select-option>
            </a-select>
            <p v-else> {{ type }}</p>
          </a-col>
          <a-col :xs="24" :md="8">
            <a-typography-text type="secondary" class="w-100">Тип создателя</a-typography-text>
            <a-select v-if="isEdit" :trigger="['click']" v-model:value="info.creatorsType" class="w-100 pa-4">
              <a-select-option value="author">Автор тура</a-select-option>
              <a-select-option value="operator" v-if="info.type != 'phys'">Туроператор</a-select-option>
              <a-select-option value="agency"
                v-if="info.type != 'phys' && info.type != 'indpred'">Турагенство</a-select-option>
            </a-select>
            <p v-else>{{ creatorsType }}</p>
          </a-col>

        </a-row>
        <a-row>
          <a-col :xs="24" :md="8" v-if="info.type == 'company'">
            <a-typography-text type="secondary" class="w-100">Название фирмы</a-typography-text>
            <a-typography-paragraph v-model:content="info.companyName" :editable="isEdit" class="w-100" />
          </a-col>
          <a-col :xs="24" :md="8" v-else>
            <a-typography-text type="secondary" class="w-100">Фамилия Имя</a-typography-text>
            <a-typography-paragraph v-model:content="info.fullname" :editable="isEdit" class="w-100" />
          </a-col>

          <a-col :xs="24" :md="8" v-if="info.type != 'phys'">
            <a-typography-text type="secondary" class="w-100">ИНН</a-typography-text>
            <a-typography-paragraph class="w-100" :editable="isEdit" v-model:content="info.govermentRegNumber" />
          </a-col>


        </a-row>
      </div>
      <a-button v-if="isEdit" class="lets_go_btn mt-8" type="primary" html-type="submit">Отправить</a-button>
      <a-button v-else class="lets_go_btn mt-8" type="primary" @click="isEdit = true">Изменить</a-button>
    </form>
  </div>
</template>
<style lang="scss" scoped>
.w-100 {
  width: 100%;
}
</style>
