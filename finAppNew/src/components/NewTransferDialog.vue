<template>
  <header-dialog
    max-width="50%"
    v-model="state.open"
    :disabled="state.loading"
    :title="$t('newTransfer')"
    @close="resetNewTransferDialog"
  >
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
                :items="state.paymentSources"
                v-model="state.accountFrom"
                clearable
                outlined
              >
                <template #label>
                  <required-icon v-show="required" />
                  <span>{{ $t("accountFrom") }}</span>
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
                :items="state.paymentSources"
                v-model="state.accountTo"
                clearable
                outlined
              >
                <template #label>
                  <required-icon v-show="required" />
                  <span>{{ $t("accountTo") }}</span>
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
import { getService, Types } from "@/di-container";
import { IPaymentSourceService } from "@/interfaces/paymentSourceService";
import { PaymentSource } from "@/models/payment-source";
import { CreateTransferDto } from "@/models/change-item";
import { ITransactionService } from "@/interfaces/transactionService";
import { ValidationObserver } from "@/models/validationObserver";

interface State {
  amount: string | null;
  loading: boolean;
  open?: boolean;
  accountTo: number | null;
  accountFrom: number | null;
  paymentSources: PaymentSource[];
}

interface Props {
  value?: boolean;
}

export default defineComponent({
  name: "new-transfer-dialog",
  props: {
    value: null
  },
  components: {
    HeaderDialog
  },
  setup(props: Props, context: SetupContext) {
    const vm = getCurrentInstance();

    const state: State = reactive({
      paymentSources: [],
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
        appUserId: 1,
        accountFromId: state.accountFrom as number,
        accountToId: state.accountTo as number
      };

      await getService<ITransactionService>(Types.ChangeService).transfer(
        payload
      );

      resetNewTransferDialog();
      await context.root.$store.dispatch("app/refresh");
      state.loading = false;
    }

    onMounted(async () => {
      state.paymentSources = await getService<IPaymentSourceService>(
        Types.PaymentSourceService
      ).getAllByUserId(1);
    });

    watch(
      () => props.value,
      val => (state.open = val)
    );

    return {
      state,
      resetNewTransferDialog,
      addNewTransfer
    };
  }
});
</script>
