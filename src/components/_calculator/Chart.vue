<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";

import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
let props = defineProps({
  profitData: Object,
});

const line = ref({});

const data = computed(() => {
  let chartData = {
    labels: props.profitData.profit.map((item, index) => {
      return index + 1;
    }),
    datasets: [],
  };
  chartData.datasets.push({
    data: props.profitData.profit,
    label: "Прибыль, руб.",
    backgroundColor: "#22b0d6",
    borderColor: "#22b0d6",
    borderWidth: [2],
  });
  chartData.datasets.push({
    data: props.profitData.profitPlan,
    label: "Мин.прибыль, руб.",
    backgroundColor: "#ff6600",
    borderColor: "#ff6600",
    borderDash: [3],
    borderWidth: [1],
    pointStyle: false,
  });
  return chartData;
});
const chartOptions = {
  responsive: true,
};

watch(
  props,
  (newValue, oldValue) => {
    data.value;
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div>
    <!-- {{ profitData }} -->
    <Line :options="chartOptions" :data="data" ref="line" />
  </div>
</template>