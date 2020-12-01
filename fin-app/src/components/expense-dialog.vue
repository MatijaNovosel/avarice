<template>
  <p-dialog
    @hide="hideDialog"
    :maximizable="true"
    :modal="true"
    v-model:visible="state.dialog"
    :style="{ width: '50vw' }"
  >
    <template #header>
      <h3>Unos novog troška</h3>
    </template>
    <div class="p-fluid p-grid p-formgrid p-mt-5 p-px-3 p-input-filled">
      <div class="p-field p-col-12">
        <span class="p-float-label p-mb-1">
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
          />
          <label for="amount"
            ><icon class="p-pr-1" name="dollar" /> Iznos troška</label
          >
        </span>
        <span class="p-invalid" v-if="model.amount.required.$invalid">{{
          model.amount.required.$message
        }}</span>
      </div>
      <div class="p-field p-col-12">
        <span class="p-float-label">
          <text-area
            :class="{
              'p-invalid': model.description.$invalid
            }"
            v-model="model.description.$model"
            id="description"
          />
          <label for="description"
            ><icon class="p-pr-1" name="comments" /> Opis</label
          >
        </span>
        <span class="p-invalid" v-if="model.description.required.$invalid">{{
          model.description.required.$message
        }}</span>
      </div>
      <div class="p-field p-col-12">
        <group-box icon="id-card" title="Izvor plaćanja">
          <select-button
            v-model="entry.paymentSource"
            :options="paymentSources"
            optionLabel="text"
            optionValue="val"
          />
        </group-box>
      </div>
      <div class="p-field p-col-12">
        <group-box icon="tag" title="Kategorija">
          <list-box
            :multiple="false"
            :filter="true"
            v-model="entry.category"
            :options="categories"
            dataKey="val"
            listStyle="max-height: 250px"
            optionValue="val"
            optionLabel="text"
          >
            <template #option="slotProps">
              {{ slotProps.option.text }}
            </template>
          </list-box>
        </group-box>
      </div>
    </div>
    <template #footer>
      <btn
        @click="addExpense"
        :disabled="model.$invalid"
        label="Spremi"
        icon="pi pi-save"
        class="p-button-raised p-button-success"
      />
    </template>
  </p-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, SetupContext, watch, inject } from "vue";
import { PaymentSourceEnum } from "@/constants/payment-source-enum";
import { CategoryEnum } from "@/constants/category-enum";
import { AmountHistoryService } from "@/services/api/amount-history-service";
import { ChangeItem } from "@/models/change-item";
import { createSelectFromEnum } from "@/helpers/helpers";
import { required, numeric } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

interface Props {
  dialog: boolean;
  input?: ChangeItem;
}

interface State {
  dialog: boolean;
  amountHistoryService: AmountHistoryService;
  // eslint-disable-next-line
  refresh: any;
}

export default defineComponent({
  name: "expense-dialog",
  emits: ["update:dialog"],
  props: {
    dialog: Boolean,
    input: null
  },
  setup(props: Props, context: SetupContext) {
    const entry = reactive({
      paymentSource: PaymentSourceEnum.GyroAccount,
      category: CategoryEnum.Food,
      description: "",
      amount: 0,
      date: new Date(),
      expense: true
    } as ChangeItem);

    const rules = {
      amount: { required, numeric },
      paymentSource: { required },
      category: { required },
      description: { required }
    };

    const model = useVuelidate(rules, entry);

    const state: State = reactive({
      amountHistoryService: new AmountHistoryService(),
      dialog: props.dialog,
      refresh: inject("refresh")
    });

    watch(
      () => props.dialog,
      (val) => (state.dialog = val)
    );

    const paymentSources = createSelectFromEnum(
      PaymentSourceEnum,
      "paymentSource"
    );
    const categories = createSelectFromEnum(CategoryEnum, "category");

    function resetDialog() {
      state.dialog = false;
      entry.amount = 0;
      entry.description = "";
      entry.paymentSource = PaymentSourceEnum.GyroAccount;
      entry.category = CategoryEnum.Other;
      model.value.$reset;
    }

    async function addExpense() {
      const payload = {
        ...entry
      } as ChangeItem;

      payload.date = new Date();

      const currentAmount = await state.amountHistoryService.getCurrentAmount();

      state.amountHistoryService.addHistory({
        euros: currentAmount.euros,
        gyro:
          entry.paymentSource == PaymentSourceEnum.GyroAccount
            ? ((currentAmount?.gyro - entry.amount) as number)
            : currentAmount?.gyro,
        checking:
          entry.paymentSource == PaymentSourceEnum.CheckingAccount
            ? ((currentAmount?.checking - entry.amount) as number)
            : currentAmount?.checking,
        pocket:
          entry.paymentSource == PaymentSourceEnum.Pocket
            ? ((currentAmount?.pocket - entry.amount) as number)
            : currentAmount?.pocket,
        date: new Date()
      });

      state.amountHistoryService.addChange(payload);

      resetDialog();
      state.refresh.refresh();
    }

    function hideDialog() {
      resetDialog();
      context.emit("update:dialog", state.dialog);
    }

    return {
      state,
      addExpense,
      categories,
      paymentSources,
      hideDialog,
      model,
      entry
    };
  }
});
</script>

<style scoped>
</style>
