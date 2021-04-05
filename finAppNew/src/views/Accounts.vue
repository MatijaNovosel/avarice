<template>
  <div>
    <v-skeleton-loader v-if="state.loading" type="card" />
    <v-row v-else>
      <v-col cols="12" md="3" v-for="(account, i) in state.accounts" :key="i">
        <v-card>
          <v-list-item two-line>
            <v-list-item-avatar>
              <v-icon v-text="`mdi-${account.icon}`" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                {{
                  formatCurrencyDisplay(true, account.amount, account.currency)
                }}
              </v-list-item-title>
              <v-list-item-subtitle class="mt-1">
                {{ account.description }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { getService, Types } from "@/di-container";
import { IPaymentSourceService } from "@/interfaces/paymentSourceService";
import { AccountLatestValue } from "@/models/payment-source";
import {
  defineComponent,
  onMounted,
  reactive,
  SetupContext
} from "@vue/composition-api";
import { formatCurrencyDisplay } from "@/helpers";

interface State {
  accounts: AccountLatestValue[];
  loading: boolean;
}

export default defineComponent({
  name: "Accounts",

  setup(props, context: SetupContext) {
    const state: State = reactive({
      accounts: [],
      loading: false
    });

    async function updateData() {
      await context.root.$store.dispatch("app/setLoading", true);

      state.accounts = await getService<IPaymentSourceService>(
        Types.PaymentSourceService
      ).getLatestValues(1);

      /*

      let tagPercentages = await getService<IPaymentSourceService>(
        Types.PaymentSourceService
      ).getTagPercentages(state.user.id as number);

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
            borderWidth: 0,
            backgroundColor: tagPercentages.map(
              (_, i) => "#" + adjustHexColor("#4a9650", i * 7)
            ),
            data: tagPercentages.map(x => x.percentage)
          }
        ]
      };

      const history = await getService<ITransactionService>(
        Types.ChangeService
      ).getTotal(state.user.id as number);

      state.totalDataset = {
        label: t("total"),
        data: history.map(x => x.total),
        fill: false,
        borderWidth: 6,
        borderColor: state.darkMode ? "#4a9650" : "#acb0bf"
      };

      state.graphDataTotal = {
        labels: history.map(x => x.createdAt),
        datasets: [state.totalDataset]
      };

      */

      await context.root.$store.dispatch("app/setLoading", false);
    }

    onMounted(async () => {
      updateData();
    });

    return {
      state,
      formatCurrencyDisplay
    };
  }
});
</script>
