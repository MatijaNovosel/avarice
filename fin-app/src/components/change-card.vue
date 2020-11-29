<template>
  <div
    class="amount-container p-shadow-6"
    :class="{
      expense: state.expense,
      gain: !state.expense
    }"
  >
    <span class="amount-title p-mb-1">{{ state.title }}</span>
    <span class="amount-text">{{ `${state.amount}HRK` }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

interface Props {
  amount?: string | null;
  title?: string | null;
  expense?: boolean | null;
}

interface State {
  amount?: string | null;
  title?: string | null;
  expense?: boolean | null;
}

export default defineComponent({
  name: "change-card",
  props: {
    amount: String,
    title: String,
    expense: Boolean
  },
  setup(props: Props) {
    const state: State = reactive({
      amount: props.amount,
      title: props.title,
      expense: props.expense
    });

    return {
      state
    };
  }
});
</script>

<style scoped>
.expense {
  border-left: 10px solid rgb(197, 38, 38);
  color: rgb(197, 38, 38);
  background-color: rgb(94, 33, 33);
}
.gain {
  border-left: 10px solid rgb(66, 135, 51);
  color: rgb(66, 135, 51);
  background-color: rgb(46, 84, 37);
}
.amount-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 1.2rem;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}
.amount-title {
  color: #927d7d;
}
.amount-text {
  font-size: 1.5rem;
}
.amount-circle {
  border-radius: 50%;
  width: 25px;
  height: 25px;
}
</style>
