<template>
  <q-card flat class="rounded-t-md" style="height: 200px">
    <q-card-section>
      <q-btn flat dense class="q-mr-md bg-grey-9 rounded">
        <q-icon class="q-pa-xs" name="mdi-tune-variant" size="sm" />
      </q-btn>
      <q-btn flat dense class="q-mr-md bg-grey-9 rounded">
        <q-icon class="q-pa-xs" name="mdi-calendar-outline" size="sm" />
      </q-btn>
    </q-card-section>
    <q-card-section class="q-pa-none">
      <line-chart
        v-if="state.chartData"
        style="height: 130px"
        :chart-data="state.chartData"
        :options="state.chartOptions"
      />
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from "vue";
import { getService, Types } from "src/di-container";
import IAccountService from "src/api/interfaces/accountService";
import { ChartData, ChartOptions } from "chart.js";
import { LineChart } from "vue-chart-3";
import { format } from "date-fns";

interface State {
  chartData: ChartData<"line"> | null;
  chartOptions: ChartOptions<"line">;
}

export default defineComponent({
  name: "account-balance-graph-card",
  components: {
    LineChart
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const state: State = reactive({
      chartData: null,
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
          }
        }
      }
    });

    onMounted(async () => {
      const graphData = await getService<IAccountService>(Types.AccountService).getAccountHistory(
        1
      );

      state.chartData = {
        datasets: [
          {
            pointBackgroundColor: "rgba(0, 0, 0, 0)",
            pointBorderColor: "rgba(0, 0, 0, 0)",
            backgroundColor: "#ca4133",
            borderColor: "#ca4133",
            pointRadius: 0,
            fill: true,
            data: graphData.map((dataItem) => dataItem.amount).reverse(),
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "red"
          }
        ],
        labels: graphData.map((dataItem) => format(dataItem.date, "dd.MM.yyyy. HH:mm"))
      };
    });

    return {
      state
    };
  }
});
</script>
