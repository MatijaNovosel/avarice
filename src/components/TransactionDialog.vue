<template>
  <q-dialog v-model="state.open" persistent>
    <q-card style="min-width: 700px">
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
          <q-btn size="xs" @click="closeDialog" flat dense class="q-mr-md bg-grey-9 rounded">
            <q-icon class="q-pa-xs" name="mdi-close" size="xs" />
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
                      label=""
                      v-model="state.transaction.amount"
                      suffix="HRK"
                    >
                      <template #label> <required-icon /> Amount </template>
                    </q-input>
                    <q-input
                      v-if="!state.isTransfer"
                      dense
                      square
                      filled
                      hide-bottom-space
                      clearable
                      label=""
                      v-model="state.transaction.description"
                    >
                      <template #label> <required-icon /> Description </template>
                    </q-input>
                    <q-select
                      v-if="!state.isTransfer"
                      hide-bottom-space
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
                            <q-item-label caption class="text-grey-7">
                              {{
                                (scope.opt.parent && scope.opt.parent.name) || "No parent category"
                              }}
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
                              {{
                                (scope.opt.parent && scope.opt.parent.name) || "No parent category"
                              }}
                            </q-item-label>
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
                      hide-bottom-space
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
                    <q-checkbox
                      v-model="state.saveAsTemplate"
                      label="Save as a template after creating"
                    />
                    <div class="row justify-end">
                      <q-btn flat dense class="q-ml-md bg-dark-red rounded">
                        <q-icon class="q-pa-xs" name="mdi-file" size="sm" color="grey-10" />
                        <q-tooltip> Select template </q-tooltip>
                      </q-btn>
                      <q-btn flat dense class="q-ml-md bg-dark-red rounded">
                        <q-icon class="q-pa-xs" name="mdi-map-marker" size="sm" color="grey-10" />
                        <q-tooltip> Select location </q-tooltip>
                      </q-btn>
                    </div>
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
                    class="bg-grey-9 rounded"
                  >
                    <q-icon class="q-pa-xs" name="mdi-chevron-left" size="xs" />
                  </q-btn>
                </div>
                <div class="col-10">
                  <q-form class="q-gutter-md">
                    <q-input
                      v-model="state.categoryName"
                      dense
                      square
                      filled
                      label=""
                      hide-bottom-space
                      clearable
                    >
                      <template #label> <required-icon /> Category name </template>
                      <template #after>
                        <q-icon
                          class="rounded bg-black q-pa-sm"
                          :style="{ color: state.selectedColor }"
                          :name="state.selectedIcon"
                        >
                          <q-tooltip>
                            {{ state.selectedIcon.split("mdi-")[1] }}
                          </q-tooltip>
                        </q-icon>
                        <q-btn flat dense size="lg">
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
                    <q-select
                      hide-bottom-space
                      options-dense
                      filled
                      dense
                      v-model="state.newCategoryParent"
                      :options="categories"
                      option-value="id"
                      option-label="name"
                      label="Parent category"
                      clearable
                      emit-value
                      map-options
                    >
                      <template #selected-item="scope">
                        <q-item class="q-px-none q-py-sm">
                          <q-item-section avatar>
                            <q-icon :style="{ color: scope.opt.color }" :name="scope.opt.icon" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>
                              {{ scope.opt.name }}
                            </q-item-label>
                            <q-item-label caption class="text-grey-7">
                              {{
                                (scope.opt.parent && scope.opt.parent.name) || "No parent category"
                              }}
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
                              {{
                                (scope.opt.parent && scope.opt.parent.name) || "No parent category"
                              }}
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                    <q-input placeholder="Search icons" dense filled v-model="state.iconSearchText">
                      <template #append>
                        <q-icon size="xs" name="mdi-magnify" />
                      </template>
                    </q-input>
                    <q-list
                      ref="scrollTargetRef"
                      class="scroll bg-icon-list q-pt-md rounded"
                      style="max-height: 250px"
                    >
                      <q-infinite-scroll @load="onIconLoad" :offset="50">
                        <div v-for="(icons, i) in state.icons" :key="i" class="row justify-center">
                          <q-btn
                            v-for="(icon, j) in icons"
                            :key="j"
                            class="bg-black q-pa-sm q-mr-xs q-mb-xs rounded"
                            flat
                            dense
                            @click="setCategoryIcon(`mdi-${icon}`)"
                          >
                            <q-icon
                              :style="{
                                color: state.selectedColor
                              }"
                              :name="`mdi-${icon}`"
                            >
                              <q-tooltip>
                                {{ icon }}
                              </q-tooltip>
                            </q-icon>
                          </q-btn>
                        </div>
                        <template #loading>
                          <div class="row justify-center q-my-md">
                            <q-spinner-dots :style="{ color: state.selectedColor }" size="40px" />
                          </div>
                        </template>
                      </q-infinite-scroll>
                    </q-list>
                  </q-form>
                </div>
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
        <q-separator />
        <q-card-actions class="q-pa-md justify-end">
          <q-btn
            unelevated
            color="light-green-7"
            size="sm"
            label="Create"
            @click="createTransactionOrCategory"
          />
        </q-card-actions>
      </template>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, computed, ref } from "vue";
import { useQuasar } from "quasar";
import { useStore } from "src/store";
import { AccountModel, CategoryModel } from "src/api/client";
import { chunkArray, formatBalance } from "src/utils/helpers";
import { getService, Types } from "src/di-container";
import ITransactionService from "src/api/interfaces/transactionService";
import TransactionType from "src/utils/transactionTypes";
import ICategoryService from "src/api/interfaces/categoryService";
import RequiredIcon from "src/components/RequiredIcon.vue";
import ITemplateService from "src/api/interfaces/templateService";
import icons from "../utils/icons";

interface NewTransaction {
  amount: string | null;
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
  saveAsTemplate: boolean;
  transaction: NewTransaction;
  categoryName: string | null;
  iconSearchText: string | null;
  newCategoryParent: number | null;
  icons: string[][];
  filteredIcons: string[];
}

export default defineComponent({
  name: "transaction-dialog",
  emits: ["update:open", "transaction-added", "category-added"],
  components: {
    RequiredIcon
  },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const store = useStore();
    const scrollTargetRef = ref<HTMLElement | null>(null);
    const chunkedIconList = chunkArray<string>(icons, 10);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const accounts = computed(() => store.getters["user/accounts"] as AccountModel[]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const categories = computed(() => store.getters["user/categories"] as CategoryModel[]);

    const state: State = reactive({
      open: props.open,
      loading: false,
      newCategoryParent: null,
      closeAfterAdding: false,
      selectedColor: "#ff00ff",
      panel: "newTransaction",
      selectedIcon: "mdi-plus",
      categoryName: null,
      isTransfer: false,
      saveAsTemplate: false,
      icons: [],
      filteredIcons: [],
      iconSearchText: null,
      transaction: {
        amount: "0",
        category: null,
        account: null,
        accountTo: null,
        description: null
      }
    });

    for (let i = 0; i < 5; i++) {
      state.icons.push(chunkedIconList[i]);
    }

    function resetFormData(resetCloseAfterAdding?: boolean) {
      // Reset here
      if (resetCloseAfterAdding) {
        state.closeAfterAdding = false;
      }
    }

    function closeDialog() {
      resetFormData(true);
      state.panel = "newTransaction";
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
              amount: parseFloat(state.transaction.amount as string),
              accountFromId: state.transaction.account as number,
              accountToId: state.transaction.accountTo as number
            });
          } else {
            await getService<ITransactionService>(Types.TransactionService).create({
              amount: parseFloat(state.transaction.amount as string),
              accountId: state.transaction.account as number,
              categoryId: state.transaction.category as number,
              description: state.transaction.description as string,
              transactionType:
                parseFloat(state.transaction.amount as string) < 0
                  ? TransactionType.Expense
                  : TransactionType.Income
            });
            if (state.saveAsTemplate) {
              await getService<ITemplateService>(Types.TemplateService).create({
                amount: parseFloat(state.transaction.amount as string),
                accountId: state.transaction.account as number,
                categoryId: state.transaction.category as number,
                description: state.transaction.description as string,
                transactionType:
                  parseFloat(state.transaction.amount as string) < 0
                    ? TransactionType.Expense
                    : TransactionType.Income
              });
            }
          }

          emit("transaction-added");

          $q.notify({
            message: "Transaction added",
            color: "green",
            position: "top"
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
        } else {
          await getService<ICategoryService>(Types.CategoryService).createCategory({
            name: state.categoryName as string,
            icon: state.selectedIcon,
            color: state.selectedColor,
            parentId: state.newCategoryParent || undefined
          });

          emit("category-added");

          state.categoryName = null;
          state.selectedIcon = "mdi-plus";
          state.selectedColor = "#ff00ff";
          state.newCategoryParent = null;

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

    const onIconLoad = (index: number, done: () => void) => {
      setTimeout(() => {
        state.icons.push(chunkedIconList[index + 4]);
        done();
      }, 600);
    };

    return {
      state,
      closeDialog,
      createTransactionOrCategory,
      categories,
      accounts,
      formatBalance,
      setCategoryIcon,
      onIconLoad,
      scrollTargetRef
    };
  }
});
</script>

<style scoped lang="scss">
.bg-icon-list {
  background-color: #151414;
}
</style>
