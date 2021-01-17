<template>
  <div class="mb-10 px-8 flex flex-col">
    <span class="mb-3 text-xl font-semibold"> Accounts </span>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import DashboardAmountCard from "@/components/dashboard-amount-card.vue";
import { AccountLatestValue } from "@/models/payment-source";
import { IPaymentSourceService } from "@/services/interfaces/payment-source-service";
import { getService, Types } from "@/di-container";

interface State {
  loading: boolean;
  accounts: AccountLatestValue[];
}

export default defineComponent({
  name: "Home",
  components: {
    DashboardAmountCard
  },
  setup() {
    const state: State = reactive({
      loading: false,
      accounts: []
    });

    onMounted(async () => {
      state.accounts = await getService<IPaymentSourceService>(
        Types.PaymentSourceService
      ).getLatestValues(1);
    });

    return {
      state
    };
  }
});
</script>

<style lang="sass">
</style>
