<script setup>
import { reactive } from 'vue';
const userTypes = [
  {
    value: 'phys',
    label: 'Физическое лицо'
  },
  {
    value: 'entrepreneur',
    label: 'Индивидуальный предприниматель'
  },
  {
    value: 'company',
    label: 'Юридическое лицо'
  }
]

let fullInfo = reactive({
  type: null,
  fullname: null,
  phone: null,
  govermentRegNumber: null,
  companyName: null
})
</script>
<template>
  <h2>О вас</h2>
  <a-row :gutter="[16, 16]">
    <a-col :span="24">
      Вы
      <a-select v-model:value="fullInfo.type" style="width: 100%" :options="userTypes">
      </a-select>
    </a-col>
    <a-col v-if="fullInfo.type == 'phys'" :span="12">
      ФИО
      <a-input v-model:value="fullInfo.fullname" style="width: 100%" placeholder="Иванов Иван Иванович" />
    </a-col>
    <a-col v-if="fullInfo.type == 'phys'" :span="12">
      Телефон
      <a-input v-model:value="fullInfo.phone" style="width: 100%" placeholder="79127528874" />
    </a-col>

    <a-col v-if="fullInfo.type == 'entrepreneur'" :span="12">
      ФИО
      <a-input v-model:value="fullInfo.fullname" style="width: 100%" placeholder="Иванов Иван Иванович" />
    </a-col>
    <a-col v-if="fullInfo.type == 'company'" :span="12">
      Название
      <a-input v-model:value="fullInfo.companyName" style="width: 100%" placeholder="Кубит" />
    </a-col>
    <a-col v-if="(fullInfo.type == 'company') || (fullInfo.type == 'entrepreneur')" :span="12">
      ОГРН
      <a-input v-model:value="fullInfo.govermentRegNumber" style="width: 100%" placeholder="1234567891011" />
    </a-col>
  </a-row>
</template>