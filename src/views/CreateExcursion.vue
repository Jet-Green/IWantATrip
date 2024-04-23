<script setup>
import BackButton from '../components/BackButton.vue';
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import '@vuepic/vue-datepicker/dist/main.css'
import { reactive } from "vue"
import { useRouter } from 'vue-router';
import { useExcursion } from '../stores/excursion'

const excursionStore = useExcursion()
const router = useRouter()

let form = reactive({
  name: '',
})

let formSchema = yup.object({
  name: yup.string().required("заполните поле"),
})
async function submit() {
  let response = await excursionStore.create(form)
  if (response.status == 200) {
    router.push('/cabinet/me')
  }
}
</script>
<template>
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :span="22" :md="12">
        <Form :validation-schema="formSchema" v-slot="{ meta }" @submit="submit">
          <a-row :gutter="[16, 16]">
            <a-col :span="24">
              <h2>Создать экскурсию</h2>
            </a-col>
            <a-col :span="24">
              <Field name="name" v-slot="{ value, handleChange }" v-model="form.name">
                Название
                <a-input placeholder="Название экскурсии" @update:value="handleChange" :value="value"></a-input>
                <!-- <a-input :maxlength="50" show-count></a-input> -->
              </Field>
              <Transition name="fade">
                <ErrorMessage name="name" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="24" class="d-flex justify-center">
              <a-button class="lets_go_btn ma-36" type="primary" html-type="submit">Отправить
              </a-button>
            </a-col>
          </a-row>
        </Form>

      </a-col>
    </a-row>
  </div>
</template>
<!-- GLOBAL STYLES -->
<style lang="scss">
.dp-custom-calendar {
  .dp__calendar_item {
    padding: 2px;
  }
}
</style>