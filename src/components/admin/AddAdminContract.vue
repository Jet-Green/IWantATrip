<script setup>
import { reactive, ref, watch } from "vue";
import { useContract } from '../../stores/contract'
// import { Form, Field, ErrorMessage } from "vee-validate";
// import * as yup from "yup";

let contractStore = useContract()

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
  billingDescriptor: "",
  fullName: "",
  name: "",
  inn: "",
  kpp: "",
  okved: "",
  ogrn: "",
  addresses: [
    {
      type: "actual",
      zip: "427627",
      country: "RUS",
      city: "Глазов",
      street: "ул. Калинина, 2А"
    }
  ],
  email: "",
  founders: {
    individuals: [
      {
        firstName: "Зубенко",
        lastName: "Михаил",
        citizenship: "Мафиозник",
        address: "адрес"
      }
    ]
  },
  ceo: {
    firstName: "",
    lastName: "",
    middleName: "",
    birthDate: "",
    phone: "",
    country: ""
  },
  siteUrl: "",
  bankAccount: {
    account: "",
    bankName: "",
    bik: "",
    details: "",
    tax: "",
  },
  fiscalization: { company: "OrangeData" }
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

async function addContract() {
  let res = await contractStore.createContract(contractForm, contractEmail.value)
  console.log(res);
  if (res.status == 200) {
    Object.assign(contractForm, {
      billingDescriptor: "",
      fullName: "",
      name: "",
      inn: "",
      kpp: "",
      okved: "",
      ogrn: "",
      addresses: [
        {
          type: "actual",
          zip: "427627",
          country: "RUS",
          city: "Глазов",
          street: "ул. Калинина, 2А"
        }
      ],
      email: "",
      founders: {
        individuals: [
          {
            firstName: "Зубенко",
            lastName: "Михаил",
            citizenship: "Мафиозник",
            address: "адрес"
          }
        ]
      },
      ceo: {
        firstName: "",
        lastName: "",
        middleName: "",
        birthDate: "",
        phone: "",
        country: ""
      },
      siteUrl: "",
      bankAccount: {
        account: "",
        bankName: "",
        bik: "",
        details: "",
        tax: "",
      },
      fiscalization: { company: "OrangeData" }
    })

    contractEmail.value = ""
  }
}

// need modification
let submitCount = ref(0)
async function submit() {
  submitCount.value += 1
  if (submitCount.value > 1) {
    return
  }
  if (contractEmail.value.length >= 3) {
    await addContract()
  }
}
</script>
<template>
  <a-row>
    <a-col :span="24">
      <h3>Договоры</h3>
      <form @submit.prevent="submit" class="ma-16">
        <a-row :gutter="[16, 16]">
          <a-col :span="24">
            billingDescriptor
            <a-input placeholder="Название" v-model:value="contractForm.billingDescriptor"></a-input>
          </a-col>
          <a-col :span="24">
            fullName
            <a-input placeholder="Название" v-model:value="contractForm.fullName"></a-input>
          </a-col>
          <a-col :span="24">
            name
            <a-input placeholder="Название" v-model:value="contractForm.name"></a-input>
          </a-col>
          <a-col :span="24">
            ИНН
            <a-input placeholder="1010101010" v-model:value="contractForm.inn"></a-input>
          </a-col>
          <a-col :span="24">
            kpp
            <a-input placeholder="999999999" v-model:value="contractForm.kpp"></a-input>
          </a-col>
          <a-col :span="24">
            okved
            <a-input placeholder="999999999" v-model:value="contractForm.okved"></a-input>
          </a-col>
          <a-col :span="24">
            ОГРН
            <a-input placeholder="СГГККННХХХХХЧ" v-model:value="contractForm.ogrn"></a-input>
          </a-col>

          {{ contractForm.addresses }}
          <!-- <a-col :span="24">
            Юридический адрес
            <a-auto-complete :value="value" @update:value="handleChange" style="width: 100%" :options="possibleLocations"
              placeholder="Глазов" @select="selectStartLocationYr">
            </a-auto-complete>
          </a-col>
          <a-col :span="24">
            Фактический адрес
            <a-auto-complete :value="value" @update:value="handleChange" style="width: 100%" :options="possibleLocations"
              placeholder="Глазов" @select="selectStartLocationFact">
            </a-auto-complete>
          </a-col> -->
          <a-col :span="24">
            email
            <a-input placeholder="СГГККННХХХХХЧ" v-model:value="contractForm.email"></a-input>
          </a-col>

          founders
          <a-col :span="24">
            firstName
            <a-input placeholder="" v-model:value="contractForm.founders.individuals[0].firstName"></a-input>
            lastName
            <a-input placeholder="" v-model:value="contractForm.founders.individuals[0].lastName"></a-input>
            citizenship
            <a-input placeholder="" v-model:value="contractForm.founders.individuals[0].citizenship"></a-input>
            address
            <a-input placeholder="" v-model:value="contractForm.founders.individuals[0].address"></a-input>
          </a-col>

          ceo
          <a-col :span="24">
            firstName
            <a-input placeholder="" v-model:value="contractForm.ceo.firstName"></a-input>
            lastName
            <a-input placeholder="" v-model:value="contractForm.ceo.lastName"></a-input>
            middleName
            <a-input placeholder="" v-model:value="contractForm.ceo.middleName"></a-input>
            birthDate
            <a-input placeholder="" v-model:value="contractForm.ceo.birthDate"></a-input>
            phone
            <a-input placeholder="" v-model:value="contractForm.ceo.phone"></a-input>
            country
            <a-input placeholder="" v-model:value="contractForm.ceo.country"></a-input>
          </a-col>

          siteUrl
          <a-col :span="24">
            <a-input placeholder="СГГККННХХХХХЧ" v-model:value="contractForm.siteUrl"></a-input>
          </a-col>

          bankAccount
          <a-col :span="24">
            account
            <a-input placeholder="СГГККННХХХХХЧ" v-model:value="contractForm.bankAccount.account"></a-input>
            bankName
            <a-input placeholder="СГГККННХХХХХЧ" v-model:value="contractForm.bankAccount.bankName"></a-input>
            bik
            <a-input placeholder="СГГККННХХХХХЧ" v-model:value="contractForm.bankAccount.bik"></a-input>
            details
            <a-input placeholder="СГГККННХХХХХЧ" v-model:value="contractForm.bankAccount.details"></a-input>
            tax
            <a-input placeholder="СГГККННХХХХХЧ" v-model:value="contractForm.bankAccount.tax"></a-input>
          </a-col>

          fiscalization
          <a-col :span="24">
            company
            <a-input placeholder="СГГККННХХХХХЧ" v-model:value="contractForm.fiscalization.company"></a-input>
          </a-col>
          <a-col :span="24" :sm="18" class="mb-16">
            <a-input placeholder="email пользователя" v-model:value="contractEmail"></a-input>
          </a-col>
          <a-col :span="24" :sm="6">
            <a-button class="lets_go_btn" type="primary" html-type="submit">Отправить
            </a-button>
          </a-col>
        </a-row>
      </form>
    </a-col>
  </a-row>
</template>
