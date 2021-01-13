<template>
  <p-dialog
    @hide="hideDialog"
    :maximizable="true"
    :modal="true"
    v-model:visible="state.dialog"
    :style="{ width: '50vw' }"
  >
    <template #header>
      <h3>New financial change</h3>
    </template>
    <div class="flex flex-col grid gap-4 py-5">
      <span class="p-float-label">
        <input-number
          filled
          locale="hr-HR"
          mode="currency"
          currency="HRK"
          id="amount"
          :class="{
            'p-invalid': model.amount.$invalid
          }"
          v-model="model.amount.$model"
          class="expense-input"
        />
        <label for="amount"> Amount </label>
      </span>
      <span class="p-invalid" v-if="model.amount.$invalid">{{
        model.amount.$errors.map((x) => x.$message).join(" • ")
      }}</span>
      <span class="p-float-label p-mt-3">
        <text-area
          :class="{
            'p-invalid': model.description.$invalid
          }"
          v-model="model.description.$model"
          id="description"
          class="expense-input"
        />
        <label for="description"> Description </label>
      </span>
      <span class="p-invalid" v-if="model.description.$invalid">{{
        model.description.$errors.map((x) => x.$message).join(" • ")
      }}</span>
      <div class="flex flex-col p-4 rounded-xl bg-gray-900">
        <span class="mb-3">Payment source</span>
        <select-button
          v-model="model.paymentSourceId.$model"
          :options="paymentSources"
          optionLabel="text"
          optionValue="val"
        />
      </div>
      <div class="flex flex-col p-4 rounded-xl bg-gray-900">
        <span class="mb-3">Tags</span>
        <list-box
          :multiple="true"
          v-model="model.tagIds.$model"
          :options="tags"
          dataKey="val"
          listStyle="max-height: 250px"
          optionValue="val"
          optionLabel="text"
        >
          <template #option="slotProps">
            {{ slotProps.option.text }}
          </template>
        </list-box>
      </div>
      <span class="p-invalid" v-if="model.tagIds.$invalid">{{
        model.tags.$errors.map((x) => x.$message).join(" • ")
      }}</span>
      <span class="flex justify-center items-center">
        <span class="text-white"> Expense </span>
        <input-switch class="ml-4" id="expense" v-model="model.expense.$model" />
      </span>
    </div>
    <template #footer>
      <progress-spinner class="spinner" strokeWidth="10" v-if="state.saving" />
      <btn
        v-else
        @click="addFinancialChange"
        :disabled="model.$invalid"
        label="Spremi"
        icon="pi pi-save"
        class="p-button-raised p-button-success"
      />
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
  Ref
} from "vue";
import { PaymentSourceEnum } from "../constants/payment-source-enum";
import { TagEnum } from "../constants/tag-enum";
import { CreateFinancialChangeItemDto } from "../models/change-item";
import { createSelectFromEnum } from "../helpers/helpers";
import { required, numeric, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { getService, Types } from "../di-container";
import { IChangeService } from "../services/interfaces/change-service";

interface Props {
  dialog: boolean;
}

interface State {
  dialog: boolean;
  // eslint-disable-next-line
  refresh: any;
  saving: boolean;
}

export default defineComponent({
  name: "financial-change-dialog",
  emits: ["update:dialog"],
  props: {
    dialog: Boolean
  },
  setup(props: Props, context: SetupContext) {
    const entry = reactive({
      appUserId: 1,
      paymentSourceId: PaymentSourceEnum.GyroAccount,
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
      refresh: inject("refresh"),
      saving: false
    });

    watch(
      () => props.dialog,
      (val) => (state.dialog = val)
    );

    const paymentSources = createSelectFromEnum(
      PaymentSourceEnum,
      "paymentSource"
    );
    const tags = createSelectFromEnum(TagEnum, "tag");

    function resetDialog() {
      state.dialog = false;
      entry.amount = 0;
      entry.appUserId = 1;
      entry.description = null;
      entry.paymentSourceId = PaymentSourceEnum.GyroAccount;
      entry.tagIds = [TagEnum.Other];
      entry.expense = true;
      model.value.$reset;
    }

    function hideDialog() {
      resetDialog();
      context.emit("update:dialog", state.dialog);
    }

    async function addFinancialChange() {
      state.saving = true;

      const payload: CreateFinancialChangeItemDto = {
        ...entry
      };

      await getService<IChangeService>(Types.ChangeService).addChange(payload);

      hideDialog();
      state.saving = false;
      state.refresh.refresh();
    }

    return {
      state,
      addFinancialChange,
      tags,
      paymentSources,
      hideDialog,
      model,
      entry
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
