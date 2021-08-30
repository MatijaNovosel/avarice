<template>
  <q-card flat class="rounded-t-md">
    <q-card-section>
      <q-btn flat dense class="q-mr-md bg-grey-2 rounded">
        <q-icon class="q-pa-xs" name="mdi-tune-variant" color="grey-9" size="sm" />
      </q-btn>
      <q-btn flat dense class="q-mr-md bg-grey-2 rounded">
        <q-icon class="q-pa-xs" name="mdi-calendar-outline" color="grey-9" size="sm" />
      </q-btn>
    </q-card-section>
    <q-card-section class="q-pa-none">
      <chart-test
        v-if="state.chartData"
        style="height: 128px"
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
    const state: any = reactive({
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
            radius: 3
          },
          line: {
            tension: 0.5
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
            backgroundColor: "rgb(187, 222, 251)",
            borderColor: "rgb(187, 222, 251)",
            data: graphData.map((x) => x.amount)
          }
        ],
        labels: [15000, 14500, 14700, 13900, 15500, 14500, 13750, 16000, 15250, 14750]
      };
    });

    return {
      state
    };
  }
});
</script>
