<script setup>
import { useAuth } from "../../stores/auth";
const userStore = useAuth();
const user = userStore.user;
const info = user.fullinfo;
info.companyName ? info.companyName : "**********";
console.log(user)
if (info.companyName) {
} else {
  info.companyName = "**********";
}
if (info.creatorsType == "author") {
  info.creatorsType = "Автор тура";
} else {
  info.creatorsType = "Турагенство";
}
if (info.creatorsType == "operator") {
  info.creatorsType = "Туроператор";
}

if (info.type == "phys") {
  info.type = "Физическое лицо";
} else {
  info.type = "Индивидуальный предприниматель";
}
if (info.type == "company") {
  info.type = "Юридическое лицо";
}

if (info.govermentRegNumber) { 
} else {
  info.govermentRegNumber = "**********";
}
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
  <div v-if="info">
  <form action="POST" @submit.prevent="submit" enctype="multipart/form-data">
    <a-row style="padding-left: 12px">
      <a-avatar style="margin-right: 8px; font-size: large; font-weight: bold" size="large">{{
        user.fullname[0]
      }}</a-avatar>
      <h3 style="font-size: 28px; font-weight: bold">{{ user.fullname }}</h3>
    </a-row>

    <a-row :xs="22" :md="18" :lg="16" style="padding-left: 12px">
      <a-col :xs="11" :md="8" :lg="5">
        <a-typography-text type="secondary">E-mail</a-typography-text>
        <!-- <h5 style="font-size: 16px">{{ user.email }}</h5> -->
        <a-typography-paragraph v-model:content="user.email" editable />
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
        <!-- <h5 style="font-size: 16px">{{ info.companyName ? info.companyName : "**********"}}</h5> -->
        <a-typography-paragraph v-model:content="info.companyName" editable></a-typography-paragraph>
      </a-col>
    </a-row>

    <a-row :xs="22" :md="18" :lg="16" style="padding-left: 12px">
      <a-col :xs="11" :md="8" :lg="5">
        <a-typography-text type="secondary">Статус пользователя</a-typography-text>
        <a-typography-paragraph v-model:content="info.creatorsType" editable>
        </a-typography-paragraph>
      </a-col>

      <a-col :xs="11" :md="8" :lg="5">
        <a-typography-text type="secondary">Юр. статус</a-typography-text>
        <a-typography-paragraph v-model:content="info.type" editable>
        </a-typography-paragraph>
      </a-col>

      <a-col :xs="11" :md="8" :lg="5">
        <a-typography-text type="secondary">ИНН</a-typography-text>
        <a-typography-paragraph v-model:content="info.govermentRegNumber" editable>
        </a-typography-paragraph>
        <a-button class="mt-16" type="primary" size="large" html-type="submit"
                >Отправить
              </a-button>
      </a-col>
    </a-row>
  </form>
  </div>
</template>
<style>

</style>
