<template>
  <div>
    <q-card
      class="rounded-md"
      :class="{
        'flex items-center justify-center': userStore.selectedAccount == null
      }"
      flat
      style="height: 240px"
    >
      <template v-if="userStore.selectedAccount">
        <q-card-section class="row items-center justify-between q-pb-sm">
          <span class="text-grey-6"> Balance </span>
        </q-card-section>
        <q-card-section class="row items-end q-pb-sm q-pt-none">
          <span class="text-h3">
            {{ formatNumericValue(userStore.selectedAccount.balance) }}
          </span>
          <span class="text-h5 q-ml-sm text-accent">
            {{ userStore.selectedAccount.currency }}
          </span>
        </q-card-section>
        <q-separator class="q-my-sm" />
        <q-card-section class="q-pt-sm column">
          <div class="column">
            <div class="row justify-between">
              <span> Income </span>
              {{
                formatBalance(state.expenseAndIncome?.income, userStore.selectedAccount.currency)
              }}
            </div>
            <q-linear-progress
              class="q-mt-xs"
              rounded
              size="14px"
              :value="percentages.incomePercentage"
              color="green"
            />
          </div>
          <div class="column q-mt-md">
            <div class="row justify-between">
              <span> Expense </span>
              {{
                formatBalance(state.expenseAndIncome?.expense, userStore.selectedAccount.currency)
              }}
            </div>
            <q-linear-progress
              class="q-mt-xs"
              rounded
              size="14px"
              :value="percentages.expensePercentage"
              color="red"
            />
          </div>
        </q-card-section>
      </template>
      <template v-else>
        <span>No accounts found.</span>
      </template>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { TimePeriodEnum } from "src/api/client";
import IAccountService from "src/api/interfaces/accountService";
import { getService, Types } from "src/di-container";
import { AccountExpenseIncomeModel } from "src/models/account";
import { useAppStore } from "src/stores/app";
import { useUserStore } from "src/stores/user";
import { formatBalance, formatNumericValue } from "src/utils/helpers";
import { computed, onMounted, reactive, watch } from "vue";

interface State {
  expenseAndIncome: AccountExpenseIncomeModel | null;
}

const userStore = useUserStore();
const { selectedAccount } = storeToRefs(userStore);
const appStore = useAppStore();
const { transactionsChangeNotifier } = storeToRefs(appStore);

const state: State = reactive({
  expenseAndIncome: null
});

const getExpenseAndIncome = async () => {
  if (selectedAccount.value) {
    state.expenseAndIncome = await getService<IAccountService>(
      Types.AccountService
    ).getExpenseAndIncomeInTimePeriod(selectedAccount.value.id, TimePeriodEnum.ThirtyDays);
  }
};

const percentages = computed(() => {
  let incomePercentage = 0;
  let expensePercentage = 0;

  console.log(state.expenseAndIncome);

  if (state.expenseAndIncome) {
    const { expense, income } = state.expenseAndIncome;
    if (expense > income) {
      expensePercentage = 1;
      incomePercentage = income / expense;
    } else if (income > expense) {
      incomePercentage = 1;
      expensePercentage = expense / income;
    }
  }

  return {
    incomePercentage,
    expensePercentage
  };
});

watch([selectedAccount, transactionsChangeNotifier], getExpenseAndIncome);

onMounted(async () => {
  await getExpenseAndIncome();
});
</script>
