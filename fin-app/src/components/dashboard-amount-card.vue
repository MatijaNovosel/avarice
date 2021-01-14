<template>
  <div
    :style="{
      borderLeft: `6px solid ${state.color}`
    }"
    class="flex px-5 py-6 bg-gray-800 rounded-r-2xl shadow-lg"
  >
    <progress-spinner class="spinner" strokeWidth="10" v-if="state.loading" />
    <template v-else>
      <div class="w-full flex items-center content-between justify-between">
        <div class="flex items-center no-select">
          <mdi-icon :size="28" :color="state.color" :name="state.icon" />
          <div class="flex flex-col ml-5">
            <span class="amount-title">{{ state.title }}</span>
            <span
              :style="{
                color: state.color
              }"
              class="font-bold text-xl"
              >{{
                state.amountVisible
                  ? `${state.amount.toLocaleString("en")}${state.currency}`
                  : `${state.amount}${state.currency}`.replace(/[0-9]/gi, "*")
              }}</span
            >
          </div>
        </div>
        <div class="flex space-x-4">
          <mdi-icon
            class="cursor-pointer"
            :color="state.color"
            :size="20"
            :name="state.amountVisible ? 'eye' : 'eye-off'"
            @click="amountVisibleChanged"
            v-tooltip.bottom="'Sakrij iznos'"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, SetupContext, watch } from "vue";
import mdiIcon from "@/components/mdi-icon.vue";
import { MDIIcon } from "@/types/index";

interface Props {
  amount?: number | null;
  currency?: string | null;
  icon?: MDIIcon;
  title?: string | null;
  color?: string | null;
  loading?: boolean;
  noEnabling?: boolean;
  amountVisible?: boolean;
}

interface State {
  amount?: number | null;
  currency?: string | null;
  icon?: MDIIcon;
  title?: string | null;
  color?: string | null;
  loading?: boolean;
  noEnabling?: boolean;
  amountVisible?: boolean;
}

export default defineComponent({
  name: "dashboard-amount-card",
  emits: ["update:enabled", "update:amountVisible"],
  components: {
    mdiIcon
  },
  props: {
    amount: Number,
    currency: String,
    icon: null,
    title: String,
    color: String,
    loading: Boolean,
    noEnabling: Boolean,
    amountVisible: Boolean
  },
  setup(props: Props, context: SetupContext) {
    const state: State = reactive({
      amount: props.amount,
      icon: props.icon,
      title: props.title,
      color: props.color,
      loading: props.loading,
      noEnabling: props.noEnabling,
      amountVisible: props.amountVisible,
      currency: props.currency
    });

    function amountVisibleChanged() {
      state.amountVisible = !state.amountVisible;
      context.emit("update:amountVisible", state.amountVisible);
    }

    watch(
      () => props.amount,
      (val) => (state.amount = val)
    );

    watch(
      () => props.color,
      (val) => (state.color = val)
    );

    watch(
      () => props.loading,
      (val) => (state.loading = val)
    );

    watch(
      () => props.currency,
      (val) => (state.currency = val)
    );

    return {
      state,
      amountVisibleChanged
    };
  }
});
</script>

<style scoped lang="sass">
@import "../assets/css/helpers"

.spinner
  width: 25px
  height: 25px

.amount-title
  color: #927d7d
</style>
