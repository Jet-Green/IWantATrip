<script setup>
import { reactive, ref, watch, onMounted, computed } from "vue"
import { Form, Field, ErrorMessage } from "vee-validate"
import * as yup from "yup"
import dayjs from "dayjs"
import locale from "ant-design-vue/es/date-picker/locale/ru_RU"
import "dayjs/locale/ru"

import { message } from "ant-design-vue"

import { useRouter, useRoute } from "vue-router"
import { useAppState } from "../../../stores/appState"
import BackButton from "../../../components/BackButton.vue"
import { useAuth } from "../../../stores/auth"
import { usePartners } from "../../../stores/partner"
import { useTrips } from "../../../stores/trips"
import { useTasks } from "../../../stores/tasks"

dayjs.locale("ru")

const userStore = useAuth()
const partnerStore = usePartners()
const tripsStore = useTrips()
const tasksStore = useTasks()
const router = useRouter()
const route = useRoute()

const emailExists = ref([])

let trips = ref([])
let partners = ref()
let taskId = ref()

let form = reactive({
  author: "",
  name: "",
  trip: "",
  partner: "",
  deadLine: dayjs(),
  createdDate: null,
  timezoneOffset: null,
  payAmount: null,
  payments: [],
  status: "",
  managers: [],
  comment: "",
  interactions: [],
})
let managersEmails = ref([])
let tripInfo = ref({})

let formSchema = yup.object({
  name: yup.string().required("заполните поле"),
  // phone: yup.string().required("заполните поле"),
  // email: yup.string().required("заполните поле"),
  // contactPerson: yup.string().required("заполните поле"),
  // category: yup.string().required("заполните поле"),
  // https://vee-validate.logaretm.com/v4/examples/array-fields/
})

function close() {
  router.push("/cabinet/tasks")
}
function clearForm() {
  Object.assign(form, {
    author: "",
    name: "",
    trip: "",
    partner: "",
    deadLine: null,
    createdDate: null,
    timezoneOffset: null,
    payAmount: null,
    payments: [],
    status: "",
    managers: [],
    comment: "",
    interactions: [],
  })
}

function handleDateChange(value) {
   console.log('Выбранная дата:', value)
  form.deadLine = value
}
let isChecking = false

let checkManagers = async () => {
  if (isChecking) {
    return
  }

  isChecking = true
  emailExists.value = []
  for (let i = 0; i < managersEmails.value.length; i++) {
    let result = await userStore.checkUserEmail(managersEmails.value[i])
    // приходит либо полностью юзер, либо null
    if (result.data?._id) {
      emailExists.value.push(true)
      form.managers[i] = result.data._id
    } else {
      emailExists.value.push(false)
    }
  }
  isChecking = false
}

async function submit() {
  let toSend = { ...form }
  toSend.author = userStore.user._id
  toSend.status = "open"
  toSend.timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000
  toSend.tripInfo = tripInfo.value
  // to utc
  toSend.createdDate = Date.now() + toSend.timezoneOffset;

  if (toSend.deadLine) {
    // to utc
    toSend.deadLine = new Date(toSend.deadLine).getTime() + toSend.timezoneOffset
  }
  let response = await tasksStore.create(toSend)
  if (response.status == 200) {
    message.config({ duration: 1.5, top: "70vh" })
    message.success({
      content: "Задача добавлена!",
      onClose: () => {
        close()
        clearForm()
      },
    })
  }
}

// туры для селектора

let getTrips = async (search) => {
  if (search.length > 2) {
    let res = await tripsStore.findAuthorTrips(search, userStore.user._id)
    trips.value = res.data
  } else {
    trips.value = []
  }
}

const tripSearch = (search) => {
  getTrips(search)
}
const tripChange = (search) => {
  getTrips(search)
}

// партнеры для селектора
let page = 1
let query = {
  author: userStore.user._id,
  $or: [{ name: { $regex: "", $options: "i" } }],
}
let getPartners = async (search) => {
  if (search.length > 2) {
    query.$or[0].name.$regex = search
    let data = await partnerStore.getAll(page, query)
    partners.value = data
  } else {
    partners.value = []
  }
}

const partnerSearch = (search) => {
  getPartners(search)
}
const partnerChange = (search) => {
  getPartners(search)
}
let addManager = () => {
  managersEmails.value.push("")
  form.managers.push("")
}
let removeManager = (index) => {
  managersEmails.value.splice(index, 1)
  form.managers.splice(index, 1)
}

watch(managersEmails, () => checkManagers(), { deep: true })
watch(
  () => form.trip,
  (newTripId) => {
    for (let i = 0; i < trips.value.length; i++) {
      if (trips.value[i]._id == newTripId) {
        tripInfo.value = trips.value[i]
      }
    }
  }
)
onMounted(async () => {
  taskId.value = route.query._id
  if (taskId.value) {
    let res = await tasksStore.getById(taskId.value)
    let taskFromDB = res.data

    if (res.status == 200) {


      form.name = taskFromDB.name
      form.trip = taskFromDB.tripInfo.name
      form.partner = taskFromDB.partner.name
      form.deadLine =dayjs(new Date(taskFromDB.deadLine))
      form.comment = taskFromDB.comment,
        managersEmails.value = taskFromDB.managers.map((manager) => {
          return manager.email
        })
       
    }
  }
})
</script>
<template>
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="12">
        <h2>Создать задачу</h2>
        <pre>{{ form.deadLine }}</pre>
        <Form :validation-schema="formSchema" v-slot="{ meta }" @submit="submit">
          <a-row :gutter="[16, 16]">
            <a-col :span="24">
              <Field name="name" v-slot="{ value, handleChange }" v-model="form.name">
                Наименование<sup>*</sup>
                <a-input placeholder="Наименование задачи" @update:value="handleChange" :value="value"
                  allow-clear></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="name" class="error-message" />
              </Transition>
            </a-col>
            <a-col :span="24">
              <div>Тур</div>

              <a-select v-model:value="form.trip" show-search placeholder="поиск тура" style="width: 100%"
                :default-active-first-option="false" :show-arrow="false" :filter-option="false"
                :fieldNames="{ label: 'name', value: '_id' }" :not-found-content="null" :options="trips"
                @search="tripSearch" @change="tripChange"></a-select>
            </a-col>
            <a-col :span="24">
              <div>Партнер</div>

              <a-select v-model:value="form.partner" show-search placeholder="поиск партнера" style="width: 100%"
                :default-active-first-option="false" :show-arrow="false" :filter-option="false"
                :fieldNames="{ label: 'name', value: '_id' }" :not-found-content="null" :options="partners"
                @search="partnerSearch" @change="partnerChange"></a-select>
            </a-col>
            <a-col :span="24">
              <Field name="start" v-slot="{ value, handleChange }" v-model="form.deadLine">
                Крайний срок
                <a-date-picker v-model="form.deadLine"
                  :showTime="{ format: 'HH:mm', defaultValue: dayjs().hour(0).minute(0).second(0) }" style="width: 100%"
                  placeholder="крайний срок" :locale="locale" :format="(value) => dayjs(value).format('DD.MM.YY HH:mm')"
                  @change="handleDateChange" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="start" class="error-message" />
              </Transition>
            </a-col>
            <a-col :span="24">
              <Field name="payAmount" v-slot="{ value, handleChange }" v-model="form.payAmount">
                Стоимость
                <a-input placeholder="5500" @update:value="handleChange" :value="value" allow-clear
                  type="number"></a-input>
              </Field>
            </a-col>
            <a-col :span="24">
              <Field name="comment" v-slot="{ value, handleChange }" v-model="form.comment">
                Комментарий
                <a-input placeholder="Комментарий" @update:value="handleChange" :value="value" allow-clear></a-input>
              </Field>
            </a-col>

            <a-col :span="24">
              Менеджеры

              <div v-for="(item, index) in managersEmails" :key="index" style="display: flex" align="center"
                class="mb-16">
                <a-input v-model:value="managersEmails[index]" placeholder="manager@mail.ru" class="mr-8" />

                <span v-if="emailExists[index]" class="mdi mdi-check"
                  style="font-size: 24px; font-weight: bold; color: #219fcf"></span>

                <span v-else class="mdi mdi-not-equal-variant"
                  style="font-size: 24px; font-weight: bold; color: #ff6600"></span>

                <a-button @click="removeManager(index)" shape="circle" class="ml-4">
                  <span class="mdi mdi-minus" style="cursor: pointer"></span>
                </a-button>
              </div>

              <a-button type="dashed" block @click="addManager">
                <span class="mdi mdi-12px mdi-plus"></span>
                Добавить менеджера
              </a-button>
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
