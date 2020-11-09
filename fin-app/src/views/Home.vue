<template>
  <div class="p-grid p-mt-5 p-nogutter p-justify-center">
    <div class="p-col-3">
      <group-box icon="dollar" title="Žiro račun" class="p-text-center">
        <chip text-color="white" color="#f44336" class="p-my-2">
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
        <chip text-color="white" color="#2790f2" class="p-my-2">
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
        <chip text-color="white" color="#FFA726" class="p-my-2">
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
        <chart
          type="line"
          :data="state.graphData"
          :options="state.graphOptions"
        />
      </group-box>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, watch } from "vue";
import { CurrentAmountService } from "@/services/api/current-amount-service";
import { AmountHistoryService } from "@/services/api/amount-history-service";
import { Timestamp } from "@firebase/firestore-types";
import { parseCurrency } from "@/helpers/helpers";
import { format } from "date-fns";

interface DatasetItem {
  label: string;
  data: Array<number>;
  fill: boolean;
  borderColor: string;
  backgroundColor: string;
}

interface GraphData {
  labels: Array<string>;
  datasets: Array<DatasetItem>;
}

interface CurrentAmount {
  gyro: string;
  checking: string;
  pocket: string;
}

interface Account {
  gyro: boolean;
  pocket: boolean;
  checking: boolean;
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
  account: Account;
  graphData: GraphData | null;
}

export default defineComponent({
  name: "Home",
  setup() {
    const state: State = reactive({
      account: {
        gyro: true,
        pocket: false,
        checking: false
      },
      currentAmount: {
        gyro: "",
        checking: "",
        pocket: ""
      },
      loading: false,
      currentAmountService: null,
      amountHistoryService: null,
      graphOptions: {
        legend: {
          display: false
        }
      },
      graphData: null
    });

    onMounted(async () => {
      state.currentAmountService = new CurrentAmountService();
      state.amountHistoryService = new AmountHistoryService();

      state.loading = true;

      const data = await state.currentAmountService.getCurrentAmount();
      state.currentAmount.gyro = data.gyro;
      state.currentAmount.checking = data.checking;
      state.currentAmount.pocket = data.pocket;

      const history = await state.amountHistoryService.getHistory();
      const graphData: GraphData = {
        labels: [],
        datasets: [
          {
            label: "Žiro račun",
            data: [],
            fill: true,
            borderColor: "#c71e12",
            backgroundColor: "rgba(150, 24, 15, 0.2)"
          }
        ]
      };

      history.forEach((x) => {
        graphData.datasets[0].data.push(parseCurrency(x.gyro));
        graphData.labels.push(format(x.date.toDate(), "dd/MM/yyyy - HH:mm"));
      });

      state.graphData = graphData;
      state.loading = false;
    });

    watch(
      () => state.account.gyro,
      (val) => {
        console.log(val);
      }
    );

    return { state };
  }
});
</script>

<style>
</style>
