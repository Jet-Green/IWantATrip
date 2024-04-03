<script setup>
import { reactive, ref, watch } from "vue";
import { useContract } from "../../stores/contract";
import BackButton from '../../components/BackButton.vue';
import { useAuth } from "../../stores/auth.js";

import { useRouter } from 'vue-router'


let router = useRouter()


let userStore = useAuth();

let contractStore = useContract();

let LocationSearchRequest = ref("");
let possibleLocations = ref([]);

let contractEmail = ref(userStore.user.email);
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
      zip: "",
      country: "RUS",
      city: "",
      street: "",
    },
    {
      type: "legal",
      zip: "",
      country: "RUS",
      city: "",
      street: "",
    },
  ],
  email: "",
  founders: {
    individuals: [

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



async function addContract() {
  let res = await contractStore.registerContract(contractForm, contractEmail.value);
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
          zip: "",
          country: "RUS",
          city: "",
          street: "",
        },
        {
          type: "legal",
          zip: "",
          country: "RUS",
          city: "",
          street: "",
        },
      ],
      email: "",
      founders: {
        individuals: [

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
        tax: 7,
      },
      fiscalization: { company: "OrangeData" },
    });

    contractEmail.value = "";
    router.push('/fourothree')
  }
}
const addFounders = () => {
  contractForm.founders.individuals.push({
    firstName: "",
    lastName: "",
    citizenship: "Россия",
    address: "",
  });
};
const removeFounders = (item) => {
  let index = contractForm.founders.individuals.indexOf(item);
  if (index !== -1) {
    contractForm.founders.individuals.splice(index, 1);
  }
};



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
watch(
  () => contractForm.inn,
  () => {
    if (contractForm.inn.length == 12) {
      contractForm.kpp = '000000000'
    }

  }
)
</script>
<template>
  <div>
    <BackButton />
    <a-row class="justify-center d-flex">
      <a-col :xs="22" :xl="16">

        <h2>Данные для договора</h2>
        <p style="font-size:10px">Внимательно и аккуратно заполните форму</p>

        <form @submit.prevent="submit" class="ma-16">
          <a-row :gutter="[16, 16]">
            <a-col :span="24">
              Полное наименование
              <a-input placeholder="Общество с ограниченной ответственностью 'Огонёк'"
                v-model:value="contractForm.fullName" required></a-input>
            </a-col>
            <a-col :span="24" :md="12">
              Отображение в выписках, латиница
              <a-input placeholder="Ogonek" v-model:value="contractForm.billingDescriptor" required></a-input>
            </a-col>
            <a-col :span="24" :md="12">
              Краткое наименование
              <a-input placeholder="ООО 'Огонёк'" v-model:value="contractForm.name" required></a-input>
            </a-col>
            <a-col :span="12">
              ИНН
              <a-input placeholder="1837013663" v-model:value="contractForm.inn" required></a-input>
            </a-col>
            <a-col :span="12">
              КПП
              <a-input placeholder="183701001" v-model:value="contractForm.kpp" required></a-input>
            </a-col>
            <a-col :span="12">
              ОКВЭД
              <a-input placeholder="79.12" v-model:value="contractForm.okved" required></a-input>
            </a-col>
            <a-col :span="12">
              ОГРН
              <a-input placeholder="1151837000754" v-model:value="contractForm.ogrn" required></a-input>
            </a-col>
            <a-col :span="12">
              email
              <a-input placeholder="fleshtur19@gmail.com" v-model:value="contractForm.email" required></a-input>
            </a-col>
            <a-col :span="12">
              Сайт
              <a-input placeholder="https://glazov-flash.ru" v-model:value="contractForm.siteUrl" required></a-input>
            </a-col>

            <a-col :xs="20">
              <h3>Адреса</h3>
            </a-col>

            <a-col :span="24">

              <h4>Фактический</h4>
              <a-row :gutter="[4, 4]">

                <a-col :xs="12">
                  Почтовый индекс
                  <a-input placeholder="427620" v-model:value="contractForm.addresses[0].zip" required></a-input>
                </a-col>

                <a-col :xs="12">
                  Город/поселок
                  <a-input placeholder="Глазов" v-model:value="contractForm.addresses[0].city" required></a-input>
                </a-col>
                <a-col :xs="24">
                  Улица
                  <a-input placeholder="Красногорский тракт, 3" v-model:value="contractForm.addresses[0].street"
                    required></a-input>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="24">
              <h4>Юридический</h4>
              <a-row :gutter="[4, 4]">

                <a-col :xs="12">
                  Почтовый индекс
                  <a-input placeholder="427620" v-model:value="contractForm.addresses[1].zip" required></a-input>
                </a-col>

                <a-col :xs="12">
                  Город/поселок
                  <a-input placeholder="Глазов" v-model:value="contractForm.addresses[1].city" required></a-input>
                </a-col>
                <a-col :xs="24">
                  Улица
                  <a-input placeholder="Красногорский тракт, 3" v-model:value="contractForm.addresses[1].street"
                    required></a-input>
                </a-col>
              </a-row>

            </a-col>


            <a-col :span="24">
              <h3>Учредители <a-button @click="addFounders" shape="circle">
                  <span class="mdi mdi-plus" style="cursor: pointer"></span>
                </a-button></h3>
              <a-row v-for="(item, index) in contractForm.founders.individuals" :key="index" align="middle"
                class="mb-4 d-flex" :gutter="[4, 4]">
                <a-col :xs="22">
                  <a-row :gutter="[4, 4]">
                    <a-col :xs="12">
                      Имя
                      <a-input placeholder="Иван" v-model:value="item.firstName" required></a-input>
                    </a-col>
                    <a-col :xs="12">
                      Фамилия
                      <a-input placeholder="Иванов" v-model:value="item.lastName" required></a-input>
                    </a-col>
                    <a-col :xs="12">
                      Гражданство
                      <a-input placeholder="Россия" v-model:value="item.citizenship" required></a-input>
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
            </a-col>

            <a-col :xs="24">
              <h3>Руководитель</h3>
            </a-col>
            <a-col :xs="12">
              Фамилия
              <a-input placeholder="Иванов" v-model:value="contractForm.ceo.lastName" required></a-input>
            </a-col>
            <a-col :xs="12">
              Имя
              <a-input placeholder="Иван" v-model:value="contractForm.ceo.firstName" required></a-input>
            </a-col>

            <a-col :xs="12">
              Отчество
              <a-input placeholder="Иванович" v-model:value="contractForm.ceo.middleName" required></a-input>
            </a-col>
            <a-col :xs="12">
              Телефон
              <a-input placeholder="89128523316" v-model:value="contractForm.ceo.phone" required></a-input>
            </a-col>
            <a-col :xs="12">
              Гражданство
              <a-input placeholder="RUS" v-model:value="contractForm.ceo.country" disabled></a-input>
            </a-col>



            <a-col :xs="24">
              <h3>Банк</h3>
            </a-col>
            <a-col :xs="12">
              Расчетный счет
              <a-input placeholder="40702810209000055117" v-model:value="contractForm.bankAccount.account"
                required></a-input>
            </a-col>
            <a-col :xs="12">
              Наименование банка
              <a-input placeholder="АКБ 'Датабанк' ПАО" v-model:value="contractForm.bankAccount.bankName"
                required></a-input>
            </a-col>
            <a-col :xs="12">
              БИК
              <a-input placeholder="049401871" v-model:value="contractForm.bankAccount.bik" required></a-input>
            </a-col>
            <a-col :xs="12">
              Описание платежа
              <a-input placeholder='Платформа \"Города и Веси\" оплата тура'
                v-model:value="contractForm.bankAccount.details" disabled></a-input>
            </a-col>
            <!-- <a-col :span="24">
                Комиссия
                <a-input-number placeholder="7" v-model:value="contractForm.bankAccount.tax"></a-input-number>
              </a-col> -->



            <!-- <a-col :span="24">
              <h3>Фискализация</h3>
            </a-col>
            <a-col :span="12">
                <a-input placeholder="СГГККННХХХХХЧ" v-model:value="contractForm.fiscalization.company"></a-input>
              </a-col> -->
            <a-divider></a-divider>
            <a-col :span="12">
              Кабинет(email) контракта
              <a-input placeholder="fleshtur19@gmail.com" v-model:value="contractEmail" disabled></a-input>
            </a-col>
            <a-col :span="24" class="d-flex justify-center pa-16">
              <a-button class="lets_go_btn" type="primary" html-type="submit">Отправить
              </a-button>
            </a-col>
          </a-row>

        </form>
      </a-col>
    </a-row>

  </div>
</template>
