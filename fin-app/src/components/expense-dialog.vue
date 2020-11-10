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
              ><icon class="p-pr-1" name="dollar" /> Iznos troška</label
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
          <group-box icon="id-card" title="Izvor plaćanja">
            <select-button
              v-model="state.input.paymentSource"
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
              v-model="state.input.category"
              :options="categories"
              dataKey="val"
              listStyle="max-height: 250px"
              optionValue="val"
              optionLabel="text"
            >
              <template #option="slotProps">
                <div>
                  <i
                    v-if="state.input.category == slotProps.option.val"
                    class="pi pi-check p-mr-2"
                    style="fontsize: 1rem"
                  />{{ slotProps.option.text }}
                </div>
              </template>
            </list-box>
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
import { CategoryEnum } from "@/constants/category-enum";
import { AmountHistoryService } from "@/services/api/amount-history-service";
import { ExpenseItem } from "@/models/expense-item";
import { parseCurrency } from "@/helpers/helpers";

interface Props {
  dialog: boolean;
  input?: ExpenseItem;
}

interface State {
  dialog: boolean;
  input?: ExpenseItem;
  amountHistoryService: AmountHistoryService | null;
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
        category: CategoryEnum.Food,
        description: null,
        amount: null,
        date: null
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

    const categories: Array<SelectItem<CategoryEnum>> = [
      {
        text: "Hrana",
        val: CategoryEnum.Food
      },
      {
        text: "Darovi",
        val: CategoryEnum.Gifts
      },
      {
        text: "Igre",
        val: CategoryEnum.Games
      },
      {
        text: "Javni prijevoz",
        val: CategoryEnum.PublicTransport
      },
      {
        text: "Ostalo",
        val: CategoryEnum.Other
      }
    ];

    function refresh() {
      state.refresh.refresh();
    }

    async function addExpense() {
      const payload = {
        ...state.input
      } as ExpenseItem;

      payload.amount = payload.amount?.toString() + "HRK";
      payload.date = new Date();

      const currentAmount = await state.amountHistoryService?.getCurrentAmount();

      const gyroVal = parseCurrency(currentAmount?.gyro as string);
      const checkingVal = parseCurrency(currentAmount?.checking as string);
      const pocketVal = parseCurrency(currentAmount?.pocket as string);

      state.amountHistoryService?.addHistory({
        gyro:
          state.input?.paymentSource == PaymentSourceEnum.GyroAccount
            ? (gyroVal - parseFloat(state.input.amount as string)).toString() +
              "HRK"
            : gyroVal.toString() + "HRK",
        checking:
          state.input?.paymentSource == PaymentSourceEnum.CheckingAccount
            ? (
                checkingVal - parseFloat(state.input.amount as string)
              ).toString() + "HRK"
            : checkingVal.toString() + "HRK",
        pocket:
          state.input?.paymentSource == PaymentSourceEnum.Pocket
            ? (
                pocketVal - parseFloat(state.input.amount as string)
              ).toString() + "HRK"
            : pocketVal.toString() + "HRK",
        date: new Date()
      });

      state.amountHistoryService?.addExpense(payload);

      state.dialog = false;
      refresh();
    }

    function hideDialog() {
      context.emit("update:dialog", state.dialog);
    }

    return {
      state,
      addExpense,
      categories,
      paymentSources,
      hideDialog
    };
  }
});
</script>

<style scoped>
</style>
