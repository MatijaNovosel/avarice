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
          New transfer
        </span>
        <v-spacer />
        <v-btn @click="resetNewTransferDialog" small icon class="mr-3">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-card-text class="pb-0">
        <validation-observer ref="newTransferFormRef" v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(addNewTransfer)">
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
                  vid="accountFrom"
                  :name="$t('accountFrom')"
                  rules="required|differentFrom:@accountTo"
                  v-slot="{ errors, valid, untouched, required, failed }"
                >
                  <v-select
                    :error-messages="errors"
                    :hide-details="valid || (untouched && !failed)"
                    dense
                    item-text="description"
                    item-value="id"
                    :return-object="false"
                    :items="state.accounts"
                    v-model="state.accountFrom"
                    clearable
                    outlined
                  >
                    <template #label>
                      <required-icon v-show="required" />
                      <span>{{ $t("accountFrom") }}</span>
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
              <v-col cols="12">
                <validation-provider
                  vid="accountTo"
                  :name="$t('accountTo')"
                  rules="required|differentFrom:@accountFrom"
                  v-slot="{ errors, valid, untouched, required, failed }"
                >
                  <v-select
                    :error-messages="errors"
                    :hide-details="valid || (untouched && !failed)"
                    dense
                    item-text="description"
                    item-value="id"
                    :return-object="false"
                    :items="state.accounts"
                    v-model="state.accountTo"
                    clearable
                    outlined
                  >
                    <template #label>
                      <required-icon v-show="required" />
                      <span>{{ $t("accountTo") }}</span>
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
  SetupContext,
  watch
} from "@vue/composition-api";
import { getService, Types } from "@/di-container";
import { IAccountService } from "@/interfaces/accountService";
import { CreateTransferDto } from "@/models/transaction";
import { ITransactionService } from "@/interfaces/transactionService";
import { ValidationObserver } from "@/models/validationObserver";
import { formatCurrencyDisplay } from "@/helpers";
import { User } from "@/models/user";
import { Snackbar } from "@/models/appNotifications";
import { AccountLatestValueModel } from "@/apiClient/client";

interface State {
  amount: string | null;
  loading: boolean;
  open?: boolean;
  accountTo: number | null;
  accountFrom: number | null;
  accounts: AccountLatestValueModel[];
}

interface Props {
  value?: boolean;
}

export default defineComponent({
  name: "new-transfer-dialog",
  props: {
    value: null
  },
  setup(props: Props, context: SetupContext) {
    const vm = getCurrentInstance();

    const state: State = reactive({
      accounts: [],
      accountFrom: null,
      accountTo: null,
      amount: null,
      loading: false,
      open: false
    });

    function resetNewTransferDialog() {
      state.amount = null;
      state.accountFrom = null;
      state.accountTo = null;
      ((vm?.$refs.newTransferFormRef as any) as ValidationObserver).reset();
      state.open = false;
      context.emit("input", state.open);
      context.emit("close");
    }

    async function addNewTransfer() {
      state.loading = true;

      const payload: CreateTransferDto = {
        amount: parseFloat(state.amount as string),
        userId: (context.root.$store.getters["user/data"] as User).id,
        accountFromId: state.accountFrom as number,
        accountToId: state.accountTo as number
      };

      await getService<ITransactionService>(Types.TransactionService).transfer(
        payload
      );

      await context.root.$store.dispatch("app/showSnackbar", {
        color: "success",
        message: "Amount transferred successfully",
        timeout: 3000
      } as Snackbar);

      resetNewTransferDialog();
      await context.root.$store.dispatch("app/refresh");
      state.loading = false;
    }

    async function getAccounts() {
      state.accounts = await getService<IAccountService>(
        Types.AccountService
      ).getLatestValues((context.root.$store.getters["user/data"] as User).id);
    }

    onMounted(() => {
      getAccounts();
    });

    watch(
      () => context.root.$store.getters["app/refreshTrigger"] as boolean,
      () => {
        getAccounts();
      }
    );

    watch(
      () => props.value,
      val => (state.open = val)
    );

    return {
      state,
      resetNewTransferDialog,
      addNewTransfer,
      formatCurrencyDisplay
    };
  }
});
</script>
