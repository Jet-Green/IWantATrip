<script setup>
import {
  ref,
  reactive,
  computed,
  watch,
  onMounted,
  onUnmounted,
  getCurrentInstance,
} from "vue";
import BackButton from "../../components/BackButton.vue";
import Print from "./Print.vue"
import Chart from "./Chart.vue";
import { useAuth } from "../../stores/auth";

const app = getCurrentInstance();
const htmlToPaper = app.appContext.config.globalProperties.$htmlToPaper;
const activeKey = ref(["0"]);

const userStore = useAuth()

let form = reactive({
  name: "",
  max: 1,
  tourists: 1,
  individualCost: [],
  groupCost: [],
  transportCost: [],
  tourePrice: 0,
  commissionState: 0,
  profitabilityPlan: 0,
  profitPlan: 0,
  _id: null,
});

let select = reactive({
  best: 0,
  breakpoint: 0,
  transport: {},
  acceptTourists: 0,
  wait: 0,
});

const addGroupCost = () => {
  form.groupCost.push({
    type: "",
    price: null,
  });
};
const removeGroupCost = (item) => {
  let index = form.groupCost.indexOf(item);
  if (index !== -1) {
    form.groupCost.splice(index, 1);
  }
};
const addIndividualCost = () => {
  form.individualCost.push({
    type: "",
    price: null,
  });
};
const removeIndividualCost = (item) => {
  let index = form.individualCost.indexOf(item);
  if (index !== -1) {
    form.individualCost.splice(index, 1);
  }
};
const addTransportCost = () => {
  form.transportCost.push({
    type: "",
    capacity: null,
    price: null,
  });
};
const removeTransportCost = (item) => {
  let index = form.transportCost.indexOf(item);
  if (index !== -1) {
    form.transportCost.splice(index, 1);
  }
};
const clear = () => {
  form.name = "";
  form.max = 1;
  form.tourePrice = 0;
  form.tourists = 1;
  form.individualCost = [];
  form.groupCost = [];
  form.transportCost = [];
  select.transport = {};
  form.profitabilityPlan = 0;
  form.profitPlan = 0;
  form._id= null;
  localStorage.removeItem("tripCalc");
 
};

const createPrice = () => {
  form.tourePrice = Math.round(
    (result(form.tourists).costForOne * (1 + form.profitabilityPlan / 100)) /
    (1 - form.commissionState / 100)
  );
};
const print = async () => {
  await htmlToPaper('printMe');

};

const calcIndividualCost = computed(() => {
  return form.individualCost.reduce(
    (sum, current) => Number(sum) + Number(current.price),
    0
  );
});
const calcGroupCost = computed(() => {
  return form.groupCost.reduce(
    (sum, current) => Number(sum) + Number(current.price),
    0
  );
});

const transportCost = (tourists) => {
  if (form.transportCost.length) {
    let transportCostClone = [];
    Object.assign(transportCostClone, form.transportCost);
    transportCostClone.sort(function (a, b) {
      if (a.price > b.price) {
        return 1;
      }
      if (a.price < b.price) {
        return -1;
      }
      return 0;
    });
    let select;
    for (let i = 0; i < transportCostClone.length; i++) {
      if (tourists <= transportCostClone[i].capacity) {
        select = transportCostClone[i].price;
        break;
      }
    }

    return select;
  }
};


const sliderMarks = computed(() => {
  let obj = {};
  obj[form.tourists] = {
    style: {
      color: result(form.tourists).clearProfit > 0 ? "#22b0d6" : "#ff6600",
      "font-size": "10px",
      "font-weight": "bold",
    },
    label: result(form.tourists).clearProfit,
  };
  if (form.transportCost.length) {
    form.transportCost.forEach((transport) => {
      obj[transport.capacity] = {
        style: {
          "font-size": "10px",
          "font-weight": "bold",
          transform: "translateY(10px) translateX(-25px)",
        },
        label: `${transport.type.slice(0, 3)}: ${result(transport.capacity).clearProfit
          }`,
      };
    });

    return obj;
  } else {
    return obj;
  }
});
const resultArray = computed(() => {
  let obj = {};
  let profit = [];
  let profitPlan = [];

  for (let i = 1; i <= form.max; i++) {
    profit.push(result(i).clearProfit);
    profitPlan.push(form.profitPlan);
  }
  obj.profit = profit;
  obj.profitPlan = profitPlan;
  return obj;
});

const result = (tourists) => {
  let obj = {};

  let costOfTransport = transportCost(tourists) ? transportCost(tourists) : 0;
  obj.cost =
    calcIndividualCost.value * tourists + calcGroupCost.value + costOfTransport;
  obj.costForOne = Math.round(obj.cost / tourists);
  obj.totalPrice = Math.round(tourists * form.tourePrice);
  obj.profit = Math.round(obj.totalPrice - obj.cost);
  obj.commission = Math.round((obj.totalPrice * form.commissionState) / 100);
  obj.clearProfit = Math.round(obj.profit - obj.commission);
  obj.profitability = Math.round((obj.clearProfit / obj.cost) * 100);
  return obj;
};

function addTripCalc() {
  console.log("Adding trip calculation:", form._id);
  userStore.addTripCalc(form)
}
function deleteTripType(_id) {
  userStore.deleteTripType(_id)
}
function read(_id) {
  for (let t of userStore.user.tripCalc) {
    if (t._id == _id) {
      Object.assign(form, t)
    }
  }
}

watch(
  () => [...form.transportCost],
  (newValue, oldValue) => {
    if (form.transportCost.length) {
      let max = 0;
      form.transportCost.forEach((transport) => {
        max >= transport.capacity ? (max = max) : (max = transport.capacity);
      });
      form.max = max;
    } else {
      form.max = 100;
    }
  },
  { deep: true }
);

watch(form, (newValue, oldValue) => {
 
  localStorage.setItem("tripCalc", JSON.stringify(form));
  if (!form.tourists) {
    form.tourists = 1;
  }
  if (!form.transportCost.length) {
    select.best = 0;
    select.breakpoint = 0;
    select.transport = {};
    select.acceptTourists = 0;
    select.wait = 0;
    form.max = 100;
  }
});

onMounted(async () => {
  let readData = JSON.parse(localStorage.getItem("tripCalc"));
  if (readData) {
    Object.assign(form, readData);
  }
});

</script>
<template>
  <div>
    <BackButton />
    <div class="main">
      <a-row class="d-flex justify-center">
        <a-col :xs="22" :lg="12">
          <h2 class="title">Калькулятор тура</h2>
          <a-row class="justify-center">
            <a-col :xs="22" :lg="12">
              <a-input v-model:value="form.name" :bordered="false" placeholder="название"
                style="text-align: center; font-size: 18px" />
            </a-col>
          </a-row>

          <a-row :gutter="[4, 4]">
            <a-col :xs="20">
              <h3>Индивидуальные расходы</h3>
            </a-col>
            <a-col :xs="4" class="d-flex justify-center">
              <a-button @click="addIndividualCost" shape="circle">
                <span class="mdi mdi-plus" style="cursor: pointer"></span>
              </a-button>
            </a-col>
          </a-row>

          <a-row :gutter="[4, 4]" v-if="form.individualCost.length">
            <a-col :xs="10">
              <p class="ma-0 label">cтатья расходов</p>
            </a-col>
            <a-col :xs="10">
              <p class="ma-0 label">cтоимость</p>
            </a-col>
          </a-row>
          <a-row v-for="(item, index) in form.individualCost" :key="index" align="baseline" class="mb-4 d-flex"
            :gutter="[4, 4]">
            <a-col :xs="10">
              <a-input v-model:value="item.type" placeholder="завтрак" />
            </a-col>
            <a-col :xs="10">
              <a-input-number v-model:value="item.price" style="width: 100%" placeholder="200" :min="0" :step="1" />
            </a-col>

            <a-col :xs="4" class="d-flex justify-center">
              <a-button @click="removeIndividualCost(item)" shape="circle">
                <span class="mdi mdi-minus" style="cursor: pointer"></span>
              </a-button>
            </a-col>
          </a-row>

          <h4 v-if="form.individualCost.length" style="text-align: right">
            Индивидуальные расходы:
            {{ calcIndividualCost.toFixed(0) }} руб.
          </h4>

          <a-row :gutter="[4, 4]">
            <a-col :xs="20">
              <h3>Групповые расходы</h3>
            </a-col>
            <a-col :xs="4" class="d-flex justify-center">
              <a-button @click="addGroupCost" shape="circle">
                <span class="mdi mdi-plus" style="cursor: pointer"></span>
              </a-button>
            </a-col>
          </a-row>
          <a-row :gutter="[4, 4]" v-if="form.groupCost.length">
            <a-col :xs="10">
              <p class="ma-0 label">cтатья расходов</p>
            </a-col>
            <a-col :xs="10">
              <p class="ma-0 label">cтоимость</p>
            </a-col>
          </a-row>
          <a-row v-for="(item, index) in form.groupCost" :key="index" style="display: flex" align="baseline"
            class="mb-4" :gutter="[4, 4]">
            <a-col :xs="10">
              <a-input v-model:value="item.type" placeholder="гид" />
            </a-col>
            <a-col :xs="10">
              <a-input-number v-model:value="item.price" style="width: 100%" placeholder="2500" :min="0" :step="1" />
            </a-col>
            <a-col :xs="4" class="d-flex justify-center">
              <a-button @click="removeGroupCost(item)" shape="circle">
                <span class="mdi mdi-minus" style="cursor: pointer"></span>
              </a-button>
            </a-col>
          </a-row>

          <h4 v-if="form.groupCost.length" style="text-align: right">
            Групповые расходы:
            {{ calcGroupCost.toFixed(0) }} руб.
          </h4>

          <a-row :gutter="[4, 4]">
            <a-col :xs="20">
              <h3>Транспорт</h3>
            </a-col>
            <a-col :xs="4" class="d-flex justify-center">
              <a-button @click="addTransportCost" shape="circle">
                <span class="mdi mdi-plus" style="cursor: pointer"></span>
              </a-button>
            </a-col>
          </a-row>

          <a-row v-for="(item, index) in form.transportCost" :key="index" style="display: flex" align="baseline"
            class="mb-4" :gutter="[4, 4]">
            <a-col :xs="8" :md="10">
              <p class="ma-0 label" v-if="index == 0">вид</p>
              <a-input v-model:value="item.type" placeholder="автобус" />
            </a-col>
            <a-col :xs="6" :md="5">
              <p class="ma-0 label" v-if="index == 0">вместимость</p>
              <a-input-number v-model:value="item.capacity" style="width: 100%" placeholder="20" :min="0" :step="1" />
            </a-col>

            <a-col :xs="6" :md="5">
              <p class="ma-0 label" v-if="index == 0">стоимость</p>
              <a-input-number v-model:value="item.price" style="width: 100%" placeholder="10000" :min="0" :step="1" />
            </a-col>
            <a-col :xs="{ span: 4, offset: 0 }" :md="{ span: 4, offset: 0 }" class="d-flex justify-center align-center">
              <p class="ma-0 label"></p>
              <a-button @click="removeTransportCost(item)" shape="circle">
                <span class="mdi mdi-minus" style="cursor: pointer"></span>
              </a-button>
            </a-col>
          </a-row>

          <h4 v-if="form.transportCost.length" style="text-align: right">
            Расходы на транспорт:
            {{ transportCost(form.tourists) ? transportCost(form.tourists) : 0 }}
            руб.
          </h4>

          <a-divider class="ma-2" style="background-color: black"></a-divider>

          <a-row v-if="result(form.tourists).cost">
            <a-col :xs="22" :lg="12">
              <a-row class="mb-4 align-center" :gutter="[4, 4]">
                <a-col :xs="12"> Туристы, чел. </a-col>
                <a-col :xs="12" class="d-flex justify-end">
                  <a-input-number v-model:value="form.tourists" :min="1" :max="form.max" placeholder="чел." />
                </a-col>
                <a-col :xs="12"> Рентабельность, % </a-col>
                <a-col :xs="12" class="d-flex justify-end">
                  <a-input-number v-model:value="form.profitabilityPlan" placeholder="" :min="0" :step="1" />
                </a-col>

                <a-col :xs="24">
                  <a-button type="dashed" block @click="createPrice()">
                    <span class="mdi mdi-12px mdi-tray-arrow-down mr-4"></span>
                    Установить цену
                  </a-button>
                </a-col>

                <a-col :xs="12">Стоимость тура, руб.</a-col>
                <a-col :xs="12" class="d-flex justify-end">
                  <a-input-number v-model:value="form.tourePrice" placeholder="" :min="0" :step="1" />
                </a-col>


              </a-row>
            </a-col>
            <a-col :xs="22" :lg="12" class="d-flex align-end justify-end direction-column">
              <div strong class="ma-0">
                Себестоимость:
                {{ result(form.tourists).cost }} руб.
              </div>
              <div strong class="ma-0">
                Затраты на 1 человека:
                {{ result(form.tourists).costForOne }} руб.
              </div>
              <div strong class="ma-0">
                Общий доход:
                {{ result(form.tourists).totalPrice }} руб.
              </div>
              <div strong class="ma-0">
                Прибыль: {{ result(form.tourists).profit }} руб.
              </div>

              <div strong class="ma-0">
                Рентабельность:
                {{
          result(form.tourists).profitability
            ? result(form.tourists).profitability
            : 0
        }}%
              </div>
            </a-col>
          </a-row>

          <a-row :gutter="[40, 0]" class="ma-16" v-if="result(form.tourists).cost">
            <a-col :xs="24">
              <div style="width: 100%">
                <a-slider v-model:value="form.tourists" :min="1" :max="form.max" :marks="sliderMarks">
                </a-slider>
              </div>
            </a-col>
          </a-row>
          <a-row v-if="result(form.tourists).cost">
            <a-collapse v-model:activeKey="activeKey" block style="width: 100%; border: none; background: white">
              <a-collapse-panel key="1" header="График прибыли">

                Мин.прибыль, руб.

                <a-input-number v-model:value="form.profitPlan" placeholder="" :min="0" :step="1" />

                <Chart :profitData="resultArray" />
              </a-collapse-panel>
            </a-collapse>
          </a-row>

          <div class="d-flex justify-center flex-wrap ma-32">
            <a-tooltip>
              <template #title>отчистить форму</template>
              <a-button @click="clear()" shape="circle" class="ma-4">
                <span class="mdi mdi-content-cut" style="cursor: pointer"></span>
              </a-button>
            </a-tooltip>
            <a-tooltip>
              <template #title>сохранить</template>
              <a-button @click="addTripCalc()" shape="circle" class="ma-4">
                <span class="mdi mdi-tray-arrow-down" style="cursor: pointer"></span>
              </a-button>
            </a-tooltip>
            <a-tooltip>
              <template #title>напечатать</template>
              <a-button @click="print()" shape="circle" class="ma-4">
                <span class="mdi mdi-printer-outline" style="cursor: pointer"></span>
              </a-button>
            </a-tooltip>

          </div>
          <a-row v-if="userStore.user.tripCalc.length">
            <a-collapse v-model:activeKey="activeKey" block style="width: 100%; border: none; background: white">
              <a-collapse-panel key="2" header="Сохраненные туры">
                <a-row :gutter="[20, 0]">
                  <a-col :xs="24" :md="12" v-for="(trip, index) in userStore.user.tripCalc" :key="index"
                    class="d-flex space-between align-center">
                    <div>
                      {{ trip.name }}
                    </div>

                    <div style="min-width: 80px">
                      <a-tooltip>
                        <template #title>прочитать</template>
                        <a-button @click="read(trip._id)" shape="circle" class="ma-4">
                          <span class="mdi mdi-tray-arrow-up" style="cursor: pointer"></span>
                        </a-button>
                      </a-tooltip>
                      <a-tooltip>
                        <template #title>удалить</template>
                        <a-button @click="deleteTripType(trip._id)" shape="circle" class="ma-4">
                          <span class="mdi mdi-close" style="cursor: pointer"></span>
                        </a-button>
                      </a-tooltip>
                    </div>
                  </a-col>
                </a-row>
              </a-collapse-panel>
            </a-collapse>
          </a-row>

        </a-col>
      </a-row>

    </div>

    <div id="printMe" style="display: none">
      <Print :form="form" :calcIndividualCost="calcIndividualCost" :calcGroupCost="calcGroupCost"
        :transportCost="transportCost(form.tourists)" :result="result(form.tourists)" :resultArray="resultArray" />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.title {
  text-align: center;
  margin-top: 8px;
  margin-bottom: 0;
}

.slidecontainer {
  width: 100%;
  /* Width of the outside container */
}

/* The slider itself */
.slider {
  width: 100%;
  /* Full-width */
}

datalist {
  display: flex;
  justify-content: space-between;
}

.label {
  font-size: 10px;
}

.ant-collapse-content>.ant-collapse-content-box {
  padding: 0px;
}

.ant-collapse-content {
  border-top: none;
  border-bottom: none;
}

.footer {
  // position: absolute;
  // bottom: 0;
  margin-top: 8px;
  min-height: 90px;
  max-height: 10vh;

  // line-height: 60px;
  // display: flex;
  // justify-content: center;
  // width: 100vw;
  // background: white;
}
</style>
