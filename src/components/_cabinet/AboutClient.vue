<script setup>
import { useAuth } from "../../stores/auth";
const userStore = useAuth();
const user = userStore.user;
const info = user.fullinfo;
info.companyName ? info.companyName : "**********"
if(info.companyName){
  console.log(1);
} else{
  info.companyName = "**********";
}
</script>
<template>
  <div v-if="info">
    <a-row style="padding-left:12px">
      <a-avatar
        style="margin-right: 8px; font-size: large; font-weight: bold"
        size="large"
        >{{ user.fullname[0] }}</a-avatar
      >
      <h3 style="font-size: 28px; font-weight: bold">{{ user.fullname }}</h3>
    </a-row>

    <a-row :xs="22" :md="18" :lg="16" style="padding-left:12px">
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
        <a-typography-paragraph v-model:content="info.companyName" editable ></a-typography-paragraph>
      </a-col>
    </a-row>

    <a-row :xs="22" :md="18" :lg="16" style="padding-left:12px">
      <a-col :xs="11" :md="8" :lg="5">
        <a-typography-text type="secondary">Статус пользователя</a-typography-text>
        <h5 style="font-size: 16px">
          {{
            info.creatorsType == "author"
              ? "Автор тура"
              : info.creatorsType == "operator"
              ? "Туроператор"
              : "Турагенство"
          }}
        </h5>
      </a-col>

      <a-col :xs="11" :md="8" :lg="5">
        <a-typography-text type="secondary">Юр. статус</a-typography-text>
        <h5 style="font-size: 16px">
          {{
            info.type == "phys"
              ? "Физическое лицо"
              : info.type == "company"
              ? "Юридическое лицо"
              : "Индивидуальный предприниматель"
          }}
        </h5>
      </a-col>

      <a-col :xs="11" :md="8" :lg="5">
        <a-typography-text type="secondary">ИНН</a-typography-text>
        <h5 style="font-size: 16px">{{ info.govermentRegNumber ? info.govermentRegNumber : "**********"}}</h5>
      </a-col>
    </a-row>
  </div>
</template>
<style>
</style>
