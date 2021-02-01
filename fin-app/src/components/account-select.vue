<template>
  <div class="justify-center items-center gap-4 grid grid-cols-2 pb-3">
    <template
      v-for="paymentSource in state.paymentSources"
      :key="paymentSource.id"
    >
      <div
        class="flex px-5 py-3 bg-white rounded-lg border border-gray-200 shadow cursor-pointer"
      >
        <div class="w-full flex items-center content-between justify-between">
          <div class="flex items-center">
            <mdi-icon :size="28" color="#acb0bf" :name="paymentSource.icon" />
            <div class="flex flex-col ml-5">
              <span class="text-lg text-gray-400 font-bold">
                {{ paymentSource.description }}
              </span>
            </div>
          </div>
          <radio-button
            @change="valueChanged"
            name="accountToId"
            :value="paymentSource.id"
            v-model="state.selection"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { getService, Types } from "@/di-container";
import { PaymentSource } from "@/models/payment-source";
import { IPaymentSourceService } from "@/services/interfaces/payment-source-service";
import { defineComponent, onMounted, reactive, watch } from "vue";
import MdiIcon from "../components/mdi-icon.vue";

interface Props {
  selection?: string | null;
}

interface State {
  selection?: string | null;
  paymentSources: PaymentSource[];
}

export default defineComponent({
  name: "account-select",
  emits: ["update:selection"],
  props: {
    selection: null
  },
  components: {
    MdiIcon
  },
  setup(props: Props, context) {
    const state: State = reactive({
      paymentSources: [],
      selection: props.selection
    });

    watch(
      () => props.selection,
      val => (state.selection = val)
    );

    onMounted(async () => {
      state.paymentSources = await getService<IPaymentSourceService>(
        Types.PaymentSourceService
      ).getAllByUserId(1);
    });

    function valueChanged() {
      context.emit("update:selection", state.selection);
    }

    return {
      state,
      valueChanged
    };
  }
});
</script>
