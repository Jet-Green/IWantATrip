<script setup>
import BackButton from "../BackButton.vue";
import { ref, reactive } from "vue";

const backRoute = "/trips";
let form = reactive({
  name: "",
  start: null,
  end: null,
  maxPeople: null,
  duration: "",
  images: [],
  tripRoute: "",
  distance: "",
  cost: [],
  offer: "",
  description: "",
  location: "",
  tripType: "",
  fromAge: "",
  period: "",
});

const addCost = () => {
  form.cost.push({
    type: "",
    price: "",
  });
};
const removeCost = (item) => {
  let index = form.cost.indexOf(item);
  if (index !== -1) {
    form.cost.splice(index, 1);
  }
};
</script>
<template>
  <BackButton :backRoute="backRoute" />
  <a-row type="flex" justify="center">
    <a-col :xs="22" :lg="12">
      <a-row :gutter="[16, 16]">
      <a-col :span="11">
        smt
      </a-col>
      <a-col :span="11">
        <div
          v-for="item in form.cost"
          :key="item.type"
          style="display: flex"
          align="baseline"
          class="mb-16"
        >
          <a-input v-model:value="item.first" placeholder="Для кого" />

          <a-input-number
            v-model:value="item.price"
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
      </a-row>
      <a-row :gutter="[16, 16]">
      <a-col :span="11">
        smt
      </a-col>
      <a-col :span="11">
        <div
          v-for="item in form.cost"
          :key="item.type"
          style="display: flex"
          align="baseline"
          class="mb-16"
        >
          <a-input v-model:value="item.first" placeholder="Для кого" />

          <a-input-number
            v-model:value="item.price"
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
      </a-row>
    </a-col>
  </a-row>
</template>
<style></style>
