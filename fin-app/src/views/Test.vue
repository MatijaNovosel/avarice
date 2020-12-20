<template>
  <div class="test-container">
    <span class="gradient-text">Testing</span>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent, onMounted, reactive } from "vue";
import environmentVariables from "@/constants/environment-variables.json";

interface HistoryItem {
  id: number;
  gyro: number;
  checking: number;
  pocket: number;
  euros: number;
  createdAt: string;
}

interface State {
  financialHistory: HistoryItem[];
}

export default defineComponent({
  name: "test",
  setup() {
    const state: State = reactive({
      financialHistory: []
    });

    onMounted(async () => {
      const id = 1;
      const response = await axios.post(environmentVariables.apiUrl, {
        query: `
          query {
              financialHistory(id: ${id}) {
                id,
                createdAt,
                checking,
                gyro,
                pocket,
                euros,
                appUserId
            }
          }
        `
      });
      state.financialHistory = response.data.data.financialHistory;
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
