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
              v-model="state.input.PaymentSourceEnum"
              :options="PaymentSourceEnums"
              optionLabel="text"
              optionValue="val"
            />
          </group-box>
        </div>
        <div class="p-field p-col-12">
          <group-box icon="tag" title="Kategorija">
            <list-box
              :multiple="true"
              :filter="true"
              v-model="state.input.categories"
              :options="categories"
              dataKey="val"
              listStyle="max-height: 250px"
              optionValue="val"
              optionLabel="text"
            >
              <template #option="slotProps">
                <div>
                  <i
                    v-if="
                      state.input.categories.some(
                        (x) => x == slotProps.option.val
                      )
                    "
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
import { defineComponent, reactive, SetupContext, watch } from "vue";
import { PaymentSourceEnum } from "@/constants/payment-source-enum";
import { SelectItem } from "@/constants/select-item";
import { CategoryEnum } from "@/constants/category-enum";

interface Input {
  PaymentSourceEnum: PaymentSourceEnum | null;
  categories: Array<number>;
  description: string | null;
  amount: string | null;
}

interface Props {
  dialog: boolean;
  input?: Input;
}

interface State {
  dialog: boolean;
  input?: Input;
}

export default defineComponent({
  name: "expense-dialog",
  props: {
    dialog: Boolean,
    input: null
  },
  setup(props: Props, context: SetupContext) {
    const state: State = reactive({
      dialog: props.dialog,
      input: {
        PaymentSourceEnum: PaymentSourceEnum.GyroAccount,
        categories: [],
        description: null,
        amount: null
      }
    });

    watch(
      () => props.dialog,
      (val) => (state.dialog = val)
    );

    watch(
      () => props.input,
      (val) => (state.input = val)
    );

    const PaymentSourceEnums: Array<SelectItem<PaymentSourceEnum>> = [
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
      }
    ];

    function addExpense() {
      // const payload = { ...state.input };
      state.dialog = false;
    }

    function hideDialog() {
      context.emit("update:dialog", state.dialog);
    }

    return {
      state,
      addExpense,
      categories,
      PaymentSourceEnums,
      hideDialog
    };
  }
});
</script>

<style scoped>
</style>
