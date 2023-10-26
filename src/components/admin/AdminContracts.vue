<script setup>
import { reactive, ref } from "vue";
import { useContract } from '../../stores/contract'
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

let contractStore = useContract()

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
let formSchema = yup.object({
  name: yup.string().required("заполните поле"),
  inn: yup.string().required("заполните поле"),
  kpp: yup.string().required("заполните поле"),
  ogrn: yup.string().required("заполните поле"),
  yr_address: yup.string().required("заполните поле"),
  fact_address: yup.string().required("заполните поле"),
  checking_account: yup.string().required("заполните поле"),
  checking_account_bank: yup.string().required("заполните поле"),
  cash_account: yup.string().required("заполните поле"),
  cash_account_bank: yup.string().required("заполните поле"),
  bik: yup.string().required("заполните поле"),
  phone: yup.string().required("заполните поле"),
  email: yup.string().required("заполните поле"),
  director: yup.string().required("заполните поле"),
});
async function addContract() {
  let res = await contractStore.createContract(contractForm)
  // пока только вывести
  console.log(res);
}
</script>
<template>
  <a-row>
    <a-col :span="24">
      <h3>Договоры</h3>
      <a-button type="primary" class="lets_go_btn" @click="addContractModal = true">добавить</a-button>
      <a-modal v-model:open="addContractModal" title="Добавить контракт" @ok="addContract" ok-text="отправить"
        cancel-text="отмена">
        <a-input placeholder="email" size="large" v-model:value="contractEmail"></a-input>
      </a-modal>
      <Form :validation-schema="formSchema" v-slot="{ meta }" @submit="submit" class="ma-16">
        <a-row :gutter="[16, 16]">

          <a-col :span="24">
            <Field name="name" v-slot="{ value, handleChange }" v-model="contractForm.name">
                Название
                  <a-input placeholder="Название" @update:value="handleChange" :value="value"></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="name" class="error-message" />
              </Transition>
          </a-col>
          <a-col :span="24">
            <Field name="inn" v-slot="{ value, handleChange }" v-model="contractForm.inn">
              ИНН
                  <a-input placeholder="14141414141414" @update:value="handleChange" :value="value"></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="inn" class="error-message" />
              </Transition>
          </a-col>
          <a-col :span="24">
            <Field name="kpp" v-slot="{ value, handleChange }" v-model="contractForm.kpp">
              КПП
                  <a-input placeholder="1111111111"  @update:value="handleChange" :value="value"></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="kpp" class="error-message" />
              </Transition>
          </a-col>
          <a-col :span="24">
            <Field name="ogrn" v-slot="{ value, handleChange }" v-model="contractForm.ogrn">
              ОГРН
                  <a-input placeholder="123123123123"  @update:value="handleChange" :value="value"></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="ogrn" class="error-message" />
              </Transition>
          </a-col>
          <a-col :span="24">
            <Field name="yr_address" v-slot="{ value, handleChange }" v-model="contractForm.yr_address">
              Юридический адрес
                  <a-input placeholder="тут нужно локации"  @update:value="handleChange" :value="value"></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="yr_address" class="error-message" />
              </Transition>
          </a-col>
          <a-col :span="24">
            <Field name="fact_address" v-slot="{ value, handleChange }" v-model="contractForm.fact_address">
              Фактический адрес
                  <a-input placeholder="тут нужно локации"  @update:value="handleChange" :value="value"></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="fact_address" class="error-message" />
              </Transition>
          </a-col>
          <a-col :span="24">
            <Field name="checking_account" v-slot="{ value, handleChange }" v-model="contractForm.checking_account">
              Р/сч
                  <a-input placeholder="und"  @update:value="handleChange" :value="value"></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="checking_account" class="error-message" />
              </Transition>
          </a-col>
          <a-col :span="24">
          <Field name="checking_account_bank" v-slot="{ value, handleChange }" v-model="contractForm.checking_account_bank">
              Отделение банка
                  <a-input placeholder="und"  @update:value="handleChange" :value="value"></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="checking_account_bank" class="error-message" />
              </Transition>
          </a-col>
          <a-col :span="24">
            <Field name="cash_account" v-slot="{ value, handleChange }" v-model="contractForm.cash_account">
              К/сч
                  <a-input placeholder="und"  @update:value="handleChange" :value="value"></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="cash_account" class="error-message" />
              </Transition>
          </a-col>
          <a-col :span="24">
            <Field name="cash_account_bank" v-slot="{ value, handleChange }" v-model="contractForm.cash_account_bank">
              Отделение банка
                  <a-input placeholder="und"  @update:value="handleChange" :value="value"></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="cash_account_bank" class="error-message" />
              </Transition>
          </a-col>
          <a-col :span="24">
            <Field name="bik" v-slot="{ value, handleChange }" v-model="contractForm.bik">
              БИК
                  <a-input placeholder="04040404040"  @update:value="handleChange" :value="value"></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="bik" class="error-message" />
              </Transition>
          </a-col>
          <a-col :span="24">
            <Field name="phone" v-slot="{ value, handleChange }" v-model="contractForm.phone">
              Телефон
                  <a-input placeholder="80000000000"  @update:value="handleChange" :value="value"></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="phone" class="error-message" />
              </Transition>
          </a-col>
          <a-col :span="24">
            <Field name="email" v-slot="{ value, handleChange }" v-model="contractForm.email">
              Электронная почта
                  <a-input placeholder="ivanov@mail.ru"  @update:value="handleChange" :value="value"></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="email" class="error-message" />
              </Transition>
          </a-col>
          <a-col :span="24">
            <Field name="director" v-slot="{ value, handleChange }" v-model="contractForm.director">
              Директор
                  <a-input placeholder="Иванов Иван Иванович"  @update:value="handleChange" :value="value"></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="director" class="error-message" />
              </Transition>
          </a-col>
        </a-row>
      </Form>
    </a-col>
  </a-row>
</template>
