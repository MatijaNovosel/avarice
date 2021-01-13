<template>
  <div
    class="select-none flex flex-col justify-center p-3 rounded-r-2xl shadow-lg"
    :class="{
      'expense red': state.expense,
      'gain green': !state.expense
    }"
  >
    <span class="amount-title"
      >{{ state.title }} •
      <span class="amount-date">{{ state.date }}</span>
    </span>
    <span class="text-2xl">{{
      `${
        state.show
          ? state.amount.toLocaleString("en")
          : ("" + state.amount).replace(/[0-9]/gi, "*")
      }HRK`
    }}</span>
    <div class="flex self-end space-x-2">
      <tag
        v-for="(tag, i) in state.tags"
        :key="i"
        :color="state.expense ? '#c52626' : '#428733'"
        >{{ formatTag(tag) }}</tag
      >
    </div>
  </div>
</template>

<script lang="ts">
import { TagEnum } from "@/constants/tag-enum";
import { defineComponent, reactive, watch } from "vue";
import { formatTag } from "@/helpers/helpers";

interface Props {
  amount?: number | null;
  title?: string | null;
  date?: string | null;
  expense?: boolean;
  tags?: TagEnum[] | null;
  show?: boolean;
}

interface State {
  amount?: number | null;
  title?: string | null;
  date?: string | null;
  expense?: boolean;
  tags?: TagEnum[] | null;
  show?: boolean;
}

export default defineComponent({
  name: "change-card",
  props: {
    amount: Number,
    title: String,
    tags: null,
    date: String,
    expense: Boolean,
    show: {
      type: Boolean,
      default: true
    }
  },
  setup(props: Props) {
    const state: State = reactive({
      amount: props.amount,
      title: props.title,
      date: props.date,
      tags: props.tags,
      expense: props.expense,
      show: props.show
    });

    watch(
      () => props.show,
      (val) => (state.show = val)
    );

    watch(
      () => props.tags,
      (val) => (state.tags = val)
    );

    return {
      state,
      formatTag
    };
  }
});
</script>

<style scoped lang="sass">
.expense
  border-left: 10px solid rgb(197, 38, 38)
  color: rgb(197, 38, 38)
  background-color: rgb(94, 33, 33)

.gain
  border-left: 10px solid rgb(66, 135, 51)
  color: rgb(66, 135, 51)
  background-color: rgb(46, 84, 37)

.amount-title
  color: #927d7d

.amount-date
  color: #bfb4b4
</style>
