<template>
  <q-dialog v-model="transactionDialogOpen" persistent>
    <q-card style="min-width: 700px">
      <template v-if="state.loading">
        <div class="column items-center justify-center q-py-xl">
          <q-spinner color="green" size="3em" :thickness="10" />
          <h6 class="q-my-none q-pt-lg">Adding transaction ...</h6>
        </div>
      </template>
      <template v-else>
        <q-card-section class="row justify-between items-center">
          <span class="text-h6"> New transaction </span>
          <q-btn size="xs" @click="closeDialog" flat dense class="q-mr-md bg-grey-9 rounded">
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
              suffix="HRK"
              :error="$v.amount.$error"
              :error-message="collectErrors($v.amount.$errors)"
              :hide-bottom-space="!$v.amount.$error"
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
              :error="$v.description.$error"
              :error-message="collectErrors($v.description.$errors)"
              :hide-bottom-space="!$v.description.$error"
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
              :error="$v.category.$error"
              :error-message="collectErrors($v.category.$errors)"
              :hide-bottom-space="!$v.category.$error"
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
              :error="$v.account.$error"
              :error-message="collectErrors($v.account.$errors)"
              :hide-bottom-space="!$v.account.$error"
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
              :error="$v.accountTo.$error"
              :error-message="collectErrors($v.accountTo.$errors)"
              :hide-bottom-space="!$v.accountTo.$error"
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
            <div class="row justify-end">
              <q-btn flat dense class="q-ml-md bg-accent rounded">
                <q-icon class="q-pa-xs" name="mdi-file" size="sm" color="grey-10" />
                <q-tooltip> Select template </q-tooltip>
              </q-btn>
              <q-btn flat dense class="q-ml-md bg-accent rounded">
                <q-icon class="q-pa-xs" name="mdi-map-marker" size="sm" color="grey-10" />
                <q-tooltip> Select location </q-tooltip>
              </q-btn>
            </div>
          </q-form>
        </q-card-section>
        <q-separator />
        <q-card-actions class="q-pa-md justify-end">
          <q-btn
            :disable="$v.$invalid"
            color="accent"
            label="Create"
            @click="createTransactionOrCategory"
          />
        </q-card-actions>
      </template>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { useQuasar } from "quasar";
import { formatBalance, collectErrors } from "src/utils/helpers";
import { getService, Types } from "src/di-container";
import ITransactionService from "src/api/interfaces/transactionService";
import RequiredIcon from "src/components/RequiredIcon.vue";
import ITemplateService from "src/api/interfaces/templateService";
import { useUserStore } from "src/stores/user";
import { required, decimal, requiredIf } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import IAccountService from "src/api/interfaces/accountService";
import { useAppStore } from "src/stores/app";
import { storeToRefs } from "pinia";

interface State {
  loading: boolean;
  closeAfterAdding: boolean;
  isTransfer: boolean;
  saveAsTemplate: boolean;
  transaction: {
    amount: string | null;
    category: number | null;
    account: number | null;
    accountTo: number | null;
    description: string | null;
  };
}

const $q = useQuasar();

const userStore = useUserStore();
const { accounts, categories } = storeToRefs(userStore);
const appStore = useAppStore();
const { transactionDialogOpen } = storeToRefs(appStore);

const state: State = reactive({
  loading: false,
  closeAfterAdding: false,
  isTransfer: false,
  saveAsTemplate: false,
  transaction: {
    amount: "0",
    category: null,
    account: null,
    accountTo: null,
    description: null
  }
});

const rules = {
  amount: { required, decimal, $autoDirty: true },
  category: { requiredIf: requiredIf(!state.isTransfer), $autoDirty: true },
  account: { required, $autoDirty: true },
  accountTo: { requiredIf: requiredIf(state.isTransfer), $autoDirty: true },
  description: { required, $autoDirty: true }
};

const $v = useVuelidate(rules, state.transaction);

const resetFormData = (resetCloseAfterAdding?: boolean) => {
  state.transaction = {
    amount: "0",
    category: null,
    account: null,
    accountTo: null,
    description: null
  };

  $v.value.$reset();

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
      await getService<ITransactionService>(Types.TransactionService).transfer({
        amount: parseFloat(state.transaction.amount as string),
        accountFromId: state.transaction.account as number,
        accountToId: state.transaction.accountTo as number
      });
    } else {
      await getService<ITransactionService>(Types.TransactionService).create({
        amount: parseFloat(state.transaction.amount as string),
        accountId: state.transaction.account as number,
        categoryId: state.transaction.category as number,
        description: state.transaction.description as string
      });
      if (state.saveAsTemplate) {
        await getService<ITemplateService>(Types.TemplateService).create({
          amount: parseFloat(state.transaction.amount as string),
          accountId: state.transaction.account as number,
          categoryId: state.transaction.category as number,
          description: state.transaction.description as string
        });
      }
    }

    appStore.notifyTransactionChanged();

    const fetchedAccounts = await getService<IAccountService>(
      Types.AccountService
    ).getLatestValues();

    userStore.setAccounts(fetchedAccounts);

    $q.notify({
      message: "Transaction added",
      color: "dark",
      textColor: "green",
      position: "bottom"
    });

    state.transaction = {
      amount: "0",
      category: null,
      account: null,
      accountTo: null,
      description: null
    };

    if (state.closeAfterAdding) {
      closeDialog();
    } else {
      resetFormData();
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
