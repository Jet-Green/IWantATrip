<script setup>
import BackButton from "../BackButton.vue";
import { reactive, createVNode } from "vue";
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
    minPeople: 1,
  });
  console.log(form.transport)
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
let marks = {};
const onAfterChange = (value) => {
  form.people = value;
};
const clearDict = (dict) => {
  Object.keys(dict).map((key) => delete dict[key]);
};

const costParser1 = (value) => {
  var x = 0;
  form['indCost'].forEach(function (item, index) {
    x = x + item.price;
  });
  return x;
};

const costParser2 = (value) => {
  var x = 0;
  form.groupCost.forEach(function (item, index) {
    x = x + item.price;
  });
  return x;
};

const costParser3 = (value) => {

  var peoples = [];
  var prices = [];
  form.transport.forEach(function (item, index) {
    peoples[index] = item.peopleRange;
    prices[index] = item.price;
  });
  for (let item of peoples) {
    if (item >= form.people) {
      var price = prices[peoples.indexOf(item)];
      break;
    }
  }
  return price;
};

const findFinalPrice = () => {
  var individual = costParser1(form.indCost);
  var group = costParser2(form.groupCost);
  var vehicle = costParser3(form.transport);
  var finalPrice = individual + (group + vehicle) / form.people;
  console.log(individual,group,vehicle,finalPrice);
  return finalPrice;
};
const transportRange = () => {
  clearDict(marks);

  for (var i = 1; i <= form.transport[form.transport.length - 1].peopleRange; i++) {
    marks[i] = i;
    form.maxPeople = i;
  }

  form.transport.forEach(function (item) {
    marks[item.peopleRange] = {
      style: {
        color: "#000000",
      },
      label: createVNode("strong", {}, item.peopleRange),
    };
  });

};

const formatter = (value) => (value = findFinalPrice());
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
          <a-row v-for="item in form.transport" style="display: flex" class="ma-16">
            <a-col :span="24">
              <a-input
                v-model:value="item.type"
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
            <a-col :span="24" class="tprice">
              <span>До</span>
              <a-input-number
                :controls="false"
                v-model:value.lazy="item.peopleRange"
                style="width: 25%"
                placeholder="1"
                :min="0"
                @change="transportRange(value)"
              />
              <!-- <span>человек до</span>
              <a-input-number
                :controls="false"
                v-model:value="item.peopleRange"
                style="width: 25%"
                placeholder="8"
                :min="0"
              /> -->
              <span>человек</span>
              <span>Мин. кол-во человек</span>
              <a-input-number
                :controls="false"
                v-model:value.lazy="item.minPeople"
                style="width: 25%"
                placeholder="1"
                :min="0"
                @change="transportRange(value)"
              />
              
              <a-button @click="tRemoveCost(item)" shape="circle">
                <span class="mdi mdi-minus" style="cursor: pointer"></span>
              </a-button>
            </a-col>
          </a-row>
          <a-button type="dashed" block @click="tAddCost" class="ma-8">
            <span class="mdi mdi-12px mdi-plus"></span>
            Добавить виды транспорта
          </a-button>
          <h1>Итого: {{findFinalPrice()}}</h1>
        </a-col>

        <a-col :span="24">
          <div class="slidecontainer">
            <a-slider
              v-model="form.people"
              :min="1"
              :max="form.maxPeople"
              class="slider"
              :tooltipVisible="true"
              :marks="marks"
              @afterChange="onAfterChange"
              :included="false"
              :tipFormatter="formatter"
            >
            </a-slider>
            
            <!-- <datalist id="tickmarks">
              <option v-for="num in form.maxPeople" :value="num">{{num}}</option>
              list="tickmarks"
                            id="count"
              @click="count++"
            </datalist>               -->
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
.tprice > * {
  margin-left: 8px;
}
</style>
