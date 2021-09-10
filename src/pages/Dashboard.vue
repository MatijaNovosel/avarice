<template>
  <q-page padding class="bg-dark-1">
    <div class="row">
      <div class="col-12 col-md-3 q-pr-md-lg q-pb-xl q-md-pb-none">
        <account-list
          :selected-account="state.selectedAccount"
          @update:selected-account="updateSelectedAccountDebounce"
          :loading="state.loading"
          :accounts="accounts"
        />
      </div>
      <div class="col-12 col-md-9">
        <div class="row">
          <div class="col-12 col-md-6 q-pr-md-lg">
            <total-balance-card
              :loading="state.loading"
              :account="state.selectedAccount"
              @new-transaction="state.transactionDialogOpen = true"
            />
          </div>
          <div class="col-12 col-md-6 q-pt-md q-pt-md-none">
            <account-balance-graph-card :loading="state.loading" />
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col-12">
            <transactions-table
              @delete-transaction="deleteTransaction"
              :loading="state.loading"
              :data="state.transactions"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
  <transaction-dialog
    v-model:open="state.transactionDialogOpen"
    @category-added="categoryAdded"
    @transaction-added="updateData"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, computed } from "vue";
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
import IAccountService from "src/api/interfaces/accountService";
import { format } from "date-fns";
import ICategoryService from "src/api/interfaces/categoryService";

interface State {
  transactions: IPageableCollectionOfTransactionModel;
  loading: boolean;
  transactionDialogOpen: boolean;
  selectedAccount: AccountModel | null;
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const accounts = computed(() => store.getters["user/accounts"] as AccountModel[]);

    const state: State = reactive({
      loading: false,
      transactionDialogOpen: false,
      selectedAccount: null,
      transactions: {
        total: 0,
        results: []
      }
    });

    function updateSelectedAccount(account: AccountModel) {
      if (state.selectedAccount) {
        if (state.selectedAccount.id === account.id) {
          return;
        }
        state.selectedAccount = account;
      }
    }

    const updateSelectedAccountDebounce = debounce(updateSelectedAccount, 300);

    async function getTransactions() {
      const transactions = await getService<ITransactionService>(Types.TransactionService).getAll();
      transactions.results?.forEach((t, i) => {
        // eslint-disable-next-line no-param-reassign
        t.id = i + 1;
      });
      state.transactions = transactions;
    }

    onMounted(async () => {
      state.loading = true;
      state.selectedAccount = accounts.value[0];
      await getTransactions();
      state.loading = false;
    });

    async function getAccounts() {
      const accounts = await getService<IAccountService>(Types.AccountService).getLatestValues();
      await store.dispatch("user/setAccounts", accounts);
    }

    async function updateData() {
      await getAccounts();
      await getTransactions();
    }

    async function deleteTransaction(id: number) {
      const transaction = state.transactions.results?.find((t) => t.id === id);
      if (transaction) {
        await getService<ITransactionService>(Types.TransactionService).delete(
          parseFloat(format(new Date(transaction.createdAt), "yyyyMMddHHmmss"))
        );
        await getTransactions();
        await getAccounts();
      }
    }

    async function categoryAdded() {
      const categories = await getService<ICategoryService>(
        Types.CategoryService
      ).getUserCategories();
      await store.dispatch("user/setCategories", categories);
    }

    return {
      state,
      updateSelectedAccountDebounce,
      accounts,
      updateData,
      deleteTransaction,
      categoryAdded
    };
  }
});
</script>
