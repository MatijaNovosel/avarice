<template>
  <q-page padding class="bg-dark-1">
    <div class="row">
      <div class="col-12 col-md-3 q-pr-md-lg q-pb-xl q-md-pb-none">
        <account-list
          :selected-account="state.selectedAccount"
          :loading="state.loading"
          :accounts="userStore.accounts"
          @update:selected-account="updateSelectedAccountDebounce"
          @new-account="state.newAccountDialogOpen = true"
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
            <transactions-table hide-select-all hide-page-selection />
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
  <new-account-dialog v-model:open="state.newAccountDialogOpen" />
</template>

<script lang="ts" setup>
import { reactive, onMounted, watch } from "vue";
import TransactionsTable from "src/components/TransactionsTable.vue";
import AccountList from "src/components/AccountList.vue";
import { getService, Types } from "src/di-container";
import { AccountModel } from "src/api/client";
import TotalBalanceCard from "src/components/TotalBalanceCard.vue";
import AccountBalanceGraphCard from "src/components/AccountBalanceGraphCard.vue";
import TransactionDialog from "src/components/TransactionDialog.vue";
import NewAccountDialog from "src/components/NewAccountDialog.vue";
import { debounce } from "quasar";
import IAccountService from "src/api/interfaces/accountService";
import ICategoryService from "src/api/interfaces/categoryService";
import { useAppStore } from "src/stores/app";
import { useUserStore } from "src/stores/user";

interface State {
  loading: boolean;
  transactionDialogOpen: boolean;
  newAccountDialogOpen: boolean;
  selectedAccount: AccountModel | null;
}

const userStore = useUserStore();
const appStore = useAppStore();

const state = reactive<State>({
  loading: false,
  transactionDialogOpen: false,
  newAccountDialogOpen: false,
  selectedAccount: null
});

const updateSelectedAccount = (account: AccountModel) => {
  if (state.selectedAccount) {
    if (state.selectedAccount.id === account.id) {
      return;
    }
    state.selectedAccount = account;
  }
};

const getAccounts = async () => {
  const accounts = await getService<IAccountService>(Types.AccountService).getLatestValues();
  userStore.setAccounts(accounts);
  state.selectedAccount = accounts[0];
};

const updateData = async () => {
  appStore.createTransaction();
  await getAccounts();
};

const categoryAdded = async () => {
  const categories = await getService<ICategoryService>(Types.CategoryService).getUserCategories();
  userStore.setCategories(categories);
};

const updateSelectedAccountDebounce = debounce(updateSelectedAccount, 300);

onMounted(() => {
  state.loading = true;
  state.selectedAccount = userStore.accounts[0];
  state.loading = false;
});

watch(
  () => appStore.openTransactionDialogTrigger,
  () => (state.transactionDialogOpen = true),
  {
    deep: true
  }
);
</script>
