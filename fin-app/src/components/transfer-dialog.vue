<template>
  <p-dialog
    @hide="hideDialog"
    :modal="true"
    v-model:visible="state.dialog"
    :style="{ width: '50vw' }"
  >
    <template #header>
      <span class="text-lg text-gray-400 font-bold">New transfer</span>
    </template>
    <div class="flex flex-col grid gap-4 mt-5">
      <span class="p-float-label">
        <input-number
          locale="hr-HR"
          mode="currency"
          currency="HRK"
          id="amount"
          :class="{
            'p-invalid': model.amount.$invalid
          }"
          v-model="model.amount.$model"
          class="w-full"
        />
        <label class="text-gray-400" for="amount"> Amount </label>
      </span>
      <span class="text-lg text-gray-500">Account from</span>
      <account-select v-model:selection="model.accountFromId.$model" />
      <span class="text-lg text-gray-500">Account to</span>
      <account-select v-model:selection="model.accountToId.$model" />
    </div>
    <template #footer>
      <progress-spinner class="spinner" strokeWidth="10" v-if="state.saving" />
      <button
        v-ripple
        v-else
        :disabled="model.$invalid"
        @click="addTransaction"
        class="p-ripple shadow-md disabled:bg-gray-400 bg-green-400 hover:bg-green-500 rounded-md py-1 px-6"
      >
        Save
      </button>
    </template>
  </p-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  SetupContext,
  watch,
  inject,
  Ref,
  onMounted
} from "vue";
import { CreateTransferDto } from "../models/change-item";
import { required, numeric } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { getService, Types } from "../di-container";
import { ITransactionService } from "../services/interfaces/transaction-service";
import { IPaymentSourceService } from "@/services/interfaces/payment-source-service";
import { PaymentSource } from "@/models/payment-source";
import { RefreshController } from "@/helpers/refresh";
import AccountSelect from "./account-select.vue";

interface Props {
  dialog: boolean;
}

interface State {
  dialog: boolean;
  refresh: RefreshController;
  saving: boolean;
  paymentSources: PaymentSource[];
}

export default defineComponent({
  name: "transfer-dialog",
  emits: ["update:dialog"],
  components: {
    AccountSelect
  },
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  },
  setup(props: Props, context: SetupContext) {
    const entry = reactive({
      appUserId: 1,
      accountFromId: 1,
      accountToId: 2,
      amount: 0
    } as CreateTransferDto);

    const rules = {
      amount: { required, numeric },
      accountFromId: { required },
      accountToId: { required }
    };

    // eslint-disable-next-line
    const model: Ref<any> = useVuelidate(rules, entry);

    const state: State = reactive({
      dialog: props.dialog,
      refresh: inject("refresh") as RefreshController,
      saving: false,
      paymentSources: []
    });

    watch(
      () => props.dialog,
      (val) => (state.dialog = val)
    );

    function resetDialog() {
      state.dialog = false;
      entry.amount = 0;
      entry.appUserId = 1;
      entry.accountFromId = 1;
      entry.accountToId = 2;
      model.value.$reset;
    }

    function hideDialog() {
      resetDialog();
      context.emit("update:dialog", state.dialog);
    }

    async function addTransaction() {
      state.saving = true;

      const payload: CreateTransferDto = {
        ...entry
      };

      await getService<ITransactionService>(Types.ChangeService).transfer(
        payload
      );

      hideDialog();
      state.saving = false;
      state.refresh.refresh();
    }

    onMounted(async () => {
      state.paymentSources = await getService<IPaymentSourceService>(
        Types.PaymentSourceService
      ).getAllByUserId(1);
    });

    return {
      state,
      addTransaction,
      hideDialog,
      model
    };
  }
});
</script>

<style scoped lang="sass">
.expense-input
  width: 100%

.spinner
  width: 25px
  height: 25px
</style>
