<template>
  <v-row>
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
