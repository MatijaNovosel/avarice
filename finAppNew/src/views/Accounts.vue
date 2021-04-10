<template>
  <v-row>
    <v-col cols="12">
      <v-select
        :loading="state.loading"
        :disabled="state.loading"
        hide-details
        dense
        item-text="description"
        item-value="id"
        :return-object="false"
        :items="state.accounts"
        v-model="state.account"
        clearable
        outlined
        label="Account"
      >
        <template #item="{ item, on, attrs }">
          <v-list-item two-line v-on="on" v-bind="attrs">
            <v-list-item-avatar>
              <v-icon v-text="`mdi-${item.icon}`" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.description }}
              </v-list-item-title>
              <v-list-item-subtitle class="pt-1">
                {{ formatCurrencyDisplay(true, item.amount, "HRK") }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
        <template #selection="{ item }">
          <v-list-item two-line>
            <v-list-item-avatar>
              <v-icon v-text="`mdi-${item.icon}`" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.description }}
              </v-list-item-title>
              <v-list-item-subtitle class="pt-1">
                {{ formatCurrencyDisplay(true, item.amount, "HRK") }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-select>
    </v-col>
    <v-col cols="12" class="text-right">
      <v-btn color="error" small class="mr-3">
        Delete account
      </v-btn>
      <v-btn color="success" small>
        New account
      </v-btn>
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
  SetupContext,
  watch
} from "@vue/composition-api";
import { formatCurrencyDisplay } from "@/helpers";

interface State {
  accounts: AccountLatestValue[];
  account: AccountLatestValue | null;
  loading: boolean;
}

export default defineComponent({
  name: "Accounts",
  setup(props, context: SetupContext) {
    const state: State = reactive({
      accounts: [],
      account: null,
      loading: false
    });

    async function getData() {
      await context.root.$store.dispatch("app/setLoading", true);

      state.accounts = await getService<IPaymentSourceService>(
        Types.PaymentSourceService
      ).getLatestValues(1);
      state.account = state.accounts[0];

      await context.root.$store.dispatch("app/setLoading", false);
    }

    watch(
      () => context.root.$store.getters["app/refreshTrigger"] as boolean,
      () => {
        getData();
      }
    );

    onMounted(async () => {
      getData();
    });

    return {
      state,
      formatCurrencyDisplay
    };
  }
});
</script>
