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
    <template v-else>
      <q-card class="rounded-md q-px-md q-py-xs" flat>
        <q-card-section class="row items-center justify-between q-pb-sm">
          <span class="text-weight-bold q-pl-md"> Total balance </span>
          <div>
            <q-chip
              color="pink-1"
              size="sm"
              class="q-px-md"
              text-color="red"
              icon="mdi-arrow-top-right"
            >
              <b> {{ formatBalance(state.expenseAndIncome?.expense, account.currency) }} </b>
            </q-chip>
            <q-chip
              size="sm"
              color="green-1"
              class="q-px-md"
              text-color="green"
              icon="mdi-arrow-bottom-left"
            >
              <b> {{ formatBalance(state.expenseAndIncome?.income, account.currency) }} </b>
            </q-chip>
          </div>
        </q-card-section>
        <q-card-section class="q-my-sm">
          <div class="text-h3 text-center">
            {{ formatBalance(account.balance, account.currency) }}
          </div>
        </q-card-section>
        <q-card-actions class="row justify-center">
          <q-btn
            flat
            size="sm"
            label="New transaction"
            class="rounded bg-grey-3"
            icon="mdi-swap-horizontal"
            @click="$emit('new-transaction')"
          />
        </q-card-actions>
      </q-card>
    </template>
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
