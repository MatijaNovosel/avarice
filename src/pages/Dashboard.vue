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
          <div class="col-12 col-md-6 q-pr-md-md">
            <total-balance-card :loading="state.loading" :account="state.selectedAccount" />
          </div>
          <div class="col-12 col-md-6 q-pt-md q-pt-md-none">
            <account-balance-graph-card :loading="state.loading" />
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col-12">
            <transactions-table />
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
import { defineComponent, reactive, onMounted, computed, watch } from "vue";
import TransactionsTable from "src/components/TransactionsTable.vue";
import AccountList from "src/components/AccountList.vue";
import { getService, Types } from "src/di-container";
import { AccountModel } from "src/api/client";
import TotalBalanceCard from "src/components/TotalBalanceCard.vue";
import AccountBalanceGraphCard from "src/components/AccountBalanceGraphCard.vue";
import TransactionDialog from "src/components/TransactionDialog.vue";
import { debounce } from "quasar";
import { useStore } from "src/store";
import IAccountService from "src/api/interfaces/accountService";
import ICategoryService from "src/api/interfaces/categoryService";

interface State {
  loading: boolean;
  transactionsLoading: boolean;
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

    // eslint-disable-next-line
    const accounts = computed(() => store.getters["user/accounts"] as AccountModel[]);
    const createTransactionTrigger = computed(
      // eslint-disable-next-line
      () => store.getters["app/createTransactionTrigger"] as boolean
    );

    const state: State = reactive({
      loading: false,
      transactionsLoading: false,
      transactionDialogOpen: false,
      selectedAccount: null
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

    onMounted(() => {
      state.loading = true;
      state.selectedAccount = accounts.value[0];
      state.loading = false;
    });

    async function getAccounts() {
      const accounts = await getService<IAccountService>(Types.AccountService).getLatestValues();
      await store.dispatch("user/setAccounts", accounts);
      state.selectedAccount = accounts[0];
    }

    async function updateData() {
      await getAccounts();
    }

    async function categoryAdded() {
      const categories = await getService<ICategoryService>(
        Types.CategoryService
      ).getUserCategories();
      await store.dispatch("user/setCategories", categories);
    }

    watch(
      () => createTransactionTrigger,
      () => {
        state.transactionDialogOpen = true;
      },
      {
        deep: true
      }
    );

    return {
      state,
      updateSelectedAccountDebounce,
      accounts,
      updateData,
      categoryAdded
    };
  }
});
</script>
