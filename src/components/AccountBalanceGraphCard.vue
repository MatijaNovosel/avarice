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
      <chart-test
        v-if="state.chartData"
        style="height: 110px; margin-top: 15px"
        :chart-data="state.chartData"
        :options="state.chartOptions"
      />
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from "vue";
import Chart from "src/components/Chart.vue";
import { getService, Types } from "src/di-container";
import IAccountService from "src/api/interfaces/accountService";
import { GraphData, GraphOptions } from "src/models/graph";

interface State {
  chartData: GraphData | null;
  chartOptions: GraphOptions;
}

export default defineComponent({
  name: "account-balance-graph-card",
  components: {
    "chart-test": Chart
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state: State = reactive({
      chartData: null,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: -10,
            bottom: -10
          }
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        elements: {
          point: {
            radius: 0
          },
          line: {
            tension: 0
          }
        },
        scales: {
          xAxes: [
            {
              ticks: {
                display: false
              },
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                display: false
              },
              gridLines: {
                display: false
              }
            }
          ]
        }
      }
    });

    onMounted(async () => {
      const graphData = await getService<IAccountService>(Types.AccountService).getAccountHistory(
        1
      );
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      state.chartData = {
        datasets: [
          {
            pointBackgroundColor: "#ffffff",
            backgroundColor: "#bb86fc",
            borderColor: "#bb86fc",
            data: graphData.map((x) => x.amount).reverse()
          }
        ],
        labels: graphData.map((x) => x.amount.toString())
      };
    });

    return {
      state
    };
  }
});
</script>
