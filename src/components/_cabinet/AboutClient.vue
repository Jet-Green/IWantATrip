<script setup>
import { useAuth } from "../../stores/auth";

const userStore = useAuth();
const user = userStore.user;
</script>
<template>
  <div>
    <a-row>
      <a-avatar
        style="margin-right: 8px; font-size: large; font-weight: bold"
        size="large">{{user.fullname[0]}}</a-avatar>
      <h3 style="font-size: 28px; font-weight: bold">{{user.fullname}}</h3>
    </a-row>

    <a-col>
      <a-typography-text type="secondary">E-mail</a-typography-text>
      <h5 style="font-size: 16px">{{user.email}}</h5>
    </a-col>
  </div>
</template>
