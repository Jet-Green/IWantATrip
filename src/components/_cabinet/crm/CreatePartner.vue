<script setup>
import { reactive, ref, watch, onMounted, computed } from 'vue';
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";


import { message } from "ant-design-vue";

import { useRouter, useRoute } from 'vue-router';
import { useAppState } from "../../../stores/appState";
import BackButton from "../../../components/BackButton.vue";
import { useAuth } from '../../../stores/auth';
import { usePartners } from '../../../stores/partner';


const appStore = useAppState();
const userStore = useAuth();
const partnerStore = usePartners();
const router = useRouter();
const route = useRoute();
const partnerId = ref()


// dadata
let possibleLocations = ref([])
let locationSearchRequest = ref("")
function selectStartLocation(selected) {
  for (let l of possibleLocations.value) {
    // l.value - name
    if (l.value == selected) {
      form.location = l.location
    }
  }
}

const form = reactive({
  name: '',
  location: { name: "", shortName: "", type: "Point", coordinates: [] },
  phone: '',
  email: '',
  contactPerson: '',
  category: ''
});

let placeCategory = appStore.appState[0]?.placeCategory.map((name) => { return { value: name } }) ?? []

let formSchema = yup.object({
  name: yup.string().required("заполните поле"),
  // phone: yup.string().required("заполните поле"),
  // email: yup.string().required("заполните поле"),
  // contactPerson: yup.string().required("заполните поле"),
  category: yup.string().required("заполните поле"),
  // https://vee-validate.logaretm.com/v4/examples/array-fields/
});



function close() {
  router.push("/cabinet/partners");
  clearForm()
}
function clearForm() {
  Object.assign(form, {
    name: '',
    location: { name: "", shortName: "", type: "Point", coordinates: [] },
    phone: '',
    email: '',
    contactPerson: '',
    category: ''
  });

}

async function submit() {
  if (partnerId.value) {
    let response = await partnerStore.edit(partnerId.value, form)
    if (response.status == 200) {
      message.config({ duration: 1.5, top: "70vh" });
      message.success({
        content: "Партнер обновлен!", onClose: () => {
          close()
          clearForm()
        },
      });
    }

  } else {
    let toSend = { ...form }
    toSend.author = userStore.user._id
    toSend.createdDate = Date.now()

    let response = await partnerStore.create(toSend)
    if (response.status == 200) {
      message.config({ duration: 1.5, top: "70vh" });
      message.success({
        content: "Партнер создан!", onClose: () => {
          close()
          clearForm()
        },
      });
    }
  }
}

watch(locationSearchRequest, async (newValue, oldValue) => {
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
        "to_bound": { "value": "house" }
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


onMounted(async () => {
  partnerId.value = route.query._id
  if (partnerId.value) {
    let res = await partnerStore.getById(partnerId.value)
    if (res.status == 200) {
      Object.assign(form, res.data)
      form.location = res.data.location
      locationSearchRequest.value = res.data.location.name

    }
  }
})

</script>
<template>
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="12">
        <h2>Создать партнера</h2>
        <Form :validation-schema="formSchema" v-slot="{ meta }" @submit="submit">
          <a-row :gutter="[16, 16]">
            <a-col :span="24">
              <Field name="name" v-slot="{ value, handleChange }" v-model="form.name">
                Наименование<sup>*</sup>
                <a-input placeholder="Наименование партнера" @update:value="handleChange" :value="value"
                  allow-clear></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="name" class="error-message" />
              </Transition>
            </a-col>
            <a-col :span="24">

              <Field name="phone" v-slot="{ value, handleChange }" v-model="form.phone">
                Телефон
                <a-input placeholder="8909909909" @update:value="handleChange" :value="value" allow-clear></a-input>
              </Field>
              <!-- <Transition name="fade">
                <ErrorMessage name="shortDescription" class="error-message" />
              </Transition> -->
            </a-col>
            <a-col :span="24">

              <Field name="email" v-slot="{ value, handleChange }" v-model="form.email">
                Почта
                <a-input placeholder="test@test.ru" @update:value="handleChange" :value="value" allow-clear></a-input>
              </Field>
              <!-- <Transition name="fade">
                <ErrorMessage name="shortDescription" class="error-message" />
              </Transition> -->
            </a-col>
            <a-col :span="24">

              <Field name="contactPerson" v-slot="{ value, handleChange }" v-model="form.contactPerson">
                Контактное лицо
                <a-input placeholder="Курочкина Клава" @update:value="handleChange" :value="value"
                  allow-clear></a-input>
              </Field>
              <!-- <Transition name="fade">
                <ErrorMessage name="shortDescription" class="error-message" />
              </Transition> -->
            </a-col>



            <a-col :span="24">
              <Field name="category" v-slot="{ value, handleChange }" v-model="form.category">
                Категория партнера<sup>*</sup>
                <a-select :value="value" @update:value="handleChange" style="width: 100%" :options="placeCategory"
                  placeholder="Музей, памятник" show-search allowClear>
                </a-select>

              </Field>
              <Transition name="fade">
                <ErrorMessage name="category" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="24">
              <div>Адрес</div>

              <div>
                <Field name="location" v-slot="{ value, handleChange }" v-model="locationSearchRequest">
                  <a-auto-complete :value="value" @update:value="handleChange" style="width: 100%"
                    :options="possibleLocations" placeholder="Глазов" @select="selectStartLocation">
                  </a-auto-complete>
                </Field>
                <!-- <Transition name="fade">
                  <ErrorMessage name="location" class="error-message" />
                </Transition> -->
              </div>

            </a-col>

            <a-col :span="24" class="d-flex justify-center">
              <a-button class="lets_go_btn ma-36" type="primary" html-type="submit" :disabled="!meta.valid">Отправить
              </a-button>
            </a-col>
          </a-row>
        </Form>



      </a-col>
    </a-row>
  </div>
</template>

<style scoped></style>