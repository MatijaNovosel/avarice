<template>
  <q-page padding class="bg-grey-2">
    <div class="row">
      <div class="col-3 q-pr-lg">
        <account-list :accounts="state.accounts" />
      </div>
      <div class="col-9">
        <div class="row">
          <div class="col-12 col-md-6 q-pr-lg">
            <q-card class="rounded-md q-px-md q-py-xs" flat>
              <q-card-section class="row items-center justify-between q-pb-sm">
                <span class="text-weight-bold"> Total balance </span>
                <div>
                  <q-chip
                    color="pink-1"
                    size="sm"
                    class="q-px-md"
                    text-color="red"
                    icon="mdi-arrow-top-right"
                  >
                    <b> 1,500.00 HRK </b>
                  </q-chip>
                  <q-chip
                    size="sm"
                    color="green-1"
                    class="q-px-md"
                    text-color="green"
                    icon="mdi-arrow-bottom-left"
                  >
                    <b> 500.00 HRK </b>
                  </q-chip>
                </div>
              </q-card-section>
              <q-card-section>
                <div class="text-h3 text-center">2,500.00 HRK</div>
              </q-card-section>
              <q-card-actions class="row justify-center">
                <q-btn
                  flat
                  size="sm"
                  label="New transaction"
                  class="rounded bg-grey-3"
                  icon="mdi-swap-horizontal"
                />
              </q-card-actions>
            </q-card>
          </div>
          <div class="col-12 col-md-6">
            <q-card flat class="rounded-md">
              <q-card-section>
                <q-btn flat dense class="q-mr-md bg-grey-2 rounded">
                  <q-icon class="q-pa-xs" name="mdi-tune-variant" color="grey-9" size="sm" />
                </q-btn>
                <q-btn flat dense class="q-mr-md bg-grey-2 rounded">
                  <q-icon class="q-pa-xs" name="mdi-calendar-outline" color="grey-9" size="sm" />
                </q-btn>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="row q-mt-lg">
          <div class="col-12">
            <transactions-table :data="state.transactions" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import TransactionsTable from "src/components/TransactionsTable.vue";
import AccountList from "src/components/AccountList.vue";
import { getService, Types } from "src/di-container";
import IAccountService from "src/api/interfaces/accountService";
import { Account, IPageableCollectionOfTransactionModel } from "src/api/client";
import ITransactionService from "src/api/interfaces/transactionService";

interface State {
  transactions: IPageableCollectionOfTransactionModel;
  accounts: Account[];
}

export default defineComponent({
  name: "Dashboard",
  components: {
    TransactionsTable,
    AccountList
  },
  setup() {
    const state: State = reactive({
      balance: 2500,
      accounts: [],
      transactions: {
        total: 0,
        results: []
      }
    });

    onMounted(async () => {
      state.accounts = await getService<IAccountService>(Types.AccountService).getLatestValues();
      state.transactions = await getService<ITransactionService>(Types.TransactionService).getAll();
    });

    return {
      state
    };
  }
});
</script>
