<template>
  <header-dialog
    max-width="50%"
    :disabled="state.loading"
    v-model="state.open"
    :title="$t('newTransaction')"
    @close="resetNewTransactionDialog"
  >
    <validation-observer ref="newTransactionFormRef" v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(addNewTransaction)">
        <v-row class="mt-1">
          <v-col cols="12">
            <validation-provider
              vid="amount"
              :name="$t('amount')"
              rules="required|numberWithComma"
              v-slot="{ errors, valid, untouched, required, failed }"
            >
              <v-text-field
                outlined
                :error-messages="errors"
                :hide-details="valid || (untouched && !failed)"
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
              v-slot="{ errors, valid, untouched, required, failed }"
            >
              <v-textarea
                outlined
                :error-messages="errors"
                :hide-details="valid || (untouched && !failed)"
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
              v-slot="{ errors, valid, untouched, required, failed }"
            >
              <v-select
                :error-messages="errors"
                :hide-details="valid || (untouched && !failed)"
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
              v-slot="{ errors, valid, untouched, required, failed }"
            >
              <v-select
                :loading="state.loading"
                :disabled="state.loading"
                :error-messages="errors"
                :hide-details="valid || (untouched && !failed)"
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
                        {{ formatCurrencyDisplay(true, item.amount, "HRK") }}
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
                        {{ formatCurrencyDisplay(true, item.amount, "HRK") }}
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
  </header-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive,
  SetupContext,
  watch
} from "@vue/composition-api";
import HeaderDialog from "@/components/HeaderDialog.vue";
import { Tag } from "@/models/tag";
import { getService, Types } from "@/di-container";
import { ITagService } from "@/interfaces/tagService";
import { IPaymentSourceService } from "@/interfaces/paymentSourceService";
import { AccountLatestValue } from "@/models/payment-source";
import { format } from "date-fns";
import { CreateFinancialChangeItemDto } from "@/models/change-item";
import { ITransactionService } from "@/interfaces/transactionService";
import { ValidationObserver } from "@/models/validationObserver";
import { formatCurrencyDisplay } from "@/helpers";
import { AppUser } from "@/models/user";
import { Snackbar } from "@/models/appNotifications";

interface State {
  amount: string | null;
  description: string | null;
  loading: boolean;
  open?: boolean;
  tags: Tag[];
  tagIds: number[] | null;
  account: number | null;
  withdrawal: boolean;
  accounts: AccountLatestValue[];
}

interface Props {
  value?: boolean;
}

export default defineComponent({
  name: "new-transaction-dialog",
  props: {
    value: null
  },
  components: {
    HeaderDialog
  },
  setup(props: Props, context: SetupContext) {
    const vm = getCurrentInstance();

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
      ((vm?.$refs.newTransactionFormRef as any) as ValidationObserver).reset();
      state.open = false;
      context.emit("input", state.open);
      context.emit("close");
    }

    async function addNewTransaction() {
      state.loading = true;

      const payload: CreateFinancialChangeItemDto = {
        amount: parseFloat(state.amount as string),
        appUserId: 1,
        description: state.description,
        expense: state.withdrawal,
        paymentSourceId: state.account as number,
        tagIds: state.tagIds as number[],
        createdAt: format(new Date(), "dd.MM.yyyy. HH:mm:ss")
      };

      await getService<ITransactionService>(Types.TransactionService).addChange(
        payload
      );

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
      state.accounts = await getService<IPaymentSourceService>(
        Types.PaymentSourceService
      ).getLatestValues(
        (context.root.$store.getters["user/data"] as AppUser).id as number
      );
      state.tags = await getService<ITagService>(Types.TagService).getTags(
        (context.root.$store.getters["user/data"] as AppUser).id as number
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
      formatCurrencyDisplay
    };
  }
});
</script>
