<script setup>
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { watch, nextTick, ref, reactive, computed, onMounted } from "vue";
import locale from "ant-design-vue/es/date-picker/locale/ru_RU";
import ImageCropper from "../ImageCropper.vue";
import typeOfTrip from "../../fakeDB/tripType";

const dateFormatList = ["DD.MM.YYYY", "DD.MM.YY"];
const monthFormatList = ["MM.YY"];
const ruLocale = locale;
const quill = ref(null);
let newContent = "";
const formRef = ref(null);
const description = ref(null);
const start = ref(null);
const end = ref(null);
const delPhotoDialog = ref(false);
const targetIndex = ref(null);

// cropper
let visibleCropperModal = ref(false);
let previews = ref([]);

let form = reactive({
  name: "",
  start: start.value,
  end: end.value,
  duration: "",
  images: [],
  tripRoute: "",
  distance: "",
  cost: [],
  offer: "",
  description: description.value,
  location: "",
  tripType: "пляжный",
  fromAge: "",
  period: "",
});

const removeCost = (item) => {
  let index = form.cost.indexOf(item);
  if (index !== -1) {
    form.cost.splice(index, 1);
  }
};

const addCost = () => {
  form.cost.push({
    first: "",
    last: "",
  });
};
const delPhoto = () => {
  previews.value.splice(targetIndex.value, 1);
  delPhotoDialog.value = false;
};

function submit() {
  alert("создать");
  console.log(form.value);
}

function addPreview(blob) {
  // imagesFormData.append("image", blob, `product-${previews.value.length}`);
  visibleCropperModal.value = false;
  previews.value.push(URL.createObjectURL(blob));
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
          <a-col :xs="24">
            Фотографии
            <div class="d-flex" style="overflow-x: scroll">
              <img
                v-for="(pr, i) in previews"
                :key="i"
                :src="pr"
                alt=""
                class="ma-4"
                style="max-width: 200px"
                @click="
                  delPhotoDialog = true;
                  targetIndex = i;
                "
              />
            </div>
            <a-button
              type="dashed"
              block
              @click="visibleCropperModal = true"
              class="ma-8"
            >
              <span class="mdi mdi-12px mdi-plus"></span>
              Добавить фото
            </a-button>
          </a-col>

          <a-col :span="12">
            Дата начала
            <a-date-picker
              v-model:value="start"
              style="width: 100%"
              placeholder="Начало"
              :locale="ruLocale"
              :format="dateFormatList"
            />
          </a-col>
          <a-col :span="12">
            Дата конца
            <a-date-picker
              v-model:value="end"
              style="width: 100%"
              placeholder="Конец"
              :locale="ruLocale"
              :format="dateFormatList"
            />
          </a-col>
          <a-col :span="12">
            Продолжительность
            <p style="line-height: 40px">{{ form.duration }} дн.</p>
          </a-col>
          <a-col :span="24">
            Цены

            <div
              v-for="item in form.cost"
              :key="item.id"
              style="display: flex"
              align="baseline"
              class="mb-16"
            >
              <a-input v-model:value="item.first" placeholder="Для кого" />

              <a-input-number
                id="inputNumber"
                v-model:value="item.last"
                style="width: 100%"
                placeholder="Цена"
                :min="0"
                :step="0.01"
                class="ml-16 mr-16"
              />

              <a-button @click="removeCost(item)" shape="circle">
                <span class="mdi mdi-minus" style="cursor: pointer"></span>
              </a-button>
            </div>

            <a-button type="dashed" block @click="addCost" class="ma-8">
              <span class="mdi mdi-12px mdi-plus"></span>
              Добавить цены
            </a-button>
          </a-col>
          <a-col :xs="24" :md="12"
            >Тип тура
            <div>
              <a-select
                v-model:value="form.tripType"
                style="width: 100%"
                :options="typeOfTrip"
              ></a-select>
            </div>
          </a-col>
          <a-col :xs="24" :md="12"
            >Мин. возраст, лет
            <a-input-number
              id="inputNumber"
              v-model:value="form.fromAge"
              style="width: 100%"
              placeholder="10"
              :min="0"
              :max="100"
            />
          </a-col>
          <a-col :xs="24" :md="12"
            >Направление
            <a-input
              placeholder="Байкал"
              size="large"
              v-model:value="form.location"
            ></a-input>
          </a-col>

          <a-col :xs="24" :md="12"
            >Период
            <a-date-picker
              v-model:value="form.period"
              style="width: 100%; height: 40px"
              picker="month"
              :locale="ruLocale"
              :format="monthFormatList"
            />
          </a-col>
          <a-col :span="24">
            Реклама
            <a-textarea
              placeholder="завлекательное описание"
              size="large"
              v-model:value="form.offer"
            >
            </a-textarea>
          </a-col>
          <a-col :span="24">
            Маршрут
            <a-textarea
              placeholder="Глазов-Пермь 300км"
              size="large"
              v-model:value="form.tripRoute"
            ></a-textarea>
          </a-col>
          <a-col :span="24" style="display: flex; flex-direction: column">
            Описание программы
            <QuillEditor
              theme="snow"
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
      <a-modal v-model:visible="visibleCropperModal" :footer="null">
        <ImageCropper @addImage="addPreview" />
      </a-modal>
      <a-modal v-model:visible="delPhotoDialog" :footer="null">
        <h3>Удалить фото?</h3>
        <div class="d-flex justify-center">
          <a-button class="mt-16" type="primary" size="large" @click="delPhoto"
            >Да
          </a-button>
        </div>
      </a-modal>
    </a-col>
  </a-row>
</template>