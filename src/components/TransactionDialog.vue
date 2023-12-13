<template>
  <q-dialog v-model="transactionDialogOpen" persistent>
    <q-card flat style="min-width: 700px">
      <template v-if="state.loading">
        <div class="column items-center justify-center q-py-xl">
          <q-spinner color="green" size="3em" :thickness="10" />
          <h6 class="q-my-none q-pt-lg">Adding transaction ...</h6>
        </div>
      </template>
      <template v-else>
        <q-card-section class="row justify-between items-center">
          <span class="text-h6"> New transaction </span>
          <q-btn size="xs" @click="closeDialog" flat dense class="bg-grey-9 rounded">
            <q-icon class="q-pa-xs" name="mdi-close" size="xs" />
          </q-btn>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input
              dense
              square
              filled
              clearable
              label=""
              v-model="state.transaction.amount"
              suffix="EUR"
            >
              <template #label> <required-icon /> Amount </template>
            </q-input>
            <q-input
              v-if="!state.isTransfer"
              dense
              square
              filled
              clearable
              label=""
              v-model="state.transaction.description"
            >
              <template #label> <required-icon /> Description </template>
            </q-input>
            <q-select
              v-if="!state.isTransfer"
              options-dense
              filled
              dense
              v-model="state.transaction.category"
              :options="categories"
              label=""
              option-value="id"
              option-label="name"
              clearable
              emit-value
              map-options
            >
              <template #label> <required-icon /> Category </template>
              <template #selected-item="scope">
                <q-item class="q-px-none q-pb-sm q-pt-md">
                  <q-item-section avatar>
                    <q-icon :style="{ color: scope.opt.color }" :name="scope.opt.icon" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ scope.opt.name }}
                    </q-item-label>
                    <q-item-label caption class="text-grey-7">
                      {{ (scope.opt.parent && scope.opt.parent.name) || "No parent category" }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template #option="scope">
                <q-item class="q-py-sm" v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon
                      :style="{ color: scope.opt.color }"
                      :name="scope.opt.icon"
                      :color="scope.opt.color"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ scope.opt.name }}
                    </q-item-label>
                    <q-item-label caption class="text-grey-7">
                      {{ (scope.opt.parent && scope.opt.parent.name) || "No parent category" }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-select
              options-dense
              filled
              dense
              v-model="state.transaction.account"
              :options="accounts"
              label=""
              option-value="id"
              option-label="name"
              clearable
              emit-value
              map-options
            >
              <template #label>
                <required-icon /> {{ state.isTransfer ? "Account from" : "Account" }}
              </template>
              <template #selected-item="scope">
                <q-item class="q-px-none q-py-sm">
                  <q-item-section>
                    <q-item-label>
                      {{ scope.opt.name }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ formatBalance(scope.opt.balance, scope.opt.currency) }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template #option="scope">
                <q-item class="q-py-sm" v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>
                      {{ scope.opt.name }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ formatBalance(scope.opt.balance, scope.opt.currency) }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-select
              v-if="state.isTransfer"
              options-dense
              filled
              dense
              v-model="state.transaction.accountTo"
              :options="accounts"
              label=""
              option-value="id"
              option-label="name"
              clearable
              emit-value
              map-options
            >
              <template #label> <required-icon /> Account to </template>
              <template #selected-item="scope">
                <q-item class="q-px-none q-py-sm">
                  <q-item-section>
                    <q-item-label>
                      {{ scope.opt.name }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ formatBalance(scope.opt.balance, scope.opt.currency) }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template #option="scope">
                <q-item class="q-py-sm" v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>
                      {{ scope.opt.name }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ formatBalance(scope.opt.balance, scope.opt.currency) }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-checkbox v-model="state.closeAfterAdding" label="Close after creating" />
            <q-checkbox v-model="state.saveAsTemplate" label="Save as a template after creating" />
            <q-checkbox v-model="state.clearDataAferSaving" label="Clear data after saving" />
            <div class="row justify-between">
              <div>
                <q-toggle v-model="state.expense" label="Expense" color="accent" />
                <q-toggle v-model="state.isTransfer" label="Transfer" color="accent" />
              </div>
              <div>
                <q-btn
                  :disable="templates.length === 0"
                  flat
                  dense
                  class="q-ml-md bg-accent rounded"
                >
                  <q-icon class="q-pa-xs" name="mdi-file" size="sm" color="grey-10" />
                  <q-tooltip> Select template </q-tooltip>
                </q-btn>
                <q-btn flat dense class="q-ml-md bg-accent rounded">
                  <q-icon class="q-pa-xs" name="mdi-map-marker" size="sm" color="grey-10" />
                  <q-tooltip> Select location </q-tooltip>
                </q-btn>
              </div>
            </div>
          </q-form>
        </q-card-section>
        <q-separator />
        <q-card-actions class="q-pa-md justify-end">
          <q-btn color="accent" label="Create" @click="createTransactionOrCategory" />
        </q-card-actions>
      </template>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import IAccountService from "src/api/interfaces/accountService";
import ITransactionService from "src/api/interfaces/transactionService";
import RequiredIcon from "src/components/RequiredIcon.vue";
import { Types, getService } from "src/di-container";
import { useAppStore } from "src/stores/app";
import { useUserStore } from "src/stores/user";
import { formatBalance } from "src/utils/helpers";
import { reactive } from "vue";

interface State {
  loading: boolean;
  closeAfterAdding: boolean;
  isTransfer: boolean;
  saveAsTemplate: boolean;
  clearDataAferSaving: boolean;
  expense: boolean;
  transaction: {
    amount: string | null;
    category: string | null;
    account: string | null;
    accountTo: string | null;
    description: string | null;
  };
}

const $q = useQuasar();

const userStore = useUserStore();
const { accounts, categories, templates } = storeToRefs(userStore);
const appStore = useAppStore();
const { transactionDialogOpen, transactionEmphereal } = storeToRefs(appStore);

const state: State = reactive({
  loading: false,
  closeAfterAdding: false,
  isTransfer: false,
  saveAsTemplate: false,
  clearDataAferSaving: false,
  expense: true,
  transaction: {
    amount: "0",
    category: null,
    account: null,
    accountTo: null,
    description: null
  }
});

const resetFormData = (resetCloseAfterAdding?: boolean) => {
  state.transaction = {
    amount: "0",
    category: null,
    account: null,
    accountTo: null,
    description: null
  };

  if (resetCloseAfterAdding) {
    state.closeAfterAdding = false;
  }
};

const closeDialog = () => {
  resetFormData(true);
  appStore.toggleTransactionDialog();
};

const createTransactionOrCategory = async () => {
  try {
    state.loading = true;

    if (state.isTransfer) {
      //
    } else {
      const amount = parseFloat(state.transaction.amount as string);
      await getService<ITransactionService>(Types.TransactionService).create({
        amount: state.expense ? amount * -1 : amount,
        accountId: state.transaction.account as string,
        categoryId: state.transaction.category as string,
        description: state.transaction.description as string,
        saveAsTemplate: state.saveAsTemplate
      });
    }

    appStore.notifyTransactionChanged();

    const accounts = await getService<IAccountService>(Types.AccountService).getLatestValues();

    userStore.setAccounts(accounts);

    $q.notify({
      message: "Transaction added",
      color: "dark",
      textColor: "green",
      position: "bottom"
    });

    if (state.closeAfterAdding) {
      closeDialog();
    } else {
      if (state.clearDataAferSaving) {
        resetFormData();
      }
    }
  } catch (e) {
    $q.notify({
      message: (e as Error).message,
      color: "dark",
      textColor: "red",
      position: "bottom"
    });
  } finally {
    state.loading = false;
  }
};
</script>
