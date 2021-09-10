<template>
  <div>
    <template v-if="loading || !account">
      <q-card flat class="q-pa-md">
        <q-skeleton height="55px" square />
        <q-card-section>
          <q-skeleton type="text" class="text-subtitle1" />
          <q-skeleton type="text" width="50%" class="text-subtitle1" />
          <q-skeleton type="text" class="text-caption" />
        </q-card-section>
      </q-card>
    </template>
    <q-card class="rounded-md q-px-md q-py-sm" flat style="height: 200px" v-else>
      <q-card-section class="row items-center justify-between q-pb-sm">
        <span class="text-grey-6"> Total balance </span>
      </q-card-section>
      <q-card-section class="column q-pb-sm">
        <span class="text-h3">
          {{ formatBalance(account.balance, account.currency) }}
        </span>
        <span class="text-caption text-grey-5 q-pt-xs">
          <span class="text-red-5">15% less</span> value in last time period
        </span>
      </q-card-section>
      <q-card-section class="q-pt-xs">
        <q-chip color="red-4" size="sm" class="q-px-md">
          <b> {{ formatBalance(state.expenseAndIncome?.expense, account.currency) }} </b>
        </q-chip>
        <q-chip size="sm" color="green-4" class="q-px-md">
          <b> {{ formatBalance(state.expenseAndIncome?.income, account.currency) }} </b>
        </q-chip>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { AccountModel, AccountExpenseAndIncomeModel } from "src/api/client";
import IAccountService from "src/api/interfaces/accountService";
import { getService, Types } from "src/di-container";
import { formatBalance } from "src/utils/helpers";
import { defineComponent, watch, reactive, PropType } from "vue";

interface State {
  expenseAndIncome: AccountExpenseAndIncomeModel | null;
}

export default defineComponent({
  name: "total-balance-card",
  emits: ["new-transaction"],
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    account: {
      type: Object as PropType<AccountModel | null>
    }
  },
  setup(props) {
    const state: State = reactive({
      expenseAndIncome: null
    });

    watch(
      () => props.account,
      async (val) => {
        if (val) {
          state.expenseAndIncome = await getService<IAccountService>(
            Types.AccountService
          ).getExpenseAndIncomeInTimePeriod(val.id);
        }
      }
    );

    return {
      formatBalance,
      state
    };
  }
});
</script>
