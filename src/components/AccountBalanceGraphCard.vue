<template>
  <q-card flat class="rounded-md" :style="{ height: `${CARD_HEIGHT}px` }">
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
        :style="{ height: `${CARD_HEIGHT - 72}px` }"
        :chart-data="state.chartData"
        :options="chartOptions"
        ref="chartRef"
      />
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import { Chart, ChartData, ChartOptions } from "chart.js";
import { format } from "date-fns";
import { abbreviateNumber } from "matija-utils";
import { storeToRefs } from "pinia";
import { AccountHistoryModel } from "src/api/client";
import IAccountService from "src/api/interfaces/accountService";
import { getService, Types } from "src/di-container";
import { SelectItem } from "src/models/common";
import { useAppStore } from "src/stores/app";
import { useUserStore } from "src/stores/user";
import { TIME_PERIOD } from "src/utils/constants";
import { formatBalance } from "src/utils/helpers";
import { onMounted, reactive, ref, watch } from "vue";
import { LineChart } from "vue-chart-3";

interface State {
  chartData: ChartData<"line">;
  timePeriod: number;
  graphData: AccountHistoryModel[] | null;
}

const { accentColor } = storeToRefs(useAppStore());
const { selectedAccount } = storeToRefs(useUserStore());
const chartRef = ref<Chart | null>(null);
const CARD_HEIGHT = 240;

const chartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "nearest",
    axis: "x",
    intersect: false
  },
  layout: {
    padding: 20
  },
  scales: {
    y: {
      ticks: {
        callback: (label, index, labels) => {
          return abbreviateNumber(parseFloat(label as string));
        }
      },
      grid: {
        drawBorder: false,
        borderDash: [6, 6],
        color: "rgba(220,220,220, 0.2)"
      }
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
        label: (context) => formatBalance(context.parsed.y, "HRK")
      }
    }
  }
};

const state: State = reactive({
  chartData: {
    datasets: [],
    labels: []
  },
  graphData: null,
  timePeriod: TIME_PERIOD.SixMonths
});

const graphDateOptions: SelectItem<string, number>[] = [
  { label: "7D", value: TIME_PERIOD.SevenDays },
  { label: "30D", value: TIME_PERIOD.ThirtyDays },
  { label: "12W", value: TIME_PERIOD.TwelveWeeks },
  { label: "6M", value: TIME_PERIOD.SixMonths },
  { label: "1Y", value: TIME_PERIOD.OneYear }
];

const updateGraph = async () => {
  if (selectedAccount.value) {
    state.graphData = await getService<IAccountService>(Types.AccountService).getAccountHistory(
      selectedAccount.value.id,
      state.timePeriod
    );

    if (state.graphData) {
      state.chartData = {
        datasets: [
          {
            backgroundColor: accentColor.value,
            borderColor: accentColor.value,
            pointRadius: 0,
            fill: true,
            data: state.graphData.map(({ amount }) => amount).reverse(),
            pointHoverRadius: 5,
            tension: 0.2
          }
        ],
        labels: state.graphData.map(({ date }) => format(date, "dd.MM.yyyy.")).reverse()
      };
    }
  }
};

onMounted(async () => {
  await updateGraph();
});

watch([accentColor, selectedAccount, () => state.timePeriod], updateGraph);
</script>

<style lang="scss">
canvas {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}
</style>
