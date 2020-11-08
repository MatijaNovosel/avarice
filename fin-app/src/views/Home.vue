<template>
  <div class="p-grid p-mt-5 p-nogutter p-justify-center">
    <div class="p-col-3">
      <group-box icon="dollar" title="Žiro račun" class="p-text-center">
        <chip text-color="white" color="#f44336" class="p-ml-2">
          <span v-if="state.loading">
            <i class="pi pi-spin pi-spinner" style="fontsize: 2rem"></i>
          </span>
          <span v-else>
            {{ state.currentAmount.gyro }}
          </span>
        </chip>
      </group-box>
    </div>
    <div class="p-col-3 p-px-3">
      <group-box icon="dollar" title="Tekući račun" class="p-text-center">
        <chip text-color="white" color="#f44336" class="p-ml-2">
          <span v-if="state.loading">
            <i class="pi pi-spin pi-spinner" style="fontsize: 2rem"></i>
          </span>
          <span v-else>
            {{ state.currentAmount.checking }}
          </span>
        </chip>
      </group-box>
    </div>
    <div class="p-col-3">
      <group-box icon="dollar" title="Džep" class="p-text-center">
        <chip text-color="white" color="#f44336" class="p-ml-2">
          <span v-if="state.loading">
            <i class="pi pi-spin pi-spinner" style="fontsize: 2rem"></i>
          </span>
          <span v-else>
            {{ state.currentAmount.pocket }}
          </span>
        </chip>
      </group-box>
    </div>
  </div>
  <div class="p-grid p-mt-5 p-nogutter p-justify-center">
    <div class="p-col-9">
      <group-box icon="dollar" title="Stanje kroz vrijeme">
        <chart type="line" :data="state.basicData" />
      </group-box>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import { CurrentAmountService } from "@/services/api/current-amount-service";

interface CurrentAmount {
  gyro: string;
  checking: string;
  pocket: string;
}

interface State {
  currentAmount: CurrentAmount;
  currentAmountService: CurrentAmountService | null;
  loading: boolean;
}

export default defineComponent({
  name: "Home",
  setup() {
    const state: State = reactive({
      currentAmount: {
        gyro: "",
        checking: "",
        pocket: ""
      },
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
            label: "First Dataset",
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: "#42A5F5"
          },
          {
            label: "Second Dataset",
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            borderDash: [5, 5],
            borderColor: "#66BB6A"
          },
          {
            label: "Third Dataset",
            data: [12, 51, 62, 33, 21, 62, 45],
            fill: true,
            borderColor: "#FFA726",
            backgroundColor: "rgba(255,167,38,0.2)"
          }
        ]
      }
    });

    onMounted(async () => {
      state.currentAmountService = new CurrentAmountService();
      state.loading = true;
      const data = await state.currentAmountService.getCurrentAmount();
      state.currentAmount.gyro = data.gyro;
      state.currentAmount.checking = data.checking;
      state.currentAmount.pocket = data.pocket;
      state.loading = false;
    });

    return { state };
  }
});
</script>

<style>
</style>
