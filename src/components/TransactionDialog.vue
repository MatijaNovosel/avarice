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
          <span class="text-h6">
            New {{ state.panel == "newTransaction" ? "transaction" : "category" }}
          </span>
          <q-btn size="xs" @click="closeDialog" flat dense class="q-mr-md bg-grey-2 rounded">
            <q-icon class="q-pa-xs" name="mdi-close" color="grey-9" size="xs" />
          </q-btn>
        </q-card-section>
        <q-separator />
        <q-card-section class="q-pl-none">
          <q-tab-panels v-model="state.panel" animated>
            <q-tab-panel name="newTransaction" class="q-pl-none">
              <div class="row">
                <div class="col-2 justify-center column content-center">
                  <q-toggle
                    style="transform: rotate(-90deg)"
                    v-model="state.isTransfer"
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
                      dense
                      square
                      filled
                      hide-bottom-space
                      clearable
                      label="Amount"
                      v-model="state.transaction.amount"
                      suffix="HRK"
                    />
                    <q-input
                      v-if="!state.isTransfer"
                      dense
                      square
                      filled
                      hide-bottom-space
                      clearable
                      label="Description"
                      v-model="state.transaction.description"
                    />
                    <q-select
                      v-if="!state.isTransfer"
                      hide-bottom-space
                      options-dense
                      filled
                      dense
                      v-model="state.transaction.category"
                      :options="categories"
                      label="Category"
                      option-value="id"
                      option-label="name"
                      clearable
                      emit-value
                      map-options
                    >
                      <template #after>
                        <q-btn
                          @click="state.panel = 'newCategory'"
                          size="xs"
                          flat
                          dense
                          class="bg-green-5 rounded"
                        >
                          <q-icon class="q-pa-xs" name="mdi-plus" color="white" size="xs" />
                        </q-btn>
                      </template>
                      <template #selected-item="scope">
                        <q-item class="q-px-none q-py-sm">
                          <q-item-section avatar>
                            <q-icon :style="{ color: scope.opt.color }" :name="scope.opt.icon" />
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
                      v-model="state.transaction.account"
                      :options="accounts"
                      :label="state.isTransfer ? 'Account from' : 'Account'"
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
                              Balance:
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
                              Balance:
                              {{ formatBalance(scope.opt.balance, scope.opt.currency) }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                    <q-select
                      v-if="state.isTransfer"
                      hide-bottom-space
                      options-dense
                      filled
                      dense
                      v-model="state.transaction.accountTo"
                      :options="accounts"
                      label="Account to"
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
                              Balance:
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
                              Balance:
                              {{ formatBalance(scope.opt.balance, scope.opt.currency) }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                    <q-checkbox v-model="state.closeAfterAdding" label="Close after creating" />
                  </q-form>
                </div>
              </div>
            </q-tab-panel>
            <q-tab-panel name="newCategory" class="q-pl-none">
              <div class="row">
                <div class="col-2 justify-center column content-center">
                  <q-btn
                    @click="state.panel = 'newTransaction'"
                    size="xs"
                    flat
                    dense
                    class="bg-grey-4 rounded"
                  >
                    <q-icon class="q-pa-xs" name="mdi-chevron-left" color="bg-grey-6" size="xs" />
                  </q-btn>
                </div>
                <div class="col-10">
                  <q-form class="q-gutter-md">
                    <q-input
                      v-model="state.categoryName"
                      dense
                      square
                      filled
                      hide-bottom-space
                      clearable
                      label="Name"
                    >
                      <template #after>
                        <q-btn size="sm" flat dense class="bg-grey-4 rounded q-ml-md">
                          <q-icon
                            class="q-pa-xs"
                            :name="state.selectedIcon"
                            color="bg-grey-6"
                            size="sm"
                          />
                          <q-menu touch-position>
                            <q-virtual-scroll style="max-height: 300px" :items="iconList" separator>
                              <template v-slot="{ item, index }">
                                <q-item :key="index" dense>
                                  <q-item-section avatar>
                                    <q-btn
                                      flat
                                      size="small"
                                      dense
                                      class="q-mx-md bg-white rounded"
                                      @click="setCategoryIcon(item.name)"
                                    >
                                      <q-icon
                                        class="q-pa-xs"
                                        :name="item.name"
                                        color="grey-9"
                                        size="sm"
                                      />
                                    </q-btn>
                                  </q-item-section>
                                </q-item>
                              </template>
                            </q-virtual-scroll>
                          </q-menu>
                        </q-btn>
                        <q-btn flat dense class="q-ml-md" size="lg">
                          <q-icon
                            class="rounded"
                            :style="{ backgroundColor: state.selectedColor }"
                          />
                          <q-menu touch-position>
                            <q-color
                              v-model="state.selectedColor"
                              no-header
                              no-footer
                              default-view="palette"
                            />
                          </q-menu>
                        </q-btn>
                      </template>
                    </q-input>
                  </q-form>
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
        <q-separator />
        <q-card-actions class="q-px-md justify-center">
          <q-btn
            unelevated
            color="light-green-7"
            size="md"
            label="Create"
            @click="createTransactionOrCategory"
          />
        </q-card-actions>
      </template>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, computed } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "src/store";
import { AccountModel, CategoryModel } from "src/api/client";
import { formatBalance } from "src/utils/helpers";
import { getService, Types } from "src/di-container";
import ITransactionService from "src/api/interfaces/transactionService";
import TransactionType from "src/utils/transactionTypes";
import ICategoryService from "src/api/interfaces/categoryService";
import icons from "../utils/icons.json";

interface NewTransaction {
  amount: number;
  category: number | null;
  account: number | null;
  accountTo: number | null;
  description: string | null;
}

interface State {
  open: boolean;
  loading: boolean;
  closeAfterAdding: boolean;
  panel: string;
  selectedIcon: string;
  selectedColor: string;
  isTransfer: boolean;
  transaction: NewTransaction;
  categoryName: string | null;
}

export default defineComponent({
  name: "transaction-dialog",
  emits: ["update:open", "transaction-added", "category-added"],
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

    const state: State = reactive({
      open: props.open,
      loading: false,
      closeAfterAdding: false,
      selectedColor: "#ff00ff",
      panel: "newTransaction",
      selectedIcon: "mdi-plus",
      categoryName: null,
      isTransfer: false,
      transaction: {
        amount: 0,
        category: null,
        account: null,
        accountTo: null,
        description: null
      }
    });

    function resetFormData(resetCloseAfterAdding?: boolean) {
      // Reset here
      if (resetCloseAfterAdding) {
        state.closeAfterAdding = false;
      }
    }

    function closeDialog() {
      resetFormData(true);
      emit("update:open", false);
    }

    function setCategoryIcon(name: string) {
      state.selectedIcon = name;
    }

    const createTransactionOrCategory = async () => {
      try {
        state.loading = true;

        if (state.panel === "newTransaction") {
          if (state.isTransfer) {
            await getService<ITransactionService>(Types.TransactionService).transfer({
              amount: state.transaction.amount,
              accountFromId: state.transaction.account as number,
              accountToId: state.transaction.accountTo as number
            });
          } else {
            await getService<ITransactionService>(Types.TransactionService).create({
              amount: state.transaction.amount,
              accountId: state.transaction.account as number,
              categoryId: state.transaction.category as number,
              description: state.transaction.description as string,
              transactionType:
                state.transaction.amount < 0 ? TransactionType.Expense : TransactionType.Income
            });
          }

          emit("transaction-added");

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
        } else {
          await getService<ICategoryService>(Types.CategoryService).createCategory({
            name: state.categoryName as string,
            icon: state.selectedIcon,
            color: state.selectedColor
          });

          emit("category-added");

          $q.notify({
            message: "Category added",
            color: "green",
            position: "top"
          });
        }
      } catch (e) {
        $q.notify({
          message: (e as Error).message,
          color: "red",
          position: "top"
        });
      } finally {
        state.loading = false;
      }
    };

    watch(
      () => props.open,
      (val) => {
        state.open = val;
      }
    );

    const iconList = [];

    for (let i = 0; i < icons.length; i++) {
      iconList.push({
        name: `mdi-${icons[i].icon}`
      });
    }

    return {
      state,
      closeDialog,
      createTransactionOrCategory,
      categories,
      accounts,
      formatBalance,
      iconList,
      setCategoryIcon
    };
  }
});
</script>
