<template>
  <q-page padding class="bg-grey-2">
    <div class="row">
      <div class="col-3 q-pr-lg">
        <account-list
          v-model:selectedAccountId="state.selectedAccountId"
          :loading="state.loading"
          :accounts="state.accounts"
        />
      </div>
      <div class="col-9">
        <div class="row">
          <div class="col-12 col-md-6 q-pr-lg">
            <total-balance-card :loading="state.loading" :account="state.selectedAccount" />
          </div>
          <div class="col-12 col-md-6">
            <account-balance-graph-card :loading="state.loading" />
          </div>
        </div>
        <div class="row q-mt-lg">
          <div class="col-12">
            <transactions-table :loading="state.loading" :data="state.transactions" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, watch } from "vue";
import TransactionsTable from "src/components/TransactionsTable.vue";
import AccountList from "src/components/AccountList.vue";
import { getService, Types } from "src/di-container";
import IAccountService from "src/api/interfaces/accountService";
import { Account, IPageableCollectionOfTransactionModel } from "src/api/client";
import ITransactionService from "src/api/interfaces/transactionService";
import TotalBalanceCard from "src/components/TotalBalanceCard.vue";
import AccountBalanceGraphCard from "src/components/AccountBalanceGraphCard.vue";

interface State {
  transactions: IPageableCollectionOfTransactionModel;
  accounts: Account[];
  loading: boolean;
  selectedAccountId: number | null;
  selectedAccount: Account | null;
}

export default defineComponent({
  name: "Dashboard",
  components: {
    TransactionsTable,
    AccountList,
    TotalBalanceCard,
    AccountBalanceGraphCard
  },
  setup() {
    const state: State = reactive({
      loading: false,
      accounts: [],
      selectedAccountId: null,
      selectedAccount: null,
      transactions: {
        total: 0,
        results: []
      }
    });

    onMounted(async () => {
      state.loading = true;

      state.accounts = await getService<IAccountService>(Types.AccountService).getLatestValues();
      state.selectedAccountId = state.accounts[0].id;

      const transactions = await getService<ITransactionService>(Types.TransactionService).getAll();
      transactions.results?.forEach((t, i) => {
        // eslint-disable-next-line no-param-reassign
        t.id = i + 1;
      });
      state.transactions = transactions;

      state.loading = false;
    });

    watch(
      () => state.selectedAccountId,
      (val) => {
        const account = state.accounts.find((x) => x.id === val);
        if (account) {
          state.selectedAccount = account;
        }
      }
    );

    return {
      state
    };
  }
});
</script>
