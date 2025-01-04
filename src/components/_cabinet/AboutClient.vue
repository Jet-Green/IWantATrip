<script setup>
import { useRouter } from "vue-router";
import { useAuth } from "../../stores/auth";

let router = useRouter()
const userStore = useAuth();
const user = userStore.user;
let isCreator =  userStore.user.tinkoffContract||false
let info = userStore.user.fullinfo;
</script>

<template>
  <div v-if="user" class="mt-12">
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
        <a-typography-paragraph v-model:content="info.phone" class="w-100" />
      </a-col>
    </a-row>
    <div v-if="user.tinkoffContract?._id">
      <h3>О создателе тура</h3>
      <a-row>
        <a-col :xs="24" :md="8">
          <a-typography-text type="secondary" class="w-100">Название</a-typography-text>
          <p> {{ user.tinkoffContract.fullName }}</p>
        </a-col>
        <a-col :xs="24" :md="8">
          <a-typography-text type="secondary" class="w-100">email</a-typography-text>
          <p>{{ user.tinkoffContract.email }}</p>
        </a-col>
      </a-row>
      <a-row>
        <a-col :xs="24" :md="8">
          <a-typography-text type="secondary" class="w-100">ИНН</a-typography-text>
          <p>{{ user.tinkoffContract.inn }}</p>
        </a-col>

        <a-col :xs="24" :md="8">
          <a-typography-text type="secondary" class="w-100">Ставка платформы</a-typography-text>
          <p>{{ user.tinkoffContract.bankAccount.tax }} %</p>
        </a-col>
      </a-row>
    </div>

    <a-row :gutter="[5]">
      <a-col v-if='isCreator'>
        <a-button class="btn_light ma-8" @click="router.push('/create-no-help')">
          Создать тур
        </a-button>
      </a-col>

      <a-col v-if='isCreator'>
        <a-button class="btn_light ma-8" @click="router.push('/create-catalog-trip')">
          Создать тур в каталоге
        </a-button>
      </a-col>
      <a-col>
        <a-button class="btn_light ma-8" @click="router.push('/send-idea')">
          Подать идею
        </a-button>
      </a-col>
      <a-col>
        <a-button class="btn_light ma-8" @click="router.push('/create-excursion')">
          создать экскурсию
        </a-button>
      </a-col>
      <a-col>
        <a-button class="btn_light ma-8" @click="router.push('/create-place')">
          создать место
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<style lang="scss" scoped>
.w-100 {
  width: 100%;
}
</style>
