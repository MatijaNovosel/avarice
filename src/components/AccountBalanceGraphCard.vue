<template>
  <q-card flat class="rounded-t-md" style="height: 200px">
    <q-card-section>
      <q-btn flat dense class="q-mr-md bg-grey-9 rounded">
        <q-icon class="q-pa-xs" name="mdi-tune-variant" size="sm" />
      </q-btn>
      <q-btn flat dense class="q-mr-md bg-grey-9 rounded">
        <q-icon class="q-pa-xs" name="mdi-calendar-outline" size="sm" />
      </q-btn>
      <q-btn-toggle
        v-model="state.timePeriod"
        toggle-color="grey-7"
        color="grey-9"
        text-color="white"
        toggle-text-color="white"
        unelevated
        size="sm"
        :options="graphDateOptions"
      />
    </q-card-section>
    <q-card-section class="q-pa-none">
      <line-chart
        v-if="state.chartData"
        style="height: 130px"
        :chart-data="state.chartData"
        :options="state.chartOptions"
        ref="lineChartRef"
      />
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue";
import { getService, Types } from "src/di-container";
import IAccountService from "src/api/interfaces/accountService";
import { ChartData, ChartOptions } from "chart.js";
import { LineChart } from "vue-chart-3";
import { format } from "date-fns";
import { AccountHistoryModel } from "src/api/client";
import { SelectItem } from "src/models/common";
import { formatBalance } from "src/utils/helpers";
import { useAppStore } from "src/stores/app";

interface State {
  chartData: ChartData<"line"> | null;
  chartOptions: ChartOptions<"line">;
  timePeriod: string | null;
  graphData: AccountHistoryModel[] | null;
}

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

const appStore = useAppStore();
const lineChartRef = ref(null);

const state = reactive<State>({
  chartData: null,
  graphData: null,
  timePeriod: "30D",
  chartOptions: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false
    },
    scales: {
      y: {
        display: false
      },
      x: {
        display: false
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return formatBalance(context.parsed.y, "HRK");
          }
        }
      }
    }
  }
});

const graphDateOptions: SelectItem<string, string>[] = [
  { label: "7D", value: "7D" },
  { label: "30D", value: "30D" },
  { label: "12W", value: "12W" },
  { label: "6M", value: "6M" },
  { label: "1Y", value: "1Y" }
];

const updateGraph = () => {
  if (state.graphData) {
    state.chartData = {
      datasets: [
        {
          pointBackgroundColor: "rgba(0, 0, 0, 0)",
          pointBorderColor: "rgba(0, 0, 0, 0)",
          backgroundColor: appStore.accentColor,
          borderColor: appStore.accentColor,
          pointRadius: 0,
          fill: true,
          data: state.graphData.map((dataItem) => dataItem.amount).reverse(),
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "#ff3f2b",
          tension: 0.2
        }
      ],
      labels: state.graphData.map((dataItem) => format(dataItem.date, "dd.MM.yyyy.")).reverse()
    };
  }
};

onMounted(async () => {
  state.graphData = await getService<IAccountService>(Types.AccountService).getAccountHistory(1);
  updateGraph();
});

watch(
  () => appStore.accentColor,
  () => {
    updateGraph();
  }
);
</script>

<style lang="scss">
canvas {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
</style>
