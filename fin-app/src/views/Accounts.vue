<template>
  <div class="mb-10 px-8 flex flex-col">
    <span class="mb-3 text-xl font-semibold"> Accounts </span>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <dashboard-amount-card
        v-for="n in 4"
        :key="n"
        icon="credit-card"
        title="Gyro"
        :loading="state.loading"
        color="#acb0bf"
        :amount="4500"
        amount-visible
        currency="HRK"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import DashboardAmountCard from "@/components/dashboard-amount-card.vue";

interface State {
  loading: boolean;
}

export default defineComponent({
  name: "Home",
  components: {
    DashboardAmountCard
  },
  setup() {
    const state: State = reactive({
      loading: false
    });

    onMounted(async () => {
      //
    });

    return {
      state
    };
  }
});
</script>

<style lang="sass">
</style>
