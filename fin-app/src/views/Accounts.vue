<template>
  <div class="mb-10 px-8 flex flex-col">
    <span class="mb-3 text-xl font-semibold dark:text-gray-400">
      Accounts
    </span>
    <div v-if="state.loading" class="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <skeleton
        :key="n"
        v-for="n in 4"
        animation
        class="rounded-lg dark:bg-gray-700 bg-gray-300"
        height="100px"
      />
    </div>
    <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <dashboard-amount-card
        v-for="(account, i) in state.accounts"
        :key="i"
        :icon="account.icon"
        :title="account.description"
        color="#acb0bf"
        :amount="account.amount"
        :currency="state.user.preferredCurrency"
        amount-visible
      />
    </div>
    <div
      class="rounded-lg p-10 dark:bg-gray-800 bg-white shadow-md flex items-center justify-center mt-6"
    >
      <div v-if="state.loading" class="text-center my-16">
        <progress-spinner strokeWidth="10" class="h-24 w-24" />
      </div>
      <chart
        v-else
        ref="totalAccountBalanceChart"
        type="line"
        :data="state.graphDataTotal"
        :options="state.graphOptionsTotal"
        :height="450"
        :width="1000"
      />
    </div>
    <span class="mb-3 mt-6 text-xl font-semibold dark:text-gray-400">
      Spending distribution
    </span>
    <div
      class="rounded-lg p-10 dark:bg-gray-800 bg-white shadow-md flex items-center justify-center"
    >
      <div v-if="state.loading" class="text-center my-16">
        <progress-spinner strokeWidth="10" class="h-24 w-24" />
      </div>
      <template v-else>
        <div class="flex flex-col dark:text-gray-400">
          <span
            v-for="tagPercentage in state.tagPercentages"
            :key="tagPercentage.id"
          >
            <span class="font-bold">{{ tagPercentage.description }}</span> •
            {{ tagPercentage.percentage }}%
          </span>
        </div>
        <chart
          ref="spendingChart"
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
import {
  defineComponent,
  reactive,
  onMounted,
  computed,
  inject,
  watch,
  ref,
  Ref
} from "vue";
import DashboardAmountCard from "@/components/dashboard-amount-card.vue";
import {
  AccountLatestValue,
  TagPercentageRecord
} from "@/models/payment-source";
import { IPaymentSourceService } from "@/services/interfaces/payment-source-service";
import { getService, Types } from "@/di-container";
import { DatasetItem } from "@/models/dataset";
import { GraphHTMLElement, GraphOptions } from "@/models/graph";
import { adjustHexColor, hexToRgba } from "@/helpers/helpers";
import { AppUser } from "@/models/user";
import { useStore } from "vuex";
import { RefreshController } from "@/helpers/refresh";
import { ITransactionService } from "@/services/interfaces/transaction-service";
import { useI18n } from "vue-i18n";

interface GraphData {
  labels: string[];
  datasets: DatasetItem[];
}

interface State {
  loading: boolean;
  accounts: AccountLatestValue[];
  graphData: GraphData | null;
  graphDataTotal: GraphData | null;
  graphOptions: GraphOptions;
  graphOptionsTotal: GraphOptions;
  tagPercentages: TagPercentageRecord[];
  user: AppUser;
  refresh: RefreshController;
  totalDataset: DatasetItem | null;
  darkMode: boolean;
}

export default defineComponent({
  name: "Accounts",
  components: {
    DashboardAmountCard
  },
  setup() {
    const store = useStore();
    const { t } = useI18n();
    const totalAccountBalanceChart: Ref<GraphHTMLElement | null> = ref(null);
    const spendingChart: Ref<GraphHTMLElement | null> = ref(null);

    const state: State = reactive({
      refresh: inject("refresh") as RefreshController,
      user: computed(() => store.getters.user),
      darkMode: computed(() => store.getters.darkMode),
      tagPercentages: [],
      loading: false,
      graphDataTotal: null,
      totalDataset: null,
      graphOptionsTotal: {
        title: {
          display: true,
          text: t("totalAccountBalance")
        },
        legend: {
          display: false
        },
        elements: {
          point: {
            radius: 3
          },
          line: {
            tension: 0
          }
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ],

          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: `${t("amount")} (HRK)`
              },
              stacked: true
            }
          ]
        },
        responsive: true
      },
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

    function reinitGraphs() {
      const totalDataset = state.totalDataset as DatasetItem;

      totalDataset.backgroundColor = hexToRgba(
        adjustHexColor(
          state.darkMode ? "#59c262" : "#acb0bf".replace("#", ""),
          30
        ),
        0.7
      ) as string;
      totalDataset.borderColor = state.darkMode ? "#59c262" : "#acb0bf";

      totalAccountBalanceChart?.value?.reinit();
      spendingChart?.value?.reinit();
    }

    async function updateData() {
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

      tagPercentages = tagPercentages.map(x => {
        x.percentage = parseFloat((x.percentage * 100).toFixed(3));
        return x;
      });

      state.tagPercentages = tagPercentages;

      state.graphData = {
        labels: tagPercentages.map(x => x.description),
        datasets: [
          {
            backgroundColor: tagPercentages.map(
              (_, i) => "#" + adjustHexColor(color, i * 7)
            ),
            data: tagPercentages.map(x => x.percentage)
          }
        ]
      };

      const history = await getService<ITransactionService>(
        Types.ChangeService
      ).getTotal(1);

      state.totalDataset = {
        label: t("total"),
        data: history.map(x => x.total),
        fill: true,
        borderColor: state.darkMode ? "#59c262" : "#acb0bf",
        backgroundColor: hexToRgba(
          adjustHexColor(
            state.darkMode ? "#59c262" : "#acb0bf".replace("#", ""),
            30
          ),
          0.7
        ) as string
      };

      state.graphDataTotal = {
        labels: history.map(x => x.createdAt),
        datasets: [state.totalDataset]
      };

      state.loading = false;
    }

    onMounted(() => {
      updateData();
    });

    watch(
      () => state.refresh,
      () => {
        updateData();
        reinitGraphs();
      },
      { deep: true }
    );

    watch(
      () => state.darkMode,
      () => reinitGraphs()
    );

    return {
      state,
      totalAccountBalanceChart,
      spendingChart
    };
  }
});
</script>
