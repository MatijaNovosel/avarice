<template>
  <p-dialog
    @hide="hideDialog"
    :modal="true"
    v-model:visible="state.dialog"
    :style="{ width: '50vw' }"
  >
    <template #header>
      <span class="text-lg text-gray-400 font-bold">New transaction</span>
    </template>
    <div class="flex flex-col grid gap-4 mt-5">
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
      <text-area
        placeholder="Description"
        class="w-full"
        :class="{
          'p-invalid': model.description.$invalid
        }"
        v-model="model.description.$model"
        id="description"
      />
      <account-select v-model:selection="model.paymentSourceId.$model" />
      <div
        class="flex flex-col rounded-xl shadow-md border dark:border-0 border-gray-200 bg-white items-center"
      >
        <list-box
          :multiple="true"
          v-model="model.tagIds.$model"
          :options="tags"
          dataKey="val"
          listStyle="max-height: 250px"
          optionValue="val"
          optionLabel="text"
          class="w-full rounded-lg"
        >
          <template #option="slotProps">
            {{ slotProps.option.text }}
          </template>
        </list-box>
      </div>
      <span class="flex justify-center items-center">
        <span class="dark:text-gray-400 text-black"> Expense </span>
        <input-switch
          class="ml-4"
          id="expense"
          v-model="model.expense.$model"
        />
      </span>
    </div>
    <template #footer>
      <progress-spinner class="spinner" strokeWidth="10" v-if="state.saving" />
      <button
        v-ripple
        v-else
        :disabled="model.$invalid"
        @click="addTransaction"
        class="p-ripple shadow-md disabled:bg-gray-400 bg-green-400 hover:bg-green-500 dark:bg-green-600 dark:disabled:bg-gray-500 dark:hover:bg-green-700 rounded-md py-1 px-6"
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
import { TagEnum } from "../constants/tag-enum";
import { CreateFinancialChangeItemDto } from "../models/change-item";
import { required, numeric, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { getService, Types } from "../di-container";
import { ITransactionService } from "../services/interfaces/transaction-service";
import { IPaymentSourceService } from "@/services/interfaces/payment-source-service";
import { PaymentSource } from "@/models/payment-source";
import { createSelectFromEnum } from "@/helpers/helpers";
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
  name: "transaction-dialog",
  emits: ["update:dialog"],
  components: {
    AccountSelect
  },
  props: {
    dialog: Boolean
  },
  setup(props: Props, context: SetupContext) {
    const entry = reactive({
      appUserId: 1,
      paymentSourceId: 1,
      tagIds: [TagEnum.Food],
      description: null,
      amount: 0,
      expense: true
    } as CreateFinancialChangeItemDto);

    const rules = {
      amount: { required, numeric },
      paymentSourceId: { required },
      tagIds: { required },
      description: { required, minLength: minLength(4) },
      expense: { required }
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
      val => (state.dialog = val)
    );

    function resetDialog() {
      state.dialog = false;
      entry.amount = 0;
      entry.appUserId = 1;
      entry.description = null;
      entry.paymentSourceId = 1;
      entry.tagIds = [TagEnum.Other];
      entry.expense = true;
      model.value.$reset;
    }

    function hideDialog() {
      resetDialog();
      context.emit("update:dialog", state.dialog);
    }

    async function addTransaction() {
      // TODO: Anomalija kod spremanja, ako prelazi iz sekunde u new Date() u novu sekundu onda se ne sprema dobro!
      state.saving = true;

      const payload: CreateFinancialChangeItemDto = {
        ...entry
      };

      await getService<ITransactionService>(Types.ChangeService).addChange(
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

    const tags = createSelectFromEnum("tags", TagEnum);

    return {
      state,
      addTransaction,
      hideDialog,
      model,
      tags
    };
  }
});
</script>

<style scoped lang="sass">
.spinner
  width: 25px
  height: 25px
</style>
