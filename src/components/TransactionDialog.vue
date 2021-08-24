<template>
  <q-dialog v-model="state.open" persistent>
    <q-card style="width: 700px">
      <template v-if="state.loading">
        <div class="column items-center justify-center q-py-xl">
          <q-spinner color="green" size="3em" :thickness="10" />
          <h6 class="q-my-none q-pt-lg">Adding transaction ...</h6>
        </div>
      </template>
      <template v-else>
        <q-card-section class="row justify-between items-center">
          <span class="text-h6">New transaction</span>
          <q-btn size="xs" @click="closeDialog" flat dense class="q-mr-md bg-grey-2 rounded">
            <q-icon class="q-pa-xs" name="mdi-close" color="grey-9" size="xs" />
          </q-btn>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row">
            <div class="col-2 justify-center column content-center">
              <q-toggle
                style="transform: rotate(-90deg)"
                v-model="isTransfer"
                checked-icon="check"
                color="green"
                label="Transfer"
                unchecked-icon="clear"
                class="q-pl-md"
              />
            </div>
            <div class="col-10">
              <q-form class="q-gutter-md">
                <q-input
                  :error-message="amountErrors"
                  :error="!!amountErrors"
                  dense
                  square
                  filled
                  hide-bottom-space
                  clearable
                  label="Amount"
                  v-model="amount"
                  suffix="HRK"
                />
                <q-input
                  v-if="!isTransfer"
                  :error-message="descriptionErrors"
                  :error="!!descriptionErrors"
                  dense
                  square
                  filled
                  hide-bottom-space
                  clearable
                  label="Description"
                  v-model="description"
                />
                <q-select
                  v-if="!isTransfer"
                  hide-bottom-space
                  options-dense
                  filled
                  dense
                  v-model="category"
                  :options="categories"
                  label="Category"
                  :error-message="categoryErrors"
                  :error="!!categoryErrors"
                  option-value="id"
                  option-label="name"
                  clearable
                  emit-value
                  map-options
                >
                  <template #selected-item="scope">
                    <q-item class="q-px-none q-py-sm">
                      <q-item-section avatar>
                        <q-icon :name="scope.opt.icon" :color="scope.opt.color" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>
                          {{ scope.opt.name }}
                        </q-item-label>
                        <q-item-label caption> Category </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template #option="scope">
                    <q-item class="q-py-sm" v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <q-icon :name="scope.opt.icon" :color="scope.opt.color" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>
                          {{ scope.opt.name }}
                        </q-item-label>
                        <q-item-label caption> Category </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-select
                  hide-bottom-space
                  options-dense
                  filled
                  dense
                  v-model="account"
                  :options="accounts"
                  :label="isTransfer ? 'Account from' : 'Account'"
                  :error-message="accountErrors"
                  :error="!!accountErrors"
                  option-value="id"
                  option-label="name"
                  clearable
                  emit-value
                  map-options
                >
                  <template #selected-item="scope">
                    <q-item class="q-px-none q-py-sm">
                      <q-item-section>
                        <q-item-label>
                          {{ scope.opt.name }}
                        </q-item-label>
                        <q-item-label caption>
                          Balance: {{ formatBalance(scope.opt.balance, scope.opt.currency) }}
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
                          Balance: {{ formatBalance(scope.opt.balance, scope.opt.currency) }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-select
                  v-if="isTransfer"
                  hide-bottom-space
                  options-dense
                  filled
                  dense
                  v-model="accountTo"
                  :options="accounts"
                  label="Account to"
                  :error-message="accountToErrors"
                  :error="!!accountToErrors"
                  option-value="id"
                  option-label="name"
                  clearable
                  emit-value
                  map-options
                >
                  <template #selected-item="scope">
                    <q-item class="q-px-none q-py-sm">
                      <q-item-section>
                        <q-item-label>
                          {{ scope.opt.name }}
                        </q-item-label>
                        <q-item-label caption>
                          Balance: {{ formatBalance(scope.opt.balance, scope.opt.currency) }}
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
                          Balance: {{ formatBalance(scope.opt.balance, scope.opt.currency) }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-checkbox v-model="state.closeAfterAdding" label="Close after creating" />
              </q-form>
            </div>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-actions class="q-px-md justify-center">
          <q-btn
            unelevated
            color="light-green-7"
            size="md"
            label="Create"
            @click="createTransaction"
          />
        </q-card-actions>
      </template>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, computed } from "vue";
import { useForm, useField } from "vee-validate";
import { number, object, string, boolean } from "yup";
import { useQuasar } from "quasar";
import { useStore } from "src/store";
import { AccountModel, CategoryModel } from "src/api/client";
import { formatBalance } from "src/utils/helpers";
import { getService, Types } from "src/di-container";
import ITransactionService from "src/api/interfaces/transactionService";
import TransactionType from "src/utils/transactionTypes";
import IAccountService from "src/api/interfaces/accountService";

interface State {
  open: boolean;
  loading: boolean;
  closeAfterAdding: boolean;
}

interface CreateTransactionSchema {
  amount: number;
  category: number | null;
  account: number | null;
  accountTo: number | null;
  description: string | null;
  isTransfer: boolean;
}

export default defineComponent({
  name: "transaction-dialog",
  emits: ["update:open"],
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const store = useStore();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const accounts = computed(() => store.getters["user/accounts"] as AccountModel[]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const categories = computed(() => store.getters["user/categories"] as CategoryModel[]);

    const schema = object({
      amount: number().required().nullable().not([0]).label("Amount"),
      description: string()
        .when("isTransfer", {
          is: true,
          then: string().notRequired().nullable(),
          otherwise: string().required().nullable().min(4).max(50).label("Description")
        })
        .defined(),
      category: number()
        .when("isTransfer", {
          is: true,
          then: number().required().nullable().label("Category"),
          otherwise: number().notRequired().nullable()
        })
        .defined(),
      account: number()
        .when("isTransfer", {
          is: true,
          then: number().required().nullable().label("Account from"),
          otherwise: number().required().nullable().label("Account")
        })
        .defined(),
      accountTo: number()
        .when("isTransfer", {
          is: true,
          then: number().required().nullable().label("Account to"),
          otherwise: number().notRequired().nullable().label("Account to")
        })
        .defined(),
      isTransfer: boolean().notRequired().defined()
    });

    const { handleSubmit, resetForm } = useForm<CreateTransactionSchema>({
      validationSchema: schema,
      initialValues: {
        isTransfer: false,
        amount: 0,
        category: null,
        account: null,
        accountTo: null,
        description: ""
      }
    });

    const { value: amount, errorMessage: amountErrors } = useField<number>("amount");
    const { value: description, errorMessage: descriptionErrors } = useField<string>("description");
    const { value: category, errorMessage: categoryErrors } = useField<number | null>("category");
    const { value: account, errorMessage: accountErrors } = useField<number | null>("account");
    const { value: accountTo, errorMessage: accountToErrors } = useField<number | null>(
      "accountTo"
    );
    const { value: isTransfer } = useField<boolean>("isTransfer");

    const state: State = reactive({
      open: props.open,
      loading: false,
      closeAfterAdding: false
    });

    function resetFormData(resetCloseAfterAdding?: boolean) {
      resetForm({
        values: {
          isTransfer: false,
          amount: 0,
          description: "",
          category: null,
          account: null,
          accountTo: null
        }
      });
      if (resetCloseAfterAdding) {
        state.closeAfterAdding = false;
      }
    }

    function closeDialog() {
      resetFormData(true);
      emit("update:open", false);
    }

    const createTransaction = handleSubmit(async () => {
      try {
        state.loading = true;

        if (isTransfer.value) {
          await getService<ITransactionService>(Types.TransactionService).transfer({
            amount: parseFloat(amount.value.toString()),
            accountFromId: account.value as number,
            accountToId: accountTo.value as number
          });
        } else {
          await getService<ITransactionService>(Types.TransactionService).create({
            amount: parseFloat(amount.value.toString()),
            accountId: account.value as number,
            categoryId: category.value as number,
            description: description.value,
            transactionType:
              parseFloat(amount.value.toString()) < 0
                ? TransactionType.Expense
                : TransactionType.Income
          });
        }

        const accounts = await getService<IAccountService>(Types.AccountService).getLatestValues();
        await store.dispatch("user/setAccounts", accounts);

        $q.notify({
          message: "Transaction added",
          color: "green",
          position: "top"
        });

        if (state.closeAfterAdding) {
          closeDialog();
        } else {
          resetFormData();
        }
      } catch (e) {
        $q.notify({
          message: (e as Error).message,
          color: "red",
          position: "top"
        });
      } finally {
        setTimeout(() => {
          state.loading = false;
        }, 1500);
      }
    });

    watch(
      () => props.open,
      (val) => {
        state.open = val;
      }
    );

    return {
      state,
      closeDialog,
      amount,
      description,
      amountErrors,
      descriptionErrors,
      createTransaction,
      category,
      categoryErrors,
      account,
      accountErrors,
      categories,
      accounts,
      formatBalance,
      isTransfer,
      accountTo,
      accountToErrors
    };
  }
});
</script>
