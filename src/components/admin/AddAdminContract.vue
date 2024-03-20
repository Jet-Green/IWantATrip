<script setup>
import { reactive, ref, watch } from "vue";
import { useContract } from "../../stores/contract";

let contractStore = useContract();

let LocationSearchRequest = ref("");
let possibleLocations = ref([]);

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
      street: "ул. Калинина, 2А",
    },
  ],
  email: "",
  founders: {
    individuals: [
      {
        firstName: "",
        lastName: "",
        citizenship: "Россия",
      },
    ],
  },
  ceo: {
    firstName: "",
    lastName: "",
    middleName: "",
    phone: "",
    country: "RUS",
  },
  siteUrl: "",
  bankAccount: {
    account: "",
    bankName: "",
    bik: "",
    details: "Платформа \"Города и Веси\" оплата тура",
    tax: 5,
  },
  fiscalization: { company: "OrangeData" },
});

watch(LocationSearchRequest, async (newValue, oldValue) => {
  if (newValue.trim().length > 2 && newValue.length > oldValue.length) {
    var url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";

    var options = {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Token " + import.meta.env.VITE_DADATA_TOKEN,
      },
      body: JSON.stringify({
        query: newValue,
        count: 5,
        from_bound: { value: "city" },
        to_bound: { value: "settlement" },
      }),
    };

    let res = await fetch(url, options);
    try {
      let suggestions = JSON.parse(await res.text()).suggestions;
      console.log(suggestions);
      possibleLocations.value = [];
      for (let s of suggestions) {
        let location = {
          value: s.value,
          location: {
            name: s.value,
            shortName: "",
            type: "Point",
            coordinates: [s.data.geo_lon, s.data.geo_lat],
          },
        };

        if (s.data.settlement) {
          location.location.shortName = s.data.settlement;
        } else if (s.data.city) {
          location.location.shortName = s.data.city;
        } else {
          location.location.shortName = s.value;
        }

        possibleLocations.value.push(location);
      }
    } catch (error) {
      console.log(error);
    }
  }
});

async function addContract() {
  let res = await contractStore.createContract(contractForm, contractEmail.value);
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
          street: "ул. Калинина, 2А",
        },
      ],
      email: "",
      founders: {
        individuals: [
          {
            firstName: "",
            lastName: "",
            citizenship: "Россия",
          },
        ],
      },
      ceo: {
        firstName: "",
        lastName: "",
        middleName: "",
        phone: "",
        country: "RUS",
      },
      siteUrl: "",
      bankAccount: {
        account: "",
        bankName: "",
        bik: "",
        details: "Платформа \"Города и Веси\" оплата тура",
        tax: 5,
      },
      fiscalization: { company: "OrangeData" },
    });

    contractEmail.value = "";
  }
}
const addFounders = () => {
  contractForm.founders.individuals.push({
    firstName: "",
    lastName: "",
    citizenship: "",
    address: "",
  });
};
const removeFounders = (item) => {
  let index = contractForm.founders.individuals.indexOf(item);
  if (index !== -1) {
    contractForm.founders.individuals.splice(index, 1);
  }
};
const addAdresses = () => {
  contractForm.addresses.push({
    type: "actual",
    zip: "427627",
    country: "RUS",
    city: "Глазов",
    street: "ул. Калинина, 2А",
  });
};
const removeAdresses = (item) => {
  let index = contractForm.addresses.indexOf(item);
  if (index !== -1) {
    contractForm.addresses.splice(index, 1);
  }
};
function selectStartLocation(selected, item) {
  let index = contractForm.founders.individuals.indexOf(item);
  if (index !== -1) {
    for (let l of possibleLocations.value) {
      // l.value - name
      if (l.value == selected) {
        contractForm.founders.individuals[index].address = l.location;
        possibleLocations = [];
      }
    }
  }
}

let submitCount = ref(0);
async function submit() {
  await addContract();
  submitCount.value += 1;
  if (submitCount.value > 1) {
    return;
  }
  if (contractEmail.value.length >= 3) {

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
            fullName
            <a-input placeholder="Название" v-model:value="contractForm.fullName"></a-input>
          </a-col>
          <a-col :span="12">
            billingDescriptor
            <a-input placeholder="Название" v-model:value="contractForm.billingDescriptor"></a-input>
          </a-col>
          <a-col :span="12">
            name
            <a-input placeholder="Название" v-model:value="contractForm.name"></a-input>
          </a-col>
          <a-col :span="12">
            ИНН
            <a-input placeholder="1010101010" v-model:value="contractForm.inn"></a-input>
          </a-col>
          <a-col :span="12">
            kpp
            <a-input placeholder="999999999" v-model:value="contractForm.kpp"></a-input>
          </a-col>
          <a-col :span="12">
            okved
            <a-input placeholder="999999999" v-model:value="contractForm.okved"></a-input>
          </a-col>
          <a-col :span="12">
            ОГРН
            <a-input placeholder="СГГККННХХХХХЧ" v-model:value="contractForm.ogrn"></a-input>
          </a-col>
          <a-col :span="12">
            email
            <a-input placeholder="СГГККННХХХХХЧ" v-model:value="contractForm.email"></a-input>
          </a-col>
          <a-col :span="12">
            siteUrl
            <a-input placeholder="СГГККННХХХХХЧ" v-model:value="contractForm.siteUrl"></a-input>
          </a-col>

          <a-row :gutter="[4, 4]">
            <a-col :xs="20">
              <h3>Addresses</h3>
            </a-col>
            <a-col :xs="4" class="d-flex justify-center">
              <a-button @click="addAdresses" shape="circle">
                <span class="mdi mdi-plus" style="cursor: pointer"></span>
              </a-button>
            </a-col>
          </a-row>

          <a-col :span="24">
            <a-row v-for="(item, index) in contractForm.addresses" :key="index" align="middle" class="mb-4 d-flex">
              <a-col :xs="22">
                <a-row :gutter="[4, 4]">
                  <a-col :xs="12">
                    type
                    <a-input placeholder="" v-model:value="item.type"></a-input>
                  </a-col>
                  <a-col :xs="12">
                    zip
                    <a-input placeholder="" v-model:value="item.zip"></a-input>
                  </a-col>
                  <a-col :xs="12">
                    country
                    <a-input placeholder="RUS" v-model:value="item.country"></a-input>
                  </a-col>
                  <a-col :xs="12">
                    city
                    <a-input placeholder="" v-model:value="item.city"></a-input>
                  </a-col>
                  <a-col :xs="24">
                    street
                    <a-input placeholder="" v-model:value="item.street"></a-input>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="2" style="justify-content: center">
                <a-row justify="center">
                  <a-button @click="removeAdresses(item)" shape="circle">
                    <span class="mdi mdi-minus" style="cursor: pointer"></span>
                  </a-button>
                </a-row>
              </a-col>
            </a-row>
          </a-col>

          <a-row :gutter="[4, 4]">
            <a-col :xs="20">
              <h3>Founders</h3>
            </a-col>
            <a-col :xs="4" class="d-flex justify-center">
              <a-button @click="addFounders" shape="circle">
                <span class="mdi mdi-plus" style="cursor: pointer"></span>
              </a-button>
            </a-col>
          </a-row>

          <a-row v-for="(item, index) in contractForm.founders.individuals" :key="index" align="middle"
            class="mb-4 d-flex" :gutter="[4, 4]">
            <a-col :xs="22">
              <a-row :gutter="[4, 4]">
                <a-col :xs="12">
                  firstName
                  <a-input placeholder="" v-model:value="item.firstName"></a-input>
                </a-col>
                <a-col :xs="12">
                  lastName
                  <a-input placeholder="" v-model:value="item.lastName"></a-input>
                </a-col>
                <a-col :xs="12">
                  citizenship
                  <a-input placeholder="" v-model:value="item.citizenship"></a-input>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="2" class="justify-center">
              <a-row justify="center">
                <a-button @click="removeFounders(item)" shape="circle">
                  <span class="mdi mdi-minus" style="cursor: pointer"></span>
                </a-button>
              </a-row>
            </a-col>
          </a-row>

          <a-row :gutter="[4, 4]">
            <a-col :xs="24">
              <h3>Ceo</h3>
            </a-col>
            <a-col :xs="12">
              firstName
              <a-input placeholder="" v-model:value="contractForm.ceo.firstName"></a-input>
            </a-col>
            <a-col :xs="12">
              lastName
              <a-input placeholder="" v-model:value="contractForm.ceo.lastName"></a-input>
            </a-col>
            <a-col :xs="12">
              middleName
              <a-input placeholder="" v-model:value="contractForm.ceo.middleName"></a-input>
            </a-col>
            <a-col :xs="12">
              phone
              <a-input placeholder="" v-model:value="contractForm.ceo.phone"></a-input>
            </a-col>
            <a-col :xs="12">
              country
              <a-input placeholder="RUS" v-model:value="contractForm.ceo.country"></a-input>
            </a-col>
          </a-row>

          <a-row :gutter="[4, 4]">
            <a-col :xs="24">
              <h3>bankAccount</h3>
            </a-col>
            <a-col :xs="12">
              account
              <a-input placeholder="111111111" v-model:value="contractForm.bankAccount.account"></a-input>
            </a-col>
            <a-col :xs="12">
              bankName
              <a-input placeholder="ООО Сбербанк" v-model:value="contractForm.bankAccount.bankName"></a-input>
            </a-col>
            <a-col :xs="12">
              bik
              <a-input placeholder="11111111" v-model:value="contractForm.bankAccount.bik"></a-input>
            </a-col>
            <a-col :xs="12">
              details
              <a-input placeholder="" v-model:value="contractForm.bankAccount.details"></a-input>
            </a-col>
            <a-col :span="24">
              tax
              <a-input-number placeholder="5" v-model:value="contractForm.bankAccount.tax"></a-input-number>
            </a-col>
          </a-row>

          <a-row :gutter="[4, 4]">
            <a-col :span="24">
              <h3>Fiscalization</h3>
            </a-col>
            <a-col :span="12">
              <a-input placeholder="СГГККННХХХХХЧ" v-model:value="contractForm.fiscalization.company"></a-input>
            </a-col>
            <a-col :span="12">
              <a-input placeholder="email пользователя" v-model:value="contractEmail"></a-input>
            </a-col>
            <a-col :span="24">
              <a-button class="lets_go_btn" type="primary" html-type="submit">Отправить
              </a-button>
            </a-col>
          </a-row>
        </a-row>
      </form>
    </a-col>
  </a-row>
</template>
