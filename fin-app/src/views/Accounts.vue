<template>
  <div class="mb-10 px-8 flex flex-col">
    <span class="mb-3 text-xl font-semibold"> Accounts </span>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <dashboard-amount-card
        v-for="(account, i) in state.accounts"
        :key="i"
        :icon="account.icon"
        :title="account.description"
        :loading="state.loading"
        color="#acb0bf"
        :amount="account.amount"
        amount-visible
        :currency="account.currency"
      />
    </div>
    <span class="mb-3 mt-6 text-xl font-semibold"> Spending distribution </span>
    <div class="rounded-lg py-10 bg-white shadow-md flex flex-col items-center">
      <div v-if="state.loading" class="text-center my-16">
        <progress-spinner strokeWidth="10" class="h-24 w-24" />
      </div>
      <chart
        type="doughnut"
        :data="state.graphData"
        :options="state.graphOptions"
        :height="300"
        :width="300"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import DashboardAmountCard from "@/components/dashboard-amount-card.vue";
import { AccountLatestValue } from "@/models/payment-source";
import { IPaymentSourceService } from "@/services/interfaces/payment-source-service";
import { getService, Types } from "@/di-container";
import { DatasetItem } from "@/models/dataset";
import { GraphOptions } from "@/models/graph";
import { adjustHexColor } from "@/helpers/helpers";

interface GraphData {
  labels: string[];
  datasets: DatasetItem[];
}

interface State {
  loading: boolean;
  accounts: AccountLatestValue[];
  graphData: GraphData | null;
  graphOptions: GraphOptions;
}

export default defineComponent({
  name: "Accounts",
  components: {
    DashboardAmountCard
  },
  setup() {
    const state: State = reactive({
      loading: false,
      graphOptions: {
        cutoutPercentage: 75,
        legend: {
          display: false
        },
        scales: {
          yAxes: [
            {
              display: false
            }
          ]
        },
        responsive: false
      },
      accounts: [],
      graphData: {
        labels: [],
        datasets: []
      }
    });

    onMounted(async () => {
      state.loading = true;

      state.accounts = await getService<IPaymentSourceService>(
        Types.PaymentSourceService
      ).getLatestValues(1);

      let tagPercentages = await getService<IPaymentSourceService>(
        Types.PaymentSourceService
      ).getTagPercentages(1);

      const color = "#475569";

      tagPercentages = tagPercentages.sort(
        (a, b) => a.percentage - b.percentage
      );

      state.graphData = {
        labels: tagPercentages.map((x) => x.description),
        datasets: [
          {
            backgroundColor: tagPercentages.map(
              (x, i) => "#" + adjustHexColor(color, i * 8)
            ),
            data: tagPercentages.map((x) => x.percentage * 100)
          }
        ]
      };

      state.loading = false;
    });

    return {
      state
    };
  }
});
</script>
