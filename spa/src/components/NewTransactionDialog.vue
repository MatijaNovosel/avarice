<template>
  <v-dialog
    persistent
    v-model="state.open"
    max-width="50%"
    :fullscreen="$vuetify.breakpoint.xs"
  >
    <v-card>
      <v-card-title>
        <span
          class="text-overline"
          :style="{
            'font-size':
              $vuetify.breakpoint.xs || $vuetify.breakpoint.sm ? '15px' : '20px'
          }"
        >
          New transaction
        </span>
        <v-spacer />
        <v-btn @click="resetNewTransactionDialog" small icon class="mr-3">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-card-text class="pb-0">
        <validation-observer ref="newTransactionForm" v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(addNewTransaction)">
            <v-row class="mt-1">
              <v-col cols="12">
                <validation-provider
                  vid="amount"
                  :name="$t('amount')"
                  rules="required|numberWithComma"
                  v-slot="{ errors, required }"
                >
                  <v-text-field
                    outlined
                    :error-messages="errors"
                    hide-details="auto"
                    dense
                    v-model="state.amount"
                    clearable
                    suffix="HRK"
                  >
                    <template #label>
                      <required-icon v-show="required" />
                      <span>{{ $t("amount") }}</span>
                    </template>
                  </v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider
                  vid="description"
                  :name="$t('description')"
                  rules="required|min:4"
                  v-slot="{ errors, required }"
                >
                  <v-textarea
                    outlined
                    :error-messages="errors"
                    hide-details="auto"
                    dense
                    v-model="state.description"
                    clearable
                  >
                    <template #label>
                      <required-icon v-show="required" />
                      <span>{{ $t("description") }}</span>
                    </template>
                  </v-textarea>
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider
                  vid="tags"
                  :name="$t('tags')"
                  rules="required"
                  v-slot="{ errors, required }"
                >
                  <v-select
                    :error-messages="errors"
                    hide-details="auto"
                    dense
                    item-text="description"
                    item-value="id"
                    :return-object="false"
                    :items="state.tags"
                    v-model="state.tagIds"
                    clearable
                    multiple
                    outlined
                  >
                    <template #label>
                      <required-icon v-show="required" />
                      <span>{{ $t("tags") }}</span>
                    </template>
                  </v-select>
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider
                  vid="account"
                  :name="$t('account')"
                  rules="required"
                  v-slot="{ errors, required }"
                >
                  <v-select
                    :loading="state.loading"
                    :disabled="state.loading"
                    :error-messages="errors"
                    hide-details="auto"
                    dense
                    item-text="description"
                    item-value="id"
                    :return-object="false"
                    :items="state.accounts"
                    v-model="state.account"
                    clearable
                    outlined
                  >
                    <template #label>
                      <required-icon v-show="required" />
                      <span>{{ $t("account") }}</span>
                    </template>
                    <template #item="{ item, on, attrs }">
                      <v-list-item two-line v-on="on" v-bind="attrs">
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ item.description }}
                          </v-list-item-title>
                          <v-list-item-subtitle class="pt-1">
                            {{
                              formatCurrencyDisplay(true, item.amount, "HRK")
                            }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                    <template #selection="{ item }">
                      <v-list-item two-line>
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ item.description }}
                          </v-list-item-title>
                          <v-list-item-subtitle class="pt-1">
                            {{
                              formatCurrencyDisplay(true, item.amount, "HRK")
                            }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-select>
                </validation-provider>
              </v-col>
              <v-col cols="12" class="py-0">
                <v-switch
                  dense
                  v-model="state.withdrawal"
                  color="error"
                  inset
                  :label="$t('withdrawal')"
                />
              </v-col>
              <v-col cols="12" class="text-center text-md-right mt-2">
                <v-btn
                  :loading="state.loading"
                  :disabled="state.loading"
                  small
                  type="submit"
                  color="success"
                >
                  {{ $t("save") }}
                </v-btn>
              </v-col>
            </v-row>
          </form>
        </validation-observer>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  SetupContext,
  watch
} from "@vue/composition-api";
import { getService, Types } from "@/di-container";
import { ITagService } from "@/interfaces/tagService";
import { IAccountService } from "@/interfaces/accountService";
import { format } from "date-fns";
import { AddTransactionDto } from "@/models/transaction";
import { ITransactionService } from "@/interfaces/transactionService";
import { IValidationObserver } from "@/models/validationObserver";
import { formatCurrencyDisplay } from "@/helpers";
import { User } from "@/models/user";
import { Snackbar } from "@/models/appNotifications";
import { AccountLatestValueModel, TagModel } from "@/apiClient/client";

interface State {
  amount: string | null;
  description: string | null;
  loading: boolean;
  open?: boolean;
  tags: TagModel[];
  tagIds: number[] | null;
  account: number | null;
  withdrawal: boolean;
  accounts: AccountLatestValueModel[];
}

interface Props {
  value?: boolean;
}

export default defineComponent({
  name: "new-transaction-dialog",
  props: {
    value: null
  },
  setup(props: Props, context: SetupContext) {
    const vm = getCurrentInstance();
    const newTransactionForm = ref<IValidationObserver>();

    const state: State = reactive({
      tagIds: [],
      account: null,
      accounts: [],
      amount: null,
      description: null,
      loading: false,
      open: false,
      tags: [],
      withdrawal: true
    });

    function resetNewTransactionDialog() {
      state.amount = null;
      state.description = null;
      state.tagIds = null;
      state.account = null;
      state.withdrawal = true;
      newTransactionForm.value?.reset();
      state.open = false;
      context.emit("input", state.open);
      context.emit("close");
    }

    async function addNewTransaction() {
      state.loading = true;

      const payload: AddTransactionDto = {
        amount: parseFloat(state.amount as string),
        userId: (context.root.$store.getters["user/data"] as User).id,
        description: state.description,
        expense: state.withdrawal,
        accountId: state.account as number,
        tagIds: state.tagIds as number[],
        createdAt: format(new Date(), "dd.MM.yyyy. HH:mm:ss")
      };

      await getService<ITransactionService>(
        Types.TransactionService
      ).addTransaction(payload);

      await context.root.$store.dispatch("app/showSnackbar", {
        color: "success",
        message: "Added new transaction",
        timeout: 3000
      } as Snackbar);

      resetNewTransactionDialog();
      await context.root.$store.dispatch("app/refresh");
      state.loading = false;
    }

    async function getData() {
      state.loading = true;
      state.accounts = await getService<IAccountService>(
        Types.AccountService
      ).getLatestValues((context.root.$store.getters["user/data"] as User).id);
      state.tags = await getService<ITagService>(Types.TagService).getTags(
        (context.root.$store.getters["user/data"] as User).id
      );
      state.loading = false;
    }

    onMounted(() => {
      getData();
    });

    watch(
      () => context.root.$store.getters["app/refreshTrigger"] as boolean,
      () => {
        getData();
      }
    );

    watch(
      () => props.value,
      val => (state.open = val)
    );

    return {
      state,
      resetNewTransactionDialog,
      addNewTransaction,
      formatCurrencyDisplay,
      newTransactionForm
    };
  }
});
</script>
