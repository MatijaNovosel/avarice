<template>
  <div class="p-grid p-mt-5 p-nogutter p-justify-center">
    <div class="p-col p-text-center">
      Trenutačno stanje:
      <chip text-color="white" color="#f44336" class="p-ml-2">
        <span v-if="state.loading">
          <i class="pi pi-spin pi-spinner" style="fontsize: 2rem"></i>
        </span>
        <span v-else>
          {{ state.currentAmount }}
        </span>
      </chip>
    </div>
  </div>
  <div class="p-grid p-mt-3 p-nogutter p-justify-center">
    <div class="p-col-6 p-px-5">
      <group-box icon="dollar" title="Stanje kroz vrijeme">
        <chart type="bar" :data="state.basicData" />
      </group-box>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import { CurrentAmountService } from "@/services/api/current-amount-service";

interface State {
  currentAmount: string | null;
  currentAmountService: CurrentAmountService | null;
  loading: boolean;
}

export default defineComponent({
  name: "Home",
  setup() {
    const state: State = reactive({
      currentAmount: null,
      loading: false,
      currentAmountService: null,
      basicData: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July"
        ],
        datasets: [
          {
            label: "My First dataset",
            backgroundColor: "#42A5F5",
            data: [65, 59, 80, 81, 56, 55, 40]
          },
          {
            label: "My Second dataset",
            backgroundColor: "#9CCC65",
            data: [28, 48, 40, 19, 86, 27, 90]
          }
        ]
      }
    });

    onMounted(async () => {
      state.currentAmountService = new CurrentAmountService();
      state.loading = true;
      const data = await state.currentAmountService.getCurrentAmount();
      state.currentAmount = data.val;
      state.loading = false;
    });

    return { state };
  }
});
</script>

<style>
</style>
