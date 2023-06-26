<script setup>
import BackButton from "../components/BackButton.vue";
import { useRouter } from "vue-router";
import { reactive, ref, onMounted, watch } from "vue";
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";
import { message } from "ant-design-vue";
import { useBooking } from '../stores/booking'
import { useAuth } from "../stores/auth";
import { useAppState } from "../stores/appState";
import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
let breakpoints = useBreakpoints(breakpointsTailwind);
let sm = breakpoints.smaller("md");


const dateFormatList = ["DD.MM.YYYY", "DD.MM.YY"];
const ruLocale = locale;

const bookingStore = useBooking()
const userStore = useAuth();
const appStore = useAppState();
const router = useRouter();

const start = ref(null);
const end = ref(null);

let form = reactive({
  type: [],
  start: null,
  end: null,
  location: "",
  duration: "",
  adults: "",
  children: "",
  fromAge: "",
  wishes: "",

});
let userInfo = reactive({
  fullname: "",
  phone: "",
});
function close() {
  router.push("/trips");
  clearForm()
}
function clearForm() {
  form.type = []
  form.start = null
  form.end = null
  form.location = ""
  form.duration = ""
  form.adults = ""
  form.children = ""
  form.fromAge = ""
  form.wishes = ""

}

async function submit() {

  let toSend = Object.assign(form);

  toSend.start = new Date(form.start).getTime();
  toSend.end = new Date(form.end).getTime();
  toSend.creatorId = userStore.user._id

  console.log(toSend)
  await userStore
    .updateUser({
      email: userStore.user.email,
      fullinfo: userInfo,
    })
    .then((response) => {
      userStore.user = response.data;
    })
    .catch((err) => {
      console.log(err);
    });

  bookingStore.bookingTrip(toSend).then((res) => {
    if (res.status == 200) {
      message.config({ duration: 1.5, top: "70vh" });
      message.success({
        content: "Успешно!",
        onClose: () => {
          close()
        },
      });
    }
  });

  // очистить форму, сделать редирект на главную, вывести уведомление снизу об успехе
}

let formSchema = yup.object({
  start: yup.object().required("заполните поле"),
  end: yup.object().required("заполните поле"),
  type: yup.string().required("заполните поле"),
  location: yup.string().required("заполните поле"),
  duration: yup.string().required("заполните поле"),
  adults: yup.string().required("заполните поле"),
  children: yup.string().required("заполните поле"),
  fromAge: yup.string().required("заполните поле"),
  wishes: yup.string().required("заполните поле"),
});

watch(start, () => {
  form.start = Number(Date.parse(new Date(start.value.$d)));
  if (!end.value) {
    end.value = start.value
  }
});
watch(end, () => {
  form.end = Number(Date.parse(new Date(end.value.$d)))
});


onMounted(() => {
  if (userStore.user) {
    userStore.user.fullinfo.fullname
      ? (userInfo.fullname = userStore.user.fullinfo.fullname)
      : (userInfo.fullname = "");
    userStore.user.fullinfo.phone
      ? (userInfo.phone = userStore.user.fullinfo.phone)
      : (userInfo.phone = "");
  }
});
</script>
<template>
  <div>
    <BackButton />

    <img v-if="!sm" src="../assets/images/booking_left.webp"
      style="position: fixed; left: 0px; bottom: 0px;  width: 20%;" />

    <img v-if="!sm" src="../assets/images/booking_right.webp"
      style="position: fixed; right: 0px; bottom: 0px; width: 20% " />

    <Form :validation-schema="formSchema" v-slot="{ meta }" @submit="submit">
      <a-row type="flex" justify="center">
        <a-col :xs="22" :lg="12">
          <h2>О вас</h2>
          <a-row :gutter="[16, 16]">
            <a-col :span="24" :md="12">
              <Field name="fullname" v-slot="{ value, handleChange }" v-model="userInfo.fullname">
                Фaмилия Имя

                <a-input style="width: 100%" @update:value="handleChange" :value="value"
                  placeholder="Иванов Иван Иванович" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="fullname" class="error-message" />
              </Transition>
            </a-col>
            <a-col :span="24" :md="12">
              <Field name="phone" v-slot="{ value, handleChange }" v-model="userInfo.phone">
                Телефон

                <a-input style="width: 100%" @update:value="handleChange" :value="value" placeholder="79127528874" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="phone" class="error-message" />
              </Transition>
            </a-col>
            <a-col :span="24">
              <h2>Заказать тур</h2>
              <div>
                <Field name="type" v-slot="{ value, handleChange }" v-model="form.type">
                  Tип тура

                  <a-select @update:value="handleChange" :value="value" style="width: 100%">
                    <a-select-option v-for=" tripType  in  appStore.appState[0].tripType " :value="tripType">{{ tripType
                    }}</a-select-option>
                  </a-select>
                </Field>
                <Transition name="fade">
                  <ErrorMessage name="tripType" class="error-message" />
                </Transition>
              </div>
            </a-col>

            <a-col :span="12">
              <Field name="start" v-slot="{ value, handleChange }" v-model="start">
                Дата начала
                <a-date-picker @update:value="handleChange" :value="value" style="width: 100%" placeholder="Начало"
                  :locale="ruLocale" :format="dateFormatList" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="start" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="12">
              <Field name="end" v-slot="{ value, handleChange }" v-model="end">
                Дата конца
                <a-date-picker @update:value="handleChange" :value="value" style="width: 100%" placeholder="Конец"
                  :locale="ruLocale" :format="dateFormatList" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="end" class="error-message" />
              </Transition>
            </a-col>

            <a-col :xs="24" :md="12">
              <Field name="location" v-slot="{ value, handleChange }" v-model="form.location">
                Направление

                <a-input style="width: 100%" @update:value="handleChange" placeholder="Байкал" size="large" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="location" class="error-message" />
              </Transition>
            </a-col>

            <a-col :xs="24" :md="12">
              <Field name="duration" v-slot="{ value, handleChange }" v-model="form.duration">
                Продолжительность, дн.

                <a-input-number id="inputNumber" style="width: 100%" @update:value="handleChange" :value="value"
                  placeholder="5" :min="1" size="large" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="duration" class="error-message" />
              </Transition>

            </a-col>


            <a-col :xs="24" :md="8">
              <Field name="adults" v-slot="{ value, handleChange }" v-model="form.adults">
                Взрослые
                <a-input-number :min="0" style="width: 100%" @update:value="handleChange" :value="value"
                  placeholder="2" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="adults" class="error-message" />
              </Transition>
            </a-col>

            <a-col :xs="24" :md="8">
              <Field name="children" v-slot="{ value, handleChange }" v-model="form.children">
                Дети
                <a-input-number style="width: 100%" @update:value="handleChange" :value="value" placeholder="1"
                  :min="0" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="children" class="error-message" />
              </Transition>
            </a-col>

            <a-col :xs="24" :md="8">
              <Field name="fromAge" v-slot="{ value, handleChange }" v-model="form.fromAge">
                Мин.возраст,лет
                <a-input-number style="width: 100%" id="inputNumber" @update:value="handleChange" :value="value"
                  placeholder="10" :min="0" :max="100" />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="fromAge" class="error-message" />
              </Transition>
            </a-col>

            <a-col :xs="24">
              <Field name="wishes" v-slot="{ value, handleChange }" v-model="form.wishes">
                Пожелания
                <a-textarea @update:value="handleChange" :value="value" autoSize />
              </Field>
              <Transition name="fade">
                <ErrorMessage name="wishes" class="error-message" />
              </Transition>

            </a-col>
          </a-row>

          <a-row type="flex" justify="center">
            <a-col :xs="24" :md="16" :lg="10" class="d-flex justify-center">
              <a-button type="primary" html-type="submit" class="lets_go_btn ma-36">Отправить</a-button>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </Form>
  </div>
</template>
