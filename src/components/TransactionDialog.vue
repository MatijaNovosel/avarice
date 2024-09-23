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
          <span class="text-h6"> {{ editing ? "Edit transaction" : "New transaction" }} </span>
          <q-btn flat dense class="bg-grey-9 rounded" size="xs" @click="closeDialog">
            <q-icon class="q-pa-xs" name="mdi-close" size="xs" />
          </q-btn>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-input v-model="state.transaction.amount" dense square filled clearable label="">
            <template #label> <required-icon /> Amount </template>
          </q-input>
          <q-input
            v-if="!state.isTransfer"
            v-model="state.transaction.description"
            dense
            square
            filled
            clearable
            label=""
          >
            <template #label> <required-icon /> Description </template>
          </q-input>
          <q-select
            v-if="!state.isTransfer"
            v-model="state.transaction.category"
            options-dense
            filled
            dense
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
                    {{ (scope.opt.parent && scope.opt.parent.name) || i18n.t("noParentCategory") }}
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
                    {{ (scope.opt.parent && scope.opt.parent.name) || i18n.t("noParentCategory") }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select
            v-model="state.transaction.account"
            options-dense
            filled
            dense
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
            v-model="state.transaction.accountTo"
            options-dense
            filled
            dense
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
          <q-checkbox v-model="state.closeAfterAdding" :label="i18n.t('closeAfterCreating')" />
          <q-checkbox
            v-if="!editing"
            v-model="state.saveAsTemplate"
            label="Save as a template after creating"
          />
          <div v-if="!editing" class="row justify-between">
            <q-toggle v-model="state.isTransfer" :label="i18n.t('transfer')" color="accent" />
            <div>
              <q-btn :disable="templates.length === 0" flat dense class="q-ml-md bg-accent rounded">
                <q-icon class="q-pa-xs" name="mdi-file" size="sm" color="grey-10" />
                <q-tooltip> {{ i18n.t("selectTemplate") }} </q-tooltip>
              </q-btn>
              <q-btn flat dense class="q-ml-md bg-accent rounded">
                <q-icon class="q-pa-xs" name="mdi-map-marker" size="sm" color="grey-10" />
                <q-tooltip> {{ i18n.t("selectLocation") }} </q-tooltip>
              </q-btn>
            </div>
          </div>
          <div class="text-right">
            <q-btn color="accent" label="Confirm" type="submit" />
          </div>
        </q-card-section>
      </template>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import IAccountService from "@/api/interfaces/accountService";
import ITransactionService from "@/api/interfaces/transactionService";
import RequiredIcon from "@/components/RequiredIcon.vue";
import { Types, getService } from "@/di-container";
import { TransactionModel } from "@/models/transaction";
import { useAppStore } from "@/stores/app";
import { useUserStore } from "@/stores/user";
import { formatBalance } from "@/utils/helpers";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { computed, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";

interface State {
  transactionId: string | null;
  loading: boolean;
  closeAfterAdding: boolean;
  isTransfer: boolean;
  saveAsTemplate: boolean;
  transaction: {
    amount: string | null;
    category: string | null;
    account: string | null;
    accountTo: string | null;
    description: string | null;
  };
}

const $q = useQuasar();
const i18n = useI18n();

const userStore = useUserStore();
const { accounts, categories, templates } = storeToRefs(userStore);
const appStore = useAppStore();
const { transactionDialogOpen, transactionEphemeral } = storeToRefs(appStore);

const state: State = reactive({
  transactionId: null,
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

const editing = computed(() => state.transactionId != null);

const resetFormData = () => {
  state.transaction = {
    amount: "0",
    category: null,
    account: null,
    accountTo: null,
    description: null
  };
  state.transactionId = null;
};

const closeDialog = () => {
  resetFormData();
  appStore.toggleTransactionDialog();
};

const createTransactionOrCategory = async () => {
  try {
    state.loading = true;
    const amount = parseFloat(state.transaction.amount as string);

    if (transactionEphemeral.value) {
      await getService<ITransactionService>(Types.TransactionService).edit({
        amount,
        categoryId: state.transaction.category as string,
        description: state.transaction.description as string,
        id: state.transactionId as string
      });
    } else {
      if (state.isTransfer) {
        await getService<ITransactionService>(Types.TransactionService).transfer({
          amount,
          accountFromId: state.transaction.account as string,
          accountToId: state.transaction.accountTo as string
        });
      } else {
        await getService<ITransactionService>(Types.TransactionService).create({
          amount,
          accountId: state.transaction.account as string,
          categoryId: state.transaction.category as string,
          description: state.transaction.description as string,
          saveAsTemplate: state.saveAsTemplate
        });
      }
    }

    appStore.notifyTransactionChanged();

    const accounts = await getService<IAccountService>(Types.AccountService).getLatestValues();

    userStore.setAccounts(accounts);

    $q.notify({
      message: i18n.t("success"),
      color: "dark",
      textColor: "green",
      position: "bottom"
    });

    if (state.closeAfterAdding) {
      closeDialog();
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

watch(
  () => transactionDialogOpen.value,
  (val) => {
    if (val && transactionEphemeral.value) {
      const { account, amount, category, description, id } =
        transactionEphemeral.value as TransactionModel;
      state.transactionId = id;
      state.transaction.amount = amount.toString();
      state.transaction.description = description;
      state.transaction.category = category.id;
      state.transaction.account = account.id;
    } else {
      appStore.setTransactionEphemeral(null);
    }
  }
);

watch(
  () => state.isTransfer,
  () => {
    state.transaction = {
      amount: "0",
      category: null,
      account: null,
      accountTo: null,
      description: null
    };
  }
);
</script>
