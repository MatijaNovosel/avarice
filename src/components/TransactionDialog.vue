<template>
  <q-dialog v-model="appStore.transactionDialogOpen" persistent>
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
                    color="accent"
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
                      :options="userStore.categories"
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
                      <template #after>
                        <q-btn
                          @click="state.panel = 'newCategory'"
                          size="xs"
                          flat
                          dense
                          class="bg-accent rounded q-ml-sm"
                        >
                          <q-icon class="q-pa-xs" name="mdi-plus" color="black" size="xs" />
                        </q-btn>
                      </template>
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
                    <q-checkbox
                      v-model="state.saveAsTemplate"
                      label="Save as a template after creating"
                    />
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
                      :options="userStore.categories"
                      option-value="id"
                      option-label="name"
                      label="Parent category"
                      clearable
                      emit-value
                      map-options
                    >
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
                    <q-input
                      placeholder="Search icons"
                      dense
                      filled
                      clearable
                      @update:model-value="searchIcons"
                      v-model="state.iconSearchText"
                    >
                      <template #append>
                        <q-icon size="xs" name="mdi-magnify" />
                      </template>
                    </q-input>
                    <q-list
                      ref="scrollTargetRef"
                      class="scroll bg-icon-list q-pt-md rounded"
                      style="max-height: 250px"
                      :class="{
                        'q-pb-md': categoryInfiniteLoadDisabled
                      }"
                    >
                      <q-infinite-scroll
                        @load="onIconLoad"
                        :disable="categoryInfiniteLoadDisabled"
                        :offset="50"
                        v-if="state.icons.length !== 0"
                      >
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
                      <q-item v-else>
                        <q-item-section>
                          <q-item-label> No icons found. </q-item-label>
                          <q-item-label caption class="text-grey-7">
                            Try searching with other parameters.
                          </q-item-label>
                        </q-item-section>
                      </q-item>
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
import { reactive, computed, ref } from "vue";
import { useQuasar, debounce } from "quasar";
import { chunkArray, formatBalance, collectErrors } from "src/utils/helpers";
import { getService, Types } from "src/di-container";
import ITransactionService from "src/api/interfaces/transactionService";
import ICategoryService from "src/api/interfaces/categoryService";
import RequiredIcon from "src/components/RequiredIcon.vue";
import ITemplateService from "src/api/interfaces/templateService";
import iconList from "../utils/icons";
import { useUserStore } from "src/stores/user";
import { required, numeric, requiredIf } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import IAccountService from "src/api/interfaces/accountService";
import { useAppStore } from "src/stores/app";

interface State {
  loading: boolean;
  closeAfterAdding: boolean;
  panel: string;
  selectedIcon: string;
  iconSearchText: string | null;
  selectedColor: string;
  isTransfer: boolean;
  saveAsTemplate: boolean;
  transaction: {
    amount: string | null;
    category: number | null;
    account: number | null;
    accountTo: number | null;
    description: string | null;
  };
  categoryName: string | null;
  newCategoryParent: number | null;
  icons: string[][];
  filteredIcons: string[][];
  tempIcons: string[][];
}

const $q = useQuasar();

const userStore = useUserStore();
const appStore = useAppStore();

const scrollTargetRef = ref<HTMLElement | null>(null);
const chunkedIconList = chunkArray<string>(iconList, 10);

const accounts = computed(() => userStore.accounts);

const state = reactive<State>({
  loading: false,
  tempIcons: [],
  newCategoryParent: null,
  iconSearchText: null,
  closeAfterAdding: false,
  selectedColor: "#ff00ff",
  panel: "newTransaction",
  selectedIcon: "mdi-plus",
  categoryName: null,
  isTransfer: false,
  saveAsTemplate: false,
  icons: [],
  filteredIcons: [],
  transaction: {
    amount: "0",
    category: null,
    account: null,
    accountTo: null,
    description: null
  }
});

const rules = {
  amount: { required, numeric, $autoDirty: true },
  category: { requiredIf: requiredIf(!state.isTransfer), $autoDirty: true },
  account: { required, $autoDirty: true },
  accountTo: { requiredIf: requiredIf(state.isTransfer), $autoDirty: true },
  description: { required, $autoDirty: true }
};

const $v = useVuelidate(rules, state.transaction);

for (let i = 0; i < 5; i++) {
  state.icons.push(chunkedIconList[i]);
}

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
  state.panel = "newTransaction";
  state.icons = [];
  state.tempIcons = [];
  appStore.toggleTransactionDialog();
};

const setCategoryIcon = (name: string) => {
  state.selectedIcon = name;
};

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

      appStore.notifyTransactionCreated();
      const accounts = await getService<IAccountService>(Types.AccountService).getLatestValues();
      userStore.setAccounts(accounts);
      userStore.setSelectedAccount(accounts[0]);

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
    } else {
      await getService<ICategoryService>(Types.CategoryService).createCategory({
        name: state.categoryName as string,
        icon: state.selectedIcon,
        color: state.selectedColor,
        parentId: state.newCategoryParent || undefined
      });

      const categories = await getService<ICategoryService>(
        Types.CategoryService
      ).getUserCategories();
      userStore.setCategories(categories);

      state.categoryName = null;
      state.selectedIcon = "mdi-plus";
      state.selectedColor = "#ff00ff";
      state.newCategoryParent = null;

      $q.notify({
        message: "Category added",
        color: "dark",
        position: "bottom",
        textColor: "green"
      });
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

const searchIcons = debounce(() => {
  if (state.iconSearchText !== "" && state.iconSearchText !== null) {
    // TODO: Memorize initial icons before first actual search
    state.tempIcons = [...state.icons];
    state.icons = chunkArray<string>(
      iconList.filter((icon) =>
        icon.toLowerCase().includes(state.iconSearchText?.toLowerCase() as string)
      ),
      10
    );
  } else {
    state.icons = [...state.tempIcons];
  }
}, 750);

const onIconLoad = (index: number, done: () => void) => {
  setTimeout(() => {
    state.icons.push(chunkedIconList[index + 4]);
    done();
  }, 600);
};

const categoryInfiniteLoadDisabled = computed(
  () => state.iconSearchText !== "" && state.iconSearchText !== null
);
</script>

<style scoped lang="scss">
.bg-icon-list {
  background-color: #151414;
}
</style>
