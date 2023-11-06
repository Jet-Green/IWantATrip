<script setup>
import { reactive, ref, watch } from "vue";
import { useContract } from '../../stores/contract'
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

let contractStore = useContract()

let addContractModal = ref(false);
let yrLocationSearchRequest = ref("")
let factLocationSearchRequest = ref("")
let possibleLocations = ref([])

function selectStartLocationYr(selected) {
  for (let l of possibleLocations.value) {
    // l.value - name
    if (l.value == selected) {
      contractForm.yr_address = l.location
    }
  }
}
function selectStartLocationFact(selected) {
  for (let l of possibleLocations.value) {
    // l.value - name
    if (l.value == selected) {
      contractForm.fact_address = l.location
    }
  }
}

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
// need modification
watch(yrLocationSearchRequest, async (newValue, oldValue) => {
  if (newValue.trim().length > 2 && newValue.length > oldValue.length) {
    var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";

    var options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Token " + import.meta.env.VITE_DADATA_TOKEN
      },
      body: JSON.stringify({
        query: newValue,
        count: 5,
        "from_bound": { "value": "city" },
        "to_bound": { "value": "settlement" }
      })
    }

    let res = await fetch(url, options)
    try {
      let suggestions = JSON.parse(await res.text()).suggestions
      possibleLocations.value = []
      for (let s of suggestions) {
        let location = {
          value: s.value,
          location: {
            name: s.value,
            shortName: '',
            type: 'Point',
            coordinates: [
              s.data.geo_lon,
              s.data.geo_lat
            ]
          }
        }

        if (s.data.settlement) {
          location.location.shortName = s.data.settlement
        }
        else if (s.data.city) {
          location.location.shortName = s.data.city
        } else {
          location.location.shortName = s.value
        }

        possibleLocations.value.push(location)
      }
    } catch (error) {
      console.log(error);
    }
  }
})
watch(factLocationSearchRequest, async (newValue, oldValue) => {
  if (newValue.trim().length > 2 && newValue.length > oldValue.length) {
    var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";

    var options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Token " + import.meta.env.VITE_DADATA_TOKEN
      },
      body: JSON.stringify({
        query: newValue,
        count: 5,
        "from_bound": { "value": "city" },
        "to_bound": { "value": "settlement" }
      })
    }

    let res = await fetch(url, options)
    try {
      let suggestions = JSON.parse(await res.text()).suggestions
      possibleLocations.value = []
      for (let s of suggestions) {
        let location = {
          value: s.value,
          location: {
            name: s.value,
            shortName: '',
            type: 'Point',
            coordinates: [
              s.data.geo_lon,
              s.data.geo_lat
            ]
          }
        }

        if (s.data.settlement) {
          location.location.shortName = s.data.settlement
        }
        else if (s.data.city) {
          location.location.shortName = s.data.city
        } else {
          location.location.shortName = s.value
        }

        possibleLocations.value.push(location)
      }
    } catch (error) {
      console.log(error);
    }
  }
})
// need modification
let submitCount = ref(0)
function submit() {

  submitCount.value += 1
  if (submitCount.value > 1) {
    return
  }

  let send = {};
  for (let key in form) {
    send[key] = form[key];
  }

  function close() {
    router.push("/cabinet/me");
    clearForm()
  }

  function clearForm() {
  Object.assign(contractForm,{
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
  close()
  }
}
let formSchema = yup.object({
  name: yup.string().required("заполните поле"),
  email: yup.string().email('неверный формат').required("заполните поле"),
  inn: yup.string().required("заполните поле"),
  kpp: yup.string().required("заполните поле"),
  ogrn: yup.string().required("заполните поле"),
  bik: yup.string().required("заполните поле"),
  yr_address: yup.string().required("заполните поле"),
  fact_address: yup.string().required("заполните поле"),
  checking_account: yup.string().required("заполните поле"),
  checking_account_bank: yup.string().required("заполните поле"),
  cash_account: yup.string().required("заполните поле"),
  cash_account_bank: yup.string().required("заполните поле"),
  phone: yup.string().required("заполните поле"),
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
      <!-- <a-button type="primary" class="lets_go_btn" @click="addContractModal = true"
        >добавить</a-button
      >
      <a-modal
        v-model:open="addContractModal"
        title="Добавить контракт"
        @ok="addContract"
        ok-text="отправить"
        cancel-text="отмена"
      >
        <a-input placeholder="email" size="large" v-model:value="contractEmail"></a-input>
      </a-modal> -->
      <Form
        :validation-schema="formSchema"
        v-slot="{ meta }"
        @submit="submit"
        class="mt-16 mb-16"
      >
        <a-row :gutter="[16, 16]">
          <a-col :span="12">
            <Field
              name="name"
              v-slot="{ value, handleChange }"
              v-model="contractForm.name"
            >
              Название
              <a-input
                placeholder="Название"
                @update:value="handleChange"
                :value="value"
              ></a-input>
            </Field>
            <Transition name="fade">
              <ErrorMessage name="name" class="error-message" />
            </Transition>
          </a-col>
          <a-col :span="12">
            <Field
              name="email"
              v-slot="{ value, handleChange }"
              v-model="contractForm.email"
            >
              Электронная почта
              <a-input
                placeholder="ivanov@mail.ru"
                @update:value="handleChange"
                :value="value"
              ></a-input>
            </Field>
            <Transition name="fade">
              <ErrorMessage name="email" class="error-message" />
            </Transition>
          </a-col>
          <a-col :span="12">
            <Field name="inn" v-slot="{ value, handleChange }" v-model="contractForm.inn">
              ИНН
              <a-input
                placeholder="1010101010"
                @update:value="handleChange"
                :value="value"
                :maxlength="10"
              ></a-input>
            </Field>
            <Transition name="fade">
              <ErrorMessage name="inn" class="error-message" />
            </Transition>
          </a-col>
          <a-col :span="12">
            <Field name="kpp" v-slot="{ value, handleChange }" v-model="contractForm.kpp">
              КПП
              <a-input
                placeholder="999999999"
                @update:value="handleChange"
                :value="value"
                :maxlength="9"
              ></a-input>
            </Field>
            <Transition name="fade">
              <ErrorMessage name="kpp" class="error-message" />
            </Transition>
          </a-col>
          <a-col :span="12">
            <Field
              name="ogrn"
              v-slot="{ value, handleChange }"
              v-model="contractForm.ogrn"
            >
              ОГРН
              <a-input
                placeholder="СГГККННХХХХХЧ"
                @update:value="handleChange"
                :value="value"
                :maxlength="13"
              ></a-input>
            </Field>
            <Transition name="fade">
              <ErrorMessage name="ogrn" class="error-message" />
            </Transition>
          </a-col>
          <a-col :span="12">
            <Field name="bik" v-slot="{ value, handleChange }" v-model="contractForm.bik">
              БИК
              <a-input
                placeholder="999999999"
                @update:value="handleChange"
                :value="value"
                :maxlength="9"
              ></a-input>
            </Field>
            <Transition name="fade">
              <ErrorMessage name="bik" class="error-message" />
            </Transition>
          </a-col>
          <a-col :span="12">
            <Field
              name="yr_address"
              v-slot="{ value, handleChange }"
              v-model="yrLocationSearchRequest"
            >
              Юридический адрес
              <a-auto-complete
                :value="value"
                @update:value="handleChange"
                style="width: 100%"
                :options="possibleLocations"
                placeholder="Глазов"
                @select="selectStartLocationYr"
              >
              </a-auto-complete>
            </Field>
            <Transition name="fade">
              <ErrorMessage name="yr_address" class="error-message" />
            </Transition>
          </a-col>
          <a-col :span="12">
            <Field
              name="fact_address"
              v-slot="{ value, handleChange }"
              v-model="factLocationSearchRequest"
            >
              Фактический адрес
              <a-auto-complete
                :value="value"
                @update:value="handleChange"
                style="width: 100%"
                :options="possibleLocations"
                placeholder="Глазов"
                @select="selectStartLocationFact"
              >
              </a-auto-complete>
            </Field>
            <Transition name="fade">
              <ErrorMessage name="fact_address" class="error-message" />
            </Transition>
          </a-col>
          <a-col :span="12">
            <Field
              name="checking_account"
              v-slot="{ value, handleChange }"
              v-model="contractForm.checking_account"
            >
              Р/сч
              <a-input
                placeholder="20202020202020202020"
                @update:value="handleChange"
                :value="value"
              ></a-input>
            </Field>
            <Transition name="fade">
              <ErrorMessage name="checking_account" class="error-message" />
            </Transition>
          </a-col>
          <a-col :span="12">
            <Field
              name="checking_account_bank"
              v-slot="{ value, handleChange }"
              v-model="contractForm.checking_account_bank"
            >
              Отделение банка
              <a-input
                placeholder=""
                @update:value="handleChange"
                :value="value"
              ></a-input>
            </Field>
            <Transition name="fade">
              <ErrorMessage name="checking_account_bank" class="error-message" />
            </Transition>
          </a-col>
          <a-col :span="12">
            <Field
              name="cash_account"
              v-slot="{ value, handleChange }"
              v-model="contractForm.cash_account"
            >
              К/сч
              <a-input
                placeholder="20202020202020202020"
                @update:value="handleChange"
                :value="value"
              ></a-input>
            </Field>
            <Transition name="fade">
              <ErrorMessage name="cash_account" class="error-message" />
            </Transition>
          </a-col>
          <a-col :span="12">
            <Field
              name="cash_account_bank"
              v-slot="{ value, handleChange }"
              v-model="contractForm.cash_account_bank"
            >
              Отделение банка
              <a-input
                placeholder=""
                @update:value="handleChange"
                :value="value"
              ></a-input>
            </Field>
            <Transition name="fade">
              <ErrorMessage name="cash_account_bank" class="error-message" />
            </Transition>
          </a-col>
          <a-col :span="24">
            <Field
              name="phone"
              v-slot="{ value, handleChange }"
              v-model="contractForm.phone"
            >
              Телефон
              <a-input
                placeholder="80000000000"
                @update:value="handleChange"
                :value="value"
                :maxlength="11"
              ></a-input>
            </Field>
            <Transition name="fade">
              <ErrorMessage name="phone" class="error-message" />
            </Transition>
          </a-col>
          <a-col :span="24">
            <Field
              name="director"
              v-slot="{ value, handleChange }"
              v-model="contractForm.director"
            >
              Директор
              <a-input
                placeholder="Иванов Иван Иванович"
                @update:value="handleChange"
                :value="value"
              ></a-input>
            </Field>
            <Transition name="fade">
              <ErrorMessage name="director" class="error-message" />
            </Transition>
          </a-col>
          <a-button class="lets_go_btn ml-4" type="primary" html-type="submit">Отправить
              </a-button>
        </a-row>
      </Form>
    </a-col>
  </a-row>
</template>
