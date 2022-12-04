<script setup>
import BackButton from "../BackButton.vue";
import { ref, reactive, onUpdated } from "vue";
const count = ref(0);
const backRoute = "/trips";
let form = reactive({
  people: 5,
  maxPeople: 19,
  indCost: [],
  groupCost: [],
  transport: [],
});
const indAddCost = () => {
  form.indCost.push({
    type: "",
    price: "",
  });
};
const groupAddCost = () => {
  form.groupCost.push({
    type: "",
    price: "",
  });
};
const tAddCost = () => {
  form.transport.push({
    type: "",
    peopleRange: 0,
    price: "",
  });
};
const indRemoveCost = (item) => {
  let index = form.indCost.indexOf(item);
  if (index !== -1) {
    form.indCost.splice(index, 1);
  }
};
const groupRemoveCost = (item) => {
  let index = form.groupCost.indexOf(item);
  if (index !== -1) {
    form.groupCost.splice(index, 1);
  }
};
const tRemoveCost = (item) => {
  let index = form.transport.indexOf(item);
  if (index !== -1) {
    form.transport.splice(index, 1);
  }
};
onUpdated(() => {
  // text content should be the same as current `count.value`
  console.log(document.getElementById("count").textContent);
});
</script>
<template>
  <BackButton :backRoute="backRoute" />
  <a-row type="flex" justify="center">
    <a-col :xs="22" :lg="12">
      <a-row :gutter="[16, 128]">
        <a-col :span="12">
          <h1>Индивидуальные расходы</h1>
        </a-col>
        <a-col :span="12" class="centrify">
          <div
            v-for="item in form.indCost"
            :key="item.type"
            style="display: flex"
            align="baseline"
            class="ma-16"
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

            <a-button @click="indRemoveCost(item)" shape="circle">
              <span class="mdi mdi-minus" style="cursor: pointer"></span>
            </a-button>
          </div>
          <a-button type="dashed" block @click="indAddCost" class="ma-8">
            <span class="mdi mdi-12px mdi-plus"></span>
            Добавить цены
          </a-button>
        </a-col>

        <a-col :span="12">
          <h1>Групповые расходы</h1>
        </a-col>
        <a-col :span="12" class="centrify">
          <div
            v-for="item in form.groupCost"
            :key="item.type"
            style="display: flex"
            align="baseline"
            class="ma-16"
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

            <a-button @click="groupRemoveCost(item)" shape="circle">
              <span class="mdi mdi-minus" style="cursor: pointer"></span>
            </a-button>
          </div>
          <a-button type="dashed" block @click="groupAddCost" class="ma-8">
            <span class="mdi mdi-12px mdi-plus"></span>
            Добавить цены
          </a-button>
        </a-col>
        <a-col :span="12">
          <h1>Транспорт</h1>
        </a-col>
        <a-col :span="12" class="centrify">
          <a-row
            v-for="item in form.transport"
            :key="item.type"
            style="display: flex"
            class="ma-16"
          >
            <a-col :span="24">
              <a-input
                v-model:value="item.first"
                style="width: 49%"
                placeholder="Вид транспорта"
              />

              <a-input-number
                v-model:value="item.price"
                style="width: 49%"
                placeholder="Цена"
                :min="0"
                :step="0.01"
              />
            </a-col>
            <a-col :span="24">
              <span>От</span>
              <a-input-number
                :controls="false"
                v-model:value="item.peopleRange"
                style="width: 25%"
                placeholder="1"
                :min="0"
              />
              <span>человек до</span>
              <a-input-number
                :controls="false"
                v-model:value="item.peopleRange"
                style="width: 25%"
                placeholder="8"
                :min="0"
              />
              <span>человек</span>
            </a-col>

            <a-button @click="tRemoveCost(item)" shape="circle">
              <span class="mdi mdi-minus" style="cursor: pointer"></span>
            </a-button>
          </a-row>
          <a-button type="dashed" block @click="tAddCost" class="ma-8">
            <span class="mdi mdi-12px mdi-plus"></span>
            Добавить виды транспорта
          </a-button>
        </a-col>

        <a-col :span="24">
          <div class="slidecontainer">
            <input
              v-model="form.people"
              type="range"
              id="count"
              @click="count++"
              :min="1"
              :max="form.maxPeople"
              class="slider"
              :tooltipVisible="true"
              list="tickmarks"
            />
            <datalist id="tickmarks">
              <option v-for="num in form.maxPeople" :value="num">{{num}}</option>
            </datalist>

            {{ count }}
          </div>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>
<style scoped>
.centrify {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.slidecontainer {
  width: 100%; /* Width of the outside container */
}

/* The slider itself */
.slider {
  width: 100%; /* Full-width */
}
datalist {
  display: flex;
  justify-content: space-between;
}
</style>
