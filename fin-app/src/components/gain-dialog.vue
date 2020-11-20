<template>
  <p-dialog
    @hide="hideDialog"
    :maximizable="true"
    :modal="true"
    v-model:visible="state.dialog"
    :style="{ width: '50vw' }"
  >
    <template #header>
      <h3>Unos novog dobitka</h3>
    </template>
    <vee-form>
      <div class="p-fluid p-grid p-formgrid p-mt-5 p-px-3">
        <div class="p-field p-col-12">
          <span class="p-float-label">
            <input-number
              locale="hr-HR"
              mode="currency"
              currency="HRK"
              id="amount"
              v-model="state.input.amount"
            />
            <label for="amount"
              ><icon class="p-pr-1" name="dollar" /> Iznos dobitka</label
            >
          </span>
        </div>
        <div class="p-field p-col-12">
          <span class="p-float-label">
            <text-area v-model="state.input.description" id="text-area" />
            <label for="text-area"
              ><icon class="p-pr-1" name="comments" /> Opis</label
            >
          </span>
        </div>
        <div class="p-field p-col-12">
          <group-box icon="id-card" title="Račun na koji ide dobitak">
            <select-button
              v-model="state.input.paymentSource"
              :options="paymentSources"
              optionLabel="text"
              optionValue="val"
            />
          </group-box>
        </div>
      </div>
    </vee-form>
    <template #footer>
      <btn
        @click="addExpense"
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
import { SelectItem } from "@/constants/select-item";
import { AmountHistoryService } from "@/services/api/amount-history-service";
import { GainItem } from "@/models/gain-item";

interface Props {
  dialog: boolean;
  input?: GainItem;
}

interface State {
  dialog: boolean;
  input?: GainItem;
  amountHistoryService: AmountHistoryService;
  // eslint-disable-next-line
  refresh: any;
}

export default defineComponent({
  name: "expense-dialog",
  props: {
    dialog: Boolean,
    input: null
  },
  setup(props: Props, context: SetupContext) {
    const state: State = reactive({
      amountHistoryService: new AmountHistoryService(),
      dialog: props.dialog,
      input: {
        paymentSource: PaymentSourceEnum.GyroAccount,
        description: "",
        amount: 0,
        date: new Date()
      },
      refresh: inject("refresh")
    });

    watch(
      () => props.dialog,
      (val) => (state.dialog = val)
    );

    watch(
      () => props.input,
      (val) => (state.input = val)
    );

    const paymentSources: Array<SelectItem<PaymentSourceEnum>> = [
      {
        text: "Žiro račun",
        val: PaymentSourceEnum.GyroAccount
      },
      {
        text: "Tekući račun",
        val: PaymentSourceEnum.CheckingAccount
      },
      {
        text: "Džep (novčanik)",
        val: PaymentSourceEnum.Pocket
      }
    ];

    function resetDialog() {
      state.dialog = false;
      state.input = {
        paymentSource: PaymentSourceEnum.GyroAccount,
        description: "",
        amount: 0,
        date: new Date()
      };
    }

    function refresh() {
      state.refresh.refresh();
    }

    async function addExpense() {
      const payload = {
        ...state.input
      } as GainItem;

      payload.date = new Date();
      const currentAmount = await state.amountHistoryService?.getCurrentAmount();

      state.amountHistoryService?.addHistory({
        euros: currentAmount.euros,
        gyro:
          state.input?.paymentSource == PaymentSourceEnum.GyroAccount
            ? ((currentAmount?.gyro + state.input.amount) as number)
            : currentAmount?.gyro,
        checking:
          state.input?.paymentSource == PaymentSourceEnum.CheckingAccount
            ? ((currentAmount?.checking + state.input.amount) as number)
            : currentAmount?.checking,
        pocket:
          state.input?.paymentSource == PaymentSourceEnum.Pocket
            ? ((currentAmount?.pocket + state.input.amount) as number)
            : currentAmount?.pocket,
        date: new Date()
      });

      state.amountHistoryService.addGain(payload);

      resetDialog();
      refresh();
    }

    function hideDialog() {
      resetDialog();
      context.emit("update:dialog", state.dialog);
    }

    return {
      state,
      addExpense,
      paymentSources,
      hideDialog
    };
  }
});
</script>

<style scoped>
</style>
