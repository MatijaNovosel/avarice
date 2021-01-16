<template>
  <p-dialog
    @hide="hideDialog"
    :maximizable="true"
    :modal="true"
    v-model:visible="state.dialog"
    :style="{ width: '50vw' }"
  >
    <template #header>
      <h3>New transaction</h3>
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
      <span class="p-float-label">
        <text-area
          class="w-full"
          :class="{
            'p-invalid': model.description.$invalid
          }"
          v-model="model.description.$model"
          id="description"
        />
        <label class="text-gray-400" for="description"> Description </label>
      </span>
      <div class="flex justify-center items-center gap-4 grid grid-cols-2 pb-3">
        <template
          v-for="paymentSource in state.paymentSources"
          :key="paymentSource.id"
        >
          <div
            class="flex px-5 py-3 bg-white rounded-lg border border-gray-200 shadow-md cursor-pointer"
          >
            <div
              class="w-full flex items-center content-between justify-between"
            >
              <div class="flex items-center">
                <mdi-icon
                  :size="28"
                  color="#acb0bf"
                  :name="paymentSource.icon"
                />
                <div class="flex flex-col ml-5">
                  <span class="text-lg text-gray-400 font-bold">{{
                    paymentSource.description
                  }}</span>
                </div>
              </div>
              <radio-button
                name="category"
                :value="paymentSource.id"
                v-model="model.paymentSourceId.$model"
              />
            </div>
          </div>
        </template>
      </div>
      <div
        class="flex flex-col rounded-lg shadow-md border border-gray-200 bg-white items-center"
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
      <span class="p-invalid" v-if="model.tagIds.$invalid">{{
        model.tags.$errors.map((x) => x.$message).join(" • ")
      }}</span>
      <span class="flex justify-center items-center">
        <span class="text-black"> Expense </span>
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
        v-else
        :disabled="model.$invalid"
        @click="addTransaction"
        class="disabled:bg-gray-400 bg-green-400 hover:bg-green-500 rounded-md py-1 px-6"
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
import { PaymentSourceEnum } from "../constants/payment-source-enum";
import { TagEnum } from "../constants/tag-enum";
import { CreateFinancialChangeItemDto } from "../models/change-item";
import { createSelectFromEnum } from "../helpers/helpers";
import { required, numeric, minLength } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { getService, Types } from "../di-container";
import { IChangeService } from "../services/interfaces/change-service";
import { IPaymentSourceService } from "@/services/interfaces/payment-source-service";
import MdiIcon from "../components/mdi-icon.vue";
import { PaymentSource } from "@/models/payment-source";

interface Props {
  dialog: boolean;
}

interface State {
  dialog: boolean;
  // eslint-disable-next-line
  refresh: any;
  saving: boolean;
  paymentSources: PaymentSource[];
}

export default defineComponent({
  name: "financial-change-dialog",
  emits: ["update:dialog"],
  components: {
    MdiIcon
  },
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
      saving: false,
      paymentSources: []
    });

    watch(
      () => props.dialog,
      (val) => (state.dialog = val)
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

    async function addTransaction() {
      state.saving = true;

      const payload: CreateFinancialChangeItemDto = {
        ...entry
      };

      await getService<IChangeService>(Types.ChangeService).addChange(payload);

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
      tags,
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
