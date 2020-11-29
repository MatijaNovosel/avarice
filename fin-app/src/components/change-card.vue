<template>
  <div
    v-ripple
    class="amount-container p-shadow-6 p-ripple"
    :class="{
      'expense red': state.expense,
      'gain green': !state.expense
    }"
  >
    <span class="amount-title p-mb-1">{{ state.title }}</span>
    <span class="amount-text">{{ `${state.amount}HRK` }}</span>
    <span class="amount-action">
      {{ `${state.category} • ${state.date}` }}
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

interface Props {
  amount?: number | null;
  title?: string | null;
  date?: string | null;
  expense?: boolean | null;
  category?: string | null;
}

interface State {
  amount?: number | null;
  title?: string | null;
  date?: string | null;
  expense?: boolean | null;
  category?: string | null;
}

export default defineComponent({
  name: "change-card",
  props: {
    amount: Number,
    title: String,
    category: String,
    date: String,
    expense: Boolean
  },
  setup(props: Props) {
    const state: State = reactive({
      amount: props.amount,
      title: props.title,
      date: props.date,
      category: props.category,
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
  user-select: none;
}
.amount-title {
  color: #927d7d;
}
.amount-text {
  font-size: 1.5rem;
}
.amount-action {
  align-self: flex-end;
  color: #bfb4b4;
}
</style>
