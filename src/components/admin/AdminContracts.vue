<script setup>
import { reactive, ref } from "vue";

let addContractModal = ref(false);

let contractEmail = ref("");
let contractForm = reactive({
  name: "",
  inn: "",
  kpp: "",
  ogrn: "",
  yr_address: "",
  fact_address: "",
  checking_account: "",
  checking_account_bank: "",
  cash_account: "",
  cash_account_bank: "",
  bik: "",
  phone: "",
  email: "",
  director: "",
});

function addContract() {
  // пока только вывести
  console.log(contractForm);
}
</script>
<template>
  <a-row>
    <a-col :span="24">
      <h3>Договоры</h3>
      <a-button type="primary" class="lets_go_btn" @click="addContractModal = true"
        >добавить</a-button
      >
      <a-modal
        v-model:open="addContractModal"
        title="Добавить контракт"
        @ok="addContract"
        ok-text="отправить"
        cancel-text="отмена"
      >
        <a-input
          placeholder="email"
          size="large"
          v-modelv-model="contractEmail"
        ></a-input>
      </a-modal>
      <Form class="ma-16" @submit="submit">
        <a-row :gutter="[16, 16]">
          <a-col :span="24">
            Название
            <a-input placeholder="Название" v-model="contractForm.name"></a-input>
          </a-col>
          <a-col :span="24">
            ИНН
            <a-input placeholder="14141414141414" v-model="contractForm.inn"></a-input>
          </a-col>
          <a-col :span="24">
            КПП
            <a-input placeholder="1111111111" v-model="contractForm.kpp"></a-input>
          </a-col>
          <a-col :span="24">
            ОГРН
            <a-input placeholder="123123123123" v-model="contractForm.ogrn"></a-input>
          </a-col>
          <a-col :span="24">
            Юридический адрес
            <a-input
              placeholder="тут нужно локации"
              v-model="contractForm.yr_address"
            ></a-input>
          </a-col>
          <a-col :span="24">
          Фактический адрес
            <a-input
              placeholder="и тут надо локации"
              v-model="contractForm.fact_address"
            ></a-input>
          </a-col>
          <a-col :span="24">
            Р/сч
            <a-input placeholder="und" v-model="contractForm.checking_account"></a-input>
          </a-col>
          <a-col :span="24">
            В каком банке?
            <a-input
              placeholder="und"
              v-model="contractForm.checking_account_bank"
            ></a-input>
          </a-col>
          <a-col :span="24">
            К/сч
            <a-input placeholder="und" v-model="contractForm.cash_account"></a-input>
          </a-col>
          <a-col :span="24">
            Отделение
            <a-input placeholder="und" v-model="contractForm.cash_account_bank"></a-input>
          </a-col>
          <a-col :span="24">
            БИК
            <a-input placeholder="04040404040" v-model="contractForm.bik"></a-input>
          </a-col>
          <a-col :span="24">
            Телефон
            <a-input placeholder="80000000000" v-model="contractForm.phone"></a-input>
          </a-col>
          <a-col :span="24">
            Электронная почта
            <a-input placeholder="ivanov@mail.ru" v-model="contractForm.email"></a-input>
          </a-col>
          <a-col :span="24">
            Директор
            <a-input
              placeholder="Иванов Иван Иванович"
              v-model="contractForm.director"
            ></a-input>
          </a-col>
        </a-row>
      </Form>
    </a-col>
  </a-row>
</template>
