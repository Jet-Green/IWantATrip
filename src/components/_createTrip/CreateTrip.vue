<script setup>
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { watch, nextTick, ref, reactive, computed, onMounted } from "vue";
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";

const ruLocale = locale;
const quill = ref(null);
let newContent = "";
const formRef = ref(null);
const description = ref(null);
const start = ref(null);
const end = ref(null);
const dynamicValidateForm = reactive({
  cost: [],
});
let form = reactive({
  name: "",
  start: start.value,
  end: end.value,
  duration: "",
  images: [],
  tripRoute: "",
  distance: "",
  cost: dynamicValidateForm.cost,
  offer: "",
  description: description.value,
  location: "",
  fromAge: "",
  period: "",
});

const removeCost = (item) => {
  let index = dynamicValidateForm.cost.indexOf(item);
  if (index !== -1) {
    dynamicValidateForm.cost.splice(index, 1);
  }
};

const addCost = () => {
  dynamicValidateForm.cost.push({
    first: "",
    last: "",
  });
};

function submit() {
  alert("создать");
  console.log(form.value);
}

watch(description, (newValue) => {
  newContent = newValue;
  if (newContent === newValue) return;
  quill.value.setHTML(newValue);
  // Workaround https://github.com/vueup/vue-quill/issues/52
  // move cursor to end
  nextTick(() => {
    let q = quill.value.getQuill();
    q.setSelection(newValue.length, 0, "api");
    q.focus();
  });
});
watch(start, () => {
  let result =
    Number(JSON.parse(JSON.stringify(end.value))) -
    Number(JSON.parse(JSON.stringify(start.value)));
  if (result >= 0) {
    form.duration = Math.round(result / 86400000);
  } else {
    form.duration = "";
  }
});
watch(end, () => {
  let result =
    Date.parse(JSON.parse(JSON.stringify(end.value))) -
    Date.parse(JSON.parse(JSON.stringify(start.value)));
  form.duration = Math.round(result / 86400000);
  if (result >= 0) {
    form.duration = Math.round(result / 86400000);
  } else {
    form.duration = "";
  }
});
</script>
<template>
  <a-row type="flex" justify="center">
    <a-col :xs="22" :lg="12">
      <h1>Создать тур</h1>
      <form action="POST" @submit.prevent="submit">
        <a-row :gutter="[16, 16]">
          <a-col :span="24">
            Название
            <a-input
              placeholder="Название тура"
              size="large"
              v-model:value="form.name"
            ></a-input>
          </a-col>
          <a-col :span="12">
            Дата начала
            <a-date-picker
              v-model:value="start"
              style="width: 100%"
              placeholder="Начало"
              :locale="ruLocale"
            />
          </a-col>
          <a-col :span="12">
            Дата конца
            <a-date-picker
              v-model:value="end"
              style="width: 100%"
              placeholder="Конец"
              :locale="ruLocale"
            />
          </a-col>
          <a-col :span="12">
            Продолжительность
            <p style="font-weight: bold; line-height: 40px">
              Дней: {{ form.duration }}
            </p>
          </a-col>
          <a-col :span="12">
            Маршрут
            <a-input
              placeholder="Даты"
              size="large"
              v-model:value="form.tripRoute"
            ></a-input>
          </a-col>
          <a-col :span="24">
            Цены
            <a-form ref="formRef" :model="dynamicValidateForm">
              <a-space
                v-for="(item, index) in dynamicValidateForm.cost"
                :key="item.id"
                style="display: flex; margin-bottom: 8px"
                align="baseline"
              >
                <a-form-item
                  :name="['cost', index, 'first']"
                  :rules="{
                    required: true,
                    message: 'Для кого?',
                  }"
                >
                  <a-input v-model:value="item.first" placeholder="Для кого" />
                </a-form-item>
                <a-form-item
                  :name="['cost', index, 'last']"
                  :rules="{
                    required: true,
                    message: '',
                  }"
                >
                  <a-input v-model:value="item.last" placeholder="Цена" />
                </a-form-item>
                <span
                  class="mdi mdi-24px mdi-minus"
                  style="cursor: pointer"
                  @click="removeCost(item)"
                ></span>
              </a-space>
              <a-form-item>
                <a-button type="dashed" block @click="addCost">
                  <span class="mdi mdi-12px mdi-plus"></span>
                  Добавить
                </a-button>
              </a-form-item>
            </a-form>
          </a-col>
          <a-col :span="24">
            Реклама
            <a-textarea
              placeholder="завлекательное описание"
              size="large"
              v-model:value="form.offer"
              :autoSize="true"
            >
            </a-textarea>
          </a-col>
          <a-col :span="24" style="display: flex; flex-direction: column">
            Описание программы
            <QuillEditor
              theme="snow"
              style="height: auto"
              ref="quill"
              v-model:content="form.description"
              contentType="html"
              :toolbar="[
                [{ header: [1, 2] }],
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ color: ['#000000', '#ff6600', '#3daff5'] }],
                [{ align: [] }],
              ]"
            />
            <!-- <a-textarea placeholder="Даты" size="large" v-model:value="form.description" :autoSize="true">
                        </a-textarea> -->
          </a-col>
          <a-col :span="24" class="d-flex justify-center">
            <a-button
              class="mt-16"
              type="primary"
              size="large"
              html-type="submit"
              >Отправить
            </a-button>
          </a-col>
        </a-row>
      </form>
    </a-col>
  </a-row>
</template>