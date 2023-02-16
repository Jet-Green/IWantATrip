<script setup>
import { reactive } from "vue";
import BackButton from "../components/BackButton.vue";
import CompanionService from "../service/CompanionService";
import { useAuth } from "../stores/auth";
import { message } from "ant-design-vue";

const userStore = useAuth();
const backRoute = "/companions";

const form = reactive({
  name: "",
  surname: "",
  phone: "",
  age: "",
  gender: "Male",
});
function submit() {
  CompanionService.createFeedback(form).then((res) => {
    const _id = res.data._id;
    
    userStore.addFeedback(res.data)
  });
}
</script>

<template>
  <BackButton :backRoute="backRoute" />
  <form action="POST" @submit.prevent="submit" enctype="multipart/form-data">
    <a-row type="flex" justify="center">
      <a-col :xs="22" :lg="12">
        <h2>Оставить отклик</h2>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :md="12">
            <label>Имя</label>
            <a-input v-model:value="form.name" />
          </a-col>

          <a-col :xs="24" :md="12">
            <label>Фамилия</label>
            <a-input v-model:value="form.surname" />
          </a-col>

          <a-col :xs="24" :md="12">
            <label>Телефон</label>
            <a-input v-model:value="form.phone" />
          </a-col>

          <a-col :span="12">
            <label>Возраст</label>
            <a-input type="number" :min="0" v-model:value="form.age" />
          </a-col>

          <a-col :span="12" class="d-flex align-center" style="flex-wrap: wrap">
            Пол
            <a-radio-group
              v-model:value="form.gender"
              name="radioGroup"
              style="width: -moz-available; width: -webkit-fill-available"
            >
              <a-radio :value="'Male'">Мужчина</a-radio>
              <a-radio :value="'Female'">Женщина</a-radio>
            </a-radio-group>
          </a-col>

          <div class="d-flex justify-center" style="width: 100%">
            <a-button
              type="primary"
              class="lets_go_btn"
              size="large"
              html-type="submit"
              >Отправить
            </a-button>
          </div>
        </a-row>
      </a-col>
    </a-row>
  </form>
</template>
<style scoped>
</style>
