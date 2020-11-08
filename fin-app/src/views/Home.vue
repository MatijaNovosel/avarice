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
        <chip text-color="white" color="#2790f2" class="p-ml-2">
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
        <chip text-color="white" color="#FFA726" class="p-ml-2">
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
import { AmountHistoryService } from "@/services/api/amount-history-service";
import { Timestamp } from "@firebase/firestore-types";

interface CurrentAmount {
  gyro: string;
  checking: string;
  pocket: string;
}

interface HistoryItem {
  gyro: string;
  checking: string;
  pocket: string;
  date: Timestamp;
}

interface State {
  currentAmount: CurrentAmount;
  currentAmountService: CurrentAmountService | null;
  amountHistoryService: AmountHistoryService | null;
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
      amountHistoryService: null,
      basicData: {
        labels: [
          "1/11/2020",
          "2/12/2020",
          "3/12/2020",
          "4/12/2020",
          "5/12/2020",
          "6/12/2020",
          "7/12/2020"
        ],
        datasets: [
          {
            label: "Žiro račun",
            data: [
              8340.32,
              8440.32,
              8240.32,
              7340.32,
              8340.32,
              8340.32,
              8340.32
            ],
            fill: true,
            borderColor: "#c71e12",
            backgroundColor: "rgba(150, 24, 15, 0.2)"
          }
        ]
      }
    });

    onMounted(async () => {
      state.currentAmountService = new CurrentAmountService();
      state.amountHistoryService = new AmountHistoryService();

      state.loading = true;

      const data = await state.currentAmountService.getCurrentAmount();
      state.currentAmount.gyro = data.gyro;
      state.currentAmount.checking = data.checking;
      state.currentAmount.pocket = data.pocket;

      const history = state.amountHistoryService.getHistory();

      state.loading = false;
    });

    return { state };
  }
});
</script>

<style>
</style>
