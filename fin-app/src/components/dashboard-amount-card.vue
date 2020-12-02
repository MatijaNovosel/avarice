<template>
  <div
    :style="{
      borderLeft: `10px solid ${state.color}`
    }"
    class="amount-container p-shadow-6"
  >
    <progress-spinner class="spinner" strokeWidth="10" v-if="state.loading" />
    <template v-else>
      <div class="content">
        <div class="left-side">
          <div class="p-pr-2">
            <mdi-icon class="p-mx-2" :color="state.color" :name="state.icon" />
          </div>
          <div class="amount-info">
            <span class="amount-title p-mb-1">{{ state.title }}</span>
            <span
              :style="{
                color: state.color
              }"
              class="amount-text"
              >{{ state.amount }}</span
            >
          </div>
        </div>
        <div class="actions">
          <mdi-icon
            v-if="!state.noEnabling"
            :color="state.color"
            class="p-mr-3"
            :size="20"
            :name="state.enabled ? 'signal-cellular-3' : 'signal-off'"
          />
          <mdi-icon
            :color="state.color"
            :size="20"
            :name="state.amountVisible ? 'eye' : 'eye-off'"
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
  amount?: string | null;
  icon?: MDIIcon;
  title?: string | null;
  color?: string | null;
  loading?: boolean;
  enabled?: boolean;
  noEnabling?: boolean;
}

interface State {
  amount?: string | null;
  icon?: MDIIcon;
  title?: string | null;
  color?: string | null;
  loading?: boolean;
  enabled?: boolean;
  noEnabling?: boolean;
  amountVisible?: boolean;
}

export default defineComponent({
  name: "dashboard-amount-card",
  components: {
    mdiIcon
  },
  props: {
    amount: String,
    icon: null,
    title: String,
    color: String,
    loading: Boolean,
    enabled: Boolean,
    noEnabling: Boolean
  },
  setup(props: Props, context: SetupContext) {
    const state: State = reactive({
      amount: props.amount,
      icon: props.icon,
      title: props.title,
      color: props.color,
      loading: props.loading,
      enabled: props.enabled,
      noEnabling: props.noEnabling,
      amountVisible: false
    });

    function checkboxClicked() {
      context.emit("update:enabled", state.enabled);
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
      () => props.enabled,
      (val) => (state.enabled = val)
    );

    return {
      state,
      checkboxClicked
    };
  }
});
</script>

<style scoped lang="sass">
.spinner
  width: 25px
  height: 25px

.left-side
  display: flex
  flex-direction: row
  align-items: center

.amount-container
  flex-direction: row
  display: flex
  align-items: center
  padding: 1.2rem 2.4rem 1.2rem 0.6rem
  background-color: #1e1e1e
  border-top-right-radius: 12px
  border-bottom-right-radius: 12px

.content
  width: 100%
  display: flex
  flex-direction: row
  justify-content: space-between
  align-items: center

.amount-info
  display: flex
  flex-direction: column
  justify-content: center

.amount-title
  color: #927d7d

.amount-text
  font-size: 1.5rem

.amount-circle
  border-radius: 50%
  width: 25px
  height: 25px
</style>
