<template>
  <div class="flex px-5 py-6 dark:bg-gray-800 bg-white rounded-lg shadow">
    <progress-spinner class="spinner" strokeWidth="10" v-if="state.loading" />
    <template v-else>
      <div class="w-full flex items-center justify-between">
        <div class="flex items-center select-none">
          <mdi-icon :size="28" :color="state.color" :name="state.icon" />
          <div class="flex flex-col ml-5">
            <span class="font-bold text-gray-400">{{ state.title }}</span>
            <span class="font-semibold text-xl dark:text-white">
              {{ state.formattedCurrencyDisplay }}
            </span>
          </div>
        </div>
        <div class="flex space-x-4">
          <mdi-icon
            class="cursor-pointer mr-3"
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
import { computed, defineComponent, reactive, watch } from "vue";
import mdiIcon from "@/components/mdi-icon.vue";
import { MDIIcon } from "@/types/index";
import { formatCurrencyDisplay } from "@/helpers/helpers";

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
  formattedCurrencyDisplay: string;
}

export default defineComponent({
  name: "dashboard-amount-card",
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
  setup(props: Props) {
    const state: State = reactive({
      amount: props.amount,
      icon: props.icon,
      title: props.title,
      color: props.color,
      loading: props.loading,
      noEnabling: props.noEnabling,
      amountVisible: props.amountVisible !== undefined ? props.amountVisible : false,
      currency: props.currency,
      formattedCurrencyDisplay: computed(() =>
        formatCurrencyDisplay(
          state.amountVisible as boolean,
          state.amount as number,
          state.currency as string
        )
      )
    });

    function amountVisibleChanged() {
      state.amountVisible = !state.amountVisible;
    }

    watch(
      () => props.amount,
      val => (state.amount = val)
    );

    watch(
      () => props.color,
      val => (state.color = val)
    );

    watch(
      () => props.loading,
      val => (state.loading = val)
    );

    watch(
      () => props.currency,
      val => (state.currency = val)
    );

    return {
      state,
      amountVisibleChanged
    };
  }
});
</script>

<style scoped lang="sass">
.spinner
  width: 25px
  height: 25px
</style>
