<template>
  <div>
    <q-card
      class="rounded-md q-px-md q-py-sm"
      :class="{
        'flex items-center justify-center': userStore.selectedAccount == null
      }"
      flat
      style="height: 200px"
    >
      <template v-if="userStore.selectedAccount">
        <q-card-section class="row items-center justify-between q-pb-sm">
          <span class="text-grey-6"> Account balance </span>
        </q-card-section>
        <q-card-section class="column q-pb-sm">
          <span class="text-h3">
            {{
              formatBalance(userStore.selectedAccount.balance, userStore.selectedAccount.currency)
            }}
          </span>
        </q-card-section>
        <q-card-section class="q-pt-xs">
          <q-chip color="red-4" class="q-px-md">
            <b>
              {{
                formatBalance(state.expenseAndIncome?.expense, userStore.selectedAccount.currency)
              }}
            </b>
          </q-chip>
          <q-chip
            :style="{
              backgroundColor: '#6ca16f'
            }"
            class="q-px-md"
          >
            <b>
              {{
                formatBalance(state.expenseAndIncome?.income, userStore.selectedAccount.currency)
              }}
            </b>
          </q-chip>
        </q-card-section>
      </template>
      <template v-else>
        <span>No accounts found.</span>
      </template>
    </q-card>
  </div>
</template>

<script lang="ts" setup>
import { AccountExpenseAndIncomeModel } from "src/api/client";
import IAccountService from "src/api/interfaces/accountService";
import { getService, Types } from "src/di-container";
import { useUserStore } from "src/stores/user";
import { formatBalance } from "src/utils/helpers";
import { watch, reactive, onMounted } from "vue";

interface State {
  expenseAndIncome: AccountExpenseAndIncomeModel | null;
}

const userStore = useUserStore();

const getExpenseAndIncome = async () => {
  if (userStore.selectedAccount) {
    state.expenseAndIncome = await getService<IAccountService>(
      Types.AccountService
    ).getExpenseAndIncomeInTimePeriod(userStore.selectedAccount.id);
  }
};

const state = reactive<State>({
  expenseAndIncome: null
});

onMounted(async () => {
  await getExpenseAndIncome();
});

watch(
  () => userStore.selectedAccount,
  async () => {
    await getExpenseAndIncome();
  }
);
</script>
