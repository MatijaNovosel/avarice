<template>
  <div class="p-grid p-mt-5 p-nogutter p-justify-center">
    <div class="p-col-4 p-pl-5">
      <group-box
        icon="dollar"
        title="Žiro račun"
        class="p-text-center shadow"
        style="position: relative"
      >
        <img :src="require('@/assets/icons/euros.png')" class="aside" />
        <chip text-color="white" color="#f44336" class="p-my-2">
          <span v-if="state.loading">
            <i class="pi pi-spin pi-spinner" style="fontsize: 2rem"></i>
          </span>
          <span v-else>
            {{ state.currentAmount.gyro }}
          </span>
        </chip>
        <p-checkbox
          v-model="state.account.gyro"
          class="aside-reverse"
          :binary="true"
        />
      </group-box>
      <group-box
        icon="dollar"
        title="Tekući račun"
        class="p-text-center p-my-5 shadow"
        style="position: relative"
      >
        <img :src="require('@/assets/icons/roubles.png')" class="aside" />
        <chip text-color="white" color="#2790f2" class="p-my-2">
          <span v-if="state.loading">
            <i class="pi pi-spin pi-spinner" style="fontsize: 2rem"></i>
          </span>
          <span v-else>
            {{ state.currentAmount.checking }}
          </span>
        </chip>
        <p-checkbox
          v-model="state.account.checking"
          class="aside-reverse"
          :binary="true"
        />
      </group-box>
      <group-box
        icon="dollar"
        title="Džep"
        class="p-text-center shadow"
        style="position: relative"
      >
        <img :src="require('@/assets/icons/wallet.png')" class="aside" />
        <chip text-color="white" color="#FFA726" class="p-my-2">
          <span v-if="state.loading">
            <i class="pi pi-spin pi-spinner" style="fontsize: 2rem"></i>
          </span>
          <span v-else>
            {{ state.currentAmount.pocket }}
          </span>
        </chip>
        <p-checkbox
          v-model="state.account.pocket"
          class="aside-reverse"
          :binary="true"
        />
      </group-box>
      <group-box
        icon="dollar"
        title="Ukupno"
        class="p-text-center shadow p-my-5"
        style="position: relative"
      >
        <chip text-color="white" color="#FFA726" class="p-my-2">
          <span v-if="state.loading">
            <i class="pi pi-spin pi-spinner" style="fontsize: 2rem"></i>
          </span>
          <span v-else>
            {{ state.totalAmount }}
          </span>
        </chip>
      </group-box>
    </div>
    <div class="p-col-8 p-px-5">
      <group-box icon="dollar" title="Stanje kroz vrijeme" class="shadow">
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
  amountHistoryService: AmountHistoryService | null;
  loading: boolean;
  account: Account;
  graphData: GraphData | null;
  totalAmount: string;
}

export default defineComponent({
  name: "Home",
  setup() {
    const state: State = reactive({
      account: {
        gyro: false,
        pocket: true,
        checking: false
      },
      currentAmount: {
        gyro: "",
        checking: "",
        pocket: ""
      },
      loading: false,
      amountHistoryService: null,
      graphOptions: {
        legend: {
          display: true
        }
      },
      graphData: null,
      totalAmount: "0,00HRK"
    });

    async function updateData() {
      state.loading = true;

      const history = await (state.amountHistoryService as AmountHistoryService).getHistory();

      const totalDataset: DatasetItem = {
        label: "Ukupno",
        data: [],
        fill: true,
        borderColor: "green",
        backgroundColor: "green"
      };

      const gyroDataset: DatasetItem = {
        label: "Žiro račun",
        data: [],
        fill: true,
        borderColor: "#c71e12",
        backgroundColor: "rgba(150, 24, 15, 0.2)"
      };

      const checkingDataset: DatasetItem = {
        label: "Tekući račun",
        data: [],
        fill: true,
        borderColor: "blue",
        backgroundColor: "blue"
      };

      const pocketDataset: DatasetItem = {
        label: "Džep",
        data: [],
        fill: true,
        borderColor: "yellow",
        backgroundColor: "yellow"
      };

      const graphData: GraphData = {
        labels: history.map((x) =>
          format(x.date.toDate(), "dd/MM/yyyy - HH:mm")
        ),
        datasets: []
      };

      gyroDataset.data = history.map((x) => parseCurrency(x.gyro));
      pocketDataset.data = history.map((x) => parseCurrency(x.pocket));
      checkingDataset.data = history.map((x) => parseCurrency(x.checking));
      totalDataset.data = history.map(
        (x) =>
          parseCurrency(x.gyro) +
          parseCurrency(x.pocket) +
          parseCurrency(x.checking)
      );

      state.currentAmount.gyro = gyroDataset.data[gyroDataset.data.length - 1].toString() + "HRK";
      state.currentAmount.pocket = pocketDataset.data[pocketDataset.data.length - 1].toString() + "HRK";
      state.currentAmount.checking = checkingDataset.data[checkingDataset.data.length - 1].toString() + "HRK";
      state.totalAmount = totalDataset.data[totalDataset.data.length - 1].toString() + "HRK";

      if (
        state.account.gyro &&
        state.account.pocket &&
        state.account.checking
      ) {
        graphData.datasets.push(totalDataset);
      } else {
        if (state.account.gyro) {
          graphData.datasets.push(gyroDataset);
        }
        if (state.account.pocket) {
          graphData.datasets.push(pocketDataset);
        }
        if (state.account.checking) {
          graphData.datasets.push(checkingDataset);
        }
      }

      state.graphData = graphData;
      state.loading = false;
    }

    onMounted(async () => {
      state.amountHistoryService = new AmountHistoryService();
      updateData();
    });

    watch([state.account], () => {
      updateData();
    });

    return { state };
  }
});
</script>

<style>
.aside {
  position: absolute;
  left: 35px;
  top: 45px;
  width: 40px;
  height: 40px;
}
.aside-reverse {
  position: absolute;
  right: 45px;
  top: 55px;
}
</style>
