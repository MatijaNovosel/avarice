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
    <div class="expense-form p-mt-5 p-px-3">
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
        <label for="amount"> Iznos troška</label>
      </span>
      <span class="p-invalid p-pl-2 p-pt-2" v-if="model.amount.$invalid">{{
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
        <label for="description"> Opis</label>
      </span>
      <span class="p-invalid p-pl-2 p-pt-2" v-if="model.description.$invalid">{{
        model.description.$errors.map((x) => x.$message).join(" • ")
      }}</span>
      <div class="container p-mt-3">
        <span class="container-label">Izvor plaćanja</span>
        <select-button
          v-model="model.paymentSource.$model"
          :options="paymentSources"
          optionLabel="text"
          optionValue="val"
        />
      </div>
    </div>
    <template #footer>
      <progress-spinner class="spinner" strokeWidth="10" v-if="state.saving" />
      <btn
        v-else
        @click="addGain"
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
import { ChangeItem } from "../models/change-item";
import { required, numeric } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { TagEnum } from "../constants/tag-enum";
import { getService, Types } from "../di-container";
import { IChangeService } from "../services/interfaces/change-service";
import { createSelectFromEnum } from "../helpers/helpers";

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
  name: "expense-dialog",
  emits: ["update:dialog"],
  props: {
    dialog: Boolean,
    input: null
  },
  setup(props: Props, context: SetupContext) {
    const entry = reactive({
      paymentSource: PaymentSourceEnum.GyroAccount,
      tags: [TagEnum.Other],
      description: "",
      amount: 0,
      date: new Date(),
      expense: false
    } as ChangeItem);

    const rules = {
      amount: { required, numeric },
      paymentSource: { required },
      description: { required },
      tags: { required }
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

    function resetDialog() {
      state.dialog = false;
      entry.amount = 0;
      entry.description = "Description";
      entry.paymentSource = PaymentSourceEnum.GyroAccount;
      entry.tags = [TagEnum.Other];
      model.value.$reset;
    }

    function hideDialog() {
      resetDialog();
      context.emit("update:dialog", state.dialog);
    }

    function refresh() {
      state.refresh.refresh();
    }

    async function addGain() {
      state.saving = true;

      const payload: ChangeItem = {
        ...entry
      };

      payload.date = new Date();

      const changeService = await getService<IChangeService>(
        Types.ChangeService
      );

      const currentAmount = await changeService.getCurrentAmount();

      await changeService.addHistory({
        euros: currentAmount.euros,
        gyro:
          entry.paymentSource == PaymentSourceEnum.GyroAccount
            ? ((currentAmount?.gyro + entry.amount) as number)
            : currentAmount?.gyro,
        checking:
          entry.paymentSource == PaymentSourceEnum.CheckingAccount
            ? ((currentAmount?.checking + entry.amount) as number)
            : currentAmount?.checking,
        pocket:
          entry.paymentSource == PaymentSourceEnum.Pocket
            ? ((currentAmount?.pocket + entry.amount) as number)
            : currentAmount?.pocket,
        date: new Date()
      });

      changeService.addChange(payload);
      hideDialog();
      state.saving = false;
      refresh();
    }

    return {
      state,
      addGain,
      paymentSources,
      hideDialog,
      model
    };
  }
});
</script>

<style scoped lang="sass">
.container-label
  color: whtie
  margin-bottom: 1.2rem

.expense-form
  display: flex
  flex-direction: column

.expense-input
  width: 100%

.container
  padding: 1.5em
  border-radius: 12px
  background-color: #1e1e1e
  display: flex
  flex-direction: column
</style>
