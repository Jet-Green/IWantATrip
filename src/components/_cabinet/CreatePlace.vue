<script setup>
import { reactive } from 'vue';
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

import BackButton from "../../components/BackButton.vue";
const form = reactive({
  name: '',
  dadataLocation: {},
  customLocation: {},
  images: [],
  shortDescription: '',
  description: '',
  advicesForTourists: '',
  openingHours: '',
  price: '',
  website: '',
  socialMedia: '',
  category: ''
});
let formSchema = yup.object({
  name: yup.string().required("заполните поле"),
  // https://vee-validate.logaretm.com/v4/examples/array-fields/
});
function submit() {}
</script>
<template>
  <div>
    <BackButton />
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="12">
        <Form :validation-schema="formSchema" v-slot="{ meta }" @submit="submit">
          <a-row :gutter="[16, 16]">
            <a-col :span="24">
              <h2>Создать место</h2>
              {{ form }}
              <Field name="name" v-slot="{ value, handleChange }" v-model="form.name">
                Название
                <a-input placeholder="Название места" @update:value="handleChange" :value="value" :maxlength="50"
                  show-count></a-input>
              </Field>
              <Transition name="fade">
                <ErrorMessage name="name" class="error-message" />
              </Transition>
            </a-col>

            <a-col :span="24" class="d-flex justify-center ">
              <a-button class="lets_go_btn ma-36" type="primary" html-type="submit">Отправить
              </a-button>
            </a-col>
          </a-row>
        </Form>

      </a-col>
    </a-row>
  </div>
</template>




<style scoped>
/* Add any additional styles here */
</style>