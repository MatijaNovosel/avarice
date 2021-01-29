<template>
  <div class="mb-10 px-8 flex flex-col">
    <span class="mb-3 text-xl font-semibold"> Accounts </span>
    <div v-if="state.loading" class="grid gap-4 grid-cols-4">
      <skeleton
        :key="n"
        v-for="n in 4"
        animation
        class="rounded-lg bg-gray-300"
        height="100px"
      />
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <dashboard-amount-card
        v-for="(account, i) in state.accounts"
        :key="i"
        :icon="account.icon"
        :title="account.description"
        color="#acb0bf"
        :amount="account.amount"
        amount-visible
        :currency="account.currency"
      />
    </div>
    <span class="mb-3 mt-6 text-xl font-semibold"> Spending distribution </span>
    <div
      class="rounded-lg p-10 bg-white shadow-md flex items-center justify-center"
    >
      <div v-if="state.loading" class="text-center my-16">
        <progress-spinner strokeWidth="10" class="h-24 w-24" />
      </div>
      <template v-else>
        <div class="flex flex-col">
          <span
            v-for="tagPercentage in state.tagPercentages"
            :key="tagPercentage.id"
          >
            <span class="font-bold">{{ tagPercentage.description }}</span> •
            {{ tagPercentage.percentage }}%
          </span>
        </div>
        <chart
          class="ml-5"
          type="doughnut"
          :data="state.graphData"
          :options="state.graphOptions"
          :height="250"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import DashboardAmountCard from "@/components/dashboard-amount-card.vue";
import {
  AccountLatestValue,
  TagPercentageRecord
} from "@/models/payment-source";
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
  tagPercentages: TagPercentageRecord[];
}

export default defineComponent({
  name: "Accounts",
  components: {
    DashboardAmountCard
  },
  setup() {
    const state: State = reactive({
      tagPercentages: [],
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
        responsive: true
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
        (a, b) => b.percentage - a.percentage
      );

      tagPercentages = tagPercentages.map((x) => {
        x.percentage = parseFloat((x.percentage * 100).toFixed(3));
        return x;
      });

      state.tagPercentages = tagPercentages;

      state.graphData = {
        labels: tagPercentages.map((x) => x.description),
        datasets: [
          {
            backgroundColor: tagPercentages.map(
              (x, i) => "#" + adjustHexColor(color, i * 7)
            ),
            data: tagPercentages.map((x) => x.percentage)
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
