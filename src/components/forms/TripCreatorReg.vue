<script setup>
import { reactive, ref } from "vue";
const formState = reactive({
  name: "",
  ogrn: "",
});
let TripCreator=ref("entity")
</script>
<template>
  <form action="POST">
    <a-row justify="center">
      <a-col xs="24">
      
      </a-col>
      <a-col v-if="TripCreator=='physPerson'" :xs="24">
        Ф.И.О
        <a-input v-model:value="formState.name"></a-input>
      </a-col>
      <a-col v-if="TripCreator=='entity'" :xs="24">
        <div class="mb-16">
          Название
          <a-input v-model:value="formState.title"></a-input>
        </div>
        <div>
          ОГРН
          <a-input v-model:value="formState.ogrn"></a-input>
        </div>
      </a-col>
    </a-row>
    <a-button class="mt-16" type="primary">Зарегистрироваться</a-button>
  </form>
</template>
