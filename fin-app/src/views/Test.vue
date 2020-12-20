<template>
  <div class="test-container">
    <span class="gradient-text">Testing</span>
  </div>
</template>

<script lang="ts">
import { getService, Types } from "@/di-container";
import { GHistoryItem } from "@/models/history-item";
import { IHistoryService } from "@/services/interfaces/history-service";
import { defineComponent, onMounted, reactive } from "vue";

interface State {
  financialHistory: GHistoryItem[];
}

export default defineComponent({
  name: "test",
  setup() {
    const state: State = reactive({
      financialHistory: []
    });

    onMounted(async () => {
      state.financialHistory = await getService<IHistoryService>(
        Types.HistoryService
      ).getHistoryByUserId();
    });

    return {
      state
    };
  }
});
</script>

<style lang="sass">
.test-container
  display: flex
  flex-direction: column
  padding: 1.5em
  justify-content: center
  justify-items: center
  align-content: center
  font-weight: bold
  font-size: 3em
  text-align: center
</style>
