<template>
  <q-page padding class="bg-grey-2">
    <div class="row">
      <div class="col-3 q-pr-lg">
        <account-list
          :selectedAccountId="state.selectedAccountId"
          @update:selectedAccountId="updateSelectedAccountDebounce"
          :loading="state.loading"
          :accounts="state.accounts"
        />
      </div>
      <div class="col-9">
        <div class="row">
          <div class="col-12 col-md-6 q-pr-lg">
            <total-balance-card
              :loading="state.loading"
              :account="state.selectedAccount"
              @new-transaction="state.transactionDialogOpen = true"
            />
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
  <transaction-dialog v-model:open="state.transactionDialogOpen" />
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, watch, computed } from "vue";
import TransactionsTable from "src/components/TransactionsTable.vue";
import AccountList from "src/components/AccountList.vue";
import { getService, Types } from "src/di-container";
import { AccountModel, IPageableCollectionOfTransactionModel } from "src/api/client";
import ITransactionService from "src/api/interfaces/transactionService";
import TotalBalanceCard from "src/components/TotalBalanceCard.vue";
import AccountBalanceGraphCard from "src/components/AccountBalanceGraphCard.vue";
import TransactionDialog from "src/components/TransactionDialog.vue";
import { debounce } from "quasar";
import { useStore } from "src/store";

interface State {
  transactions: IPageableCollectionOfTransactionModel;
  loading: boolean;
  transactionDialogOpen: boolean;
  selectedAccountId: number | null;
  selectedAccount: AccountModel | null;
  accounts: AccountModel[];
}

export default defineComponent({
  name: "Dashboard",
  components: {
    TransactionsTable,
    AccountList,
    TotalBalanceCard,
    AccountBalanceGraphCard,
    TransactionDialog
  },
  setup() {
    const store = useStore();

    const state: State = reactive({
      loading: false,
      transactionDialogOpen: false,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      accounts: computed(() => store.getters["user/accounts"] as AccountModel[]),
      selectedAccountId: null,
      selectedAccount: null,
      transactions: {
        total: 0,
        results: []
      }
    });

    function updateSelectedAccount(accountId: number) {
      if (state.selectedAccountId === accountId) {
        return;
      }
      state.selectedAccountId = accountId;
    }

    const updateSelectedAccountDebounce = debounce(updateSelectedAccount, 300);

    onMounted(async () => {
      state.loading = true;
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
      state,
      updateSelectedAccountDebounce
    };
  }
});
</script>
