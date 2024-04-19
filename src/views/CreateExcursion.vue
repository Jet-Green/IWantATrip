<script setup>
import BackButton from '../components/BackButton.vue';
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import { customRef } from 'vue'

import { reactive, ref, watch } from "vue"
import { useRouter } from 'vue-router';
import { useExcursion } from '../stores/excursion'

const excursionStore = useExcursion()
const router = useRouter()

let dates = ref([])
let times = ref([])

let activeKey = ref()

watch(dates, (newValue, oldValue) => {
  if (newValue.length > oldValue.length) {
    while (times.value.length != newValue.length) {
      times.value.push([])
    }
  } else if (newValue.length < oldValue.length) {
    while (times.value.length != newValue.length) {
      times.value.pop()
    }
  }
})

let form = reactive({
  name: ''
})

let formSchema = yup.object({
  name: yup.string().required("заполните поле"),
})

async function submit() {
  console.log(dates.value, times.value);
  return
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
            <a-col :span="24">
              <VueDatePicker v-model="dates" multi-dates locale="ru-Ru" calendar-class-name="dp-custom-calendar"
                calendar-cell-class-name="dp-custom-cell" cancel-text="отмена" select-text="выбрать"
                :min-date="new Date()" :enable-time-picker="false" format="dd/MM/yyyy">
                <template #input-icon>
                  <span style="font-size: 20px; color: rgba(95, 95, 95, 0.65);"
                    class="mdi mdi-calendar-outline ml-8"></span>
                </template>
              </VueDatePicker>
            </a-col>
            <a-col :span="24">
              <a-row v-for="(date, i) of dates">
                <a-col :span="24">
                  <a-collapse v-model:activeKey="activeKey" ghost>
                    <a-collapse-panel :key="i">
                      <template #header>
                        {{ (new Date(date)).toLocaleDateString('ru-RU', {
        year: 'numeric', month: 'long', day: 'numeric'
      }) }}
                      </template>
                      <a-row :gutter="[6, 6]" class="mb-16 d-flex justify-center">
                        <a-col v-for="(time, j) of times[i]" :span="24" :md="12" :lg="8">
                          <VueDatePicker v-model="times[i][j]" placeholder="Время" time-picker cancel-text="отмена"
                            select-text="выбрать" @cleared="times[i].splice(j, 1)">
                            <template #input-icon>
                              <span style="font-size: 20px; color: rgba(95, 95, 95, 0.65);"
                                class="mdi mdi-calendar-outline ml-8"></span>
                            </template>
                          </VueDatePicker>
                        </a-col>
                      </a-row>
                      <div style="width: 100%;" class="d-flex justify-center">
                        <a-button type="dashed" class="d-flex align-center" @click="times[i].push({})">
                          <span class="mdi mdi-clock-outline mdi-18px mr-4"></span>
                          добавить время
                        </a-button>
                      </div>
                    </a-collapse-panel>
                  </a-collapse>
                </a-col>
                <!-- <a-col :span="24" class="d-flex justify-center mt-16 mb-16">
                  <div class="d-flex align-center"
                    style="user-select: none; border: 1px solid rgba(95, 95, 95, 0.2); padding: 0 6px; border-radius: 4px; height: 100%;">
                    <span style="font-size: 20px; color: rgba(95, 95, 95, 0.65);"
                      class="mdi mdi-calendar-outline mr-4"></span>
                    <span>
                      {{ (new Date(date)).toLocaleDateString('ru-RU', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
                      }}
                    </span>
                  </div>
                </a-col>
                <a-col :span="24">
                  <VueDatePicker v-model="times[index]" placeholder="Время" time-picker cancel-text="отмена"
                    select-text="выбрать">
                    <template #input-icon>
                      <span style="font-size: 20px; color: rgba(95, 95, 95, 0.65);"
                        class="mdi mdi-calendar-outline ml-8"></span>
                    </template>
                  </VueDatePicker>
                </a-col>
                <a-col :span="24" class="d-flex justify-center mt-8">
                  <a-button type="dashed" class="d-flex align-center">
                    <span class="mdi mdi-clock-outline mdi-18px mr-4"></span>
                    добавить время
                  </a-button>
                </a-col> -->
              </a-row>
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