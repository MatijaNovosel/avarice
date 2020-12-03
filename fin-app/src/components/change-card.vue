<template>
  <div
    v-ripple
    class="amount-container p-shadow-6 p-ripple"
    :class="{
      'expense red': state.expense,
      'gain green': !state.expense
    }"
  >
    <span class="amount-title p-mb-1"
      >{{ state.title }} •
      <span class="amount-date p-mb-1">{{ state.date }}</span>
    </span>
    <span class="amount-text">{{ `${state.amount}HRK` }}</span>
    <div class="amount-end">
      <div class="amount-tags">
        <tag
          v-for="(tag, i) in state.tags"
          :key="i"
          :color="state.expense ? '#c52626' : '#428733'"
          >{{ formatTag(tag) }}</tag
        >
      </div>
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
  expense?: boolean | null;
  tags?: TagEnum[] | null;
}

interface State {
  amount?: number | null;
  title?: string | null;
  date?: string | null;
  expense?: boolean | null;
  tags?: TagEnum[] | null;
}

export default defineComponent({
  name: "change-card",
  props: {
    amount: Number,
    title: String,
    tags: null,
    date: String,
    expense: Boolean
  },
  setup(props: Props) {
    const state: State = reactive({
      amount: props.amount,
      title: props.title,
      date: props.date,
      tags: props.tags,
      expense: props.expense
    });

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

.amount-container
  display: flex
  flex-direction: column
  justify-content: center
  padding: 1.2rem
  border-top-right-radius: 6px
  border-bottom-right-radius: 6px
  user-select: none

.amount-title
  color: #927d7d

.amount-date
  color: #bfb4b4

.amount-text
  font-size: 1.5rem

.amount-tags
  margin-right: 0.7em

.amount-end
  display: flex
  align-items: center
  align-self: flex-end
  margin: 0.4em 0
</style>
