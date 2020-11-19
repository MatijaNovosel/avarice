<template>
  <div class="p-grid p-mt-5 p-nogutter p-justify-center">
    <div class="p-col-12 p-md-4 p-pl-5">
      <group-box
        icon="dollar"
        title="Žiro račun"
        class="p-text-center shadow"
        style="position: relative"
      >
        <chip text-color="white" color="#f44336" class="p-my-2">
          <span v-if="state.loading">
            <i class="pi pi-spin pi-spinner" style="fontsize: 1rem"></i>
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
        <chip text-color="white" color="#2790f2" class="p-my-2">
          <span v-if="state.loading">
            <i class="pi pi-spin pi-spinner" style="fontsize: 1rem"></i>
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
        <chip text-color="white" color="#FFA726" class="p-my-2">
          <span v-if="state.loading">
            <i class="pi pi-spin pi-spinner" style="fontsize: 1rem"></i>
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
        <chip text-color="white" color="#43A047" class="p-my-2">
          <span v-if="state.loading">
            <i class="pi pi-spin pi-spinner" style="fontsize: 1rem"></i>
          </span>
          <span v-else>
            {{ state.totalAmount }}
          </span>
        </chip>
      </group-box>
    </div>
    <div class="p-col-12 p-md-8 p-px-5">
      <group-box icon="chart-line" title="Stanje kroz vrijeme" class="shadow">
        <chart
          type="line"
          :data="state.graphData"
          :options="state.graphOptions"
        />
      </group-box>
    </div>
    <div class="p-col-12 p-px-5 p-mt-6">
      <group-box icon="chart-bar" title="Troškovi/Dobitci" class="shadow">
        <div class="p-grid">
          <div class="p-col-12 p-my-3">
            <input-switch v-model="state.cardView" id="input-switch" />
            <label for="input-switch" class="p-ml-2">
              Prikaz u obliku kartica</label
            >
          </div>
          <div class="p-col-12" v-if="!state.cardView">
            <data-table
              :value="state.expensesAndGains"
              :paginator="true"
              :rows="10"
              :rowHover="true"
              class="p-datatable-striped p-datatable-sm"
              :loading="state.loading"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              :rowsPerPageOptions="[10, 25, 50]"
              currentPageReportTemplate="Prikazujem {first} od {last} ({totalRecords} ukupnih zapisa)"
            >
              <template #empty> Nema ni jednog troška. </template>
              <template #loading> Učitavam troškove. Pričekajte. </template>
              <column field="amount" header="Iznos">
                <template #body="slotProps">
                  <span
                    :class="{
                      'expense-text': slotProps.data.expense,
                      'gain-text': !slotProps.data.expense
                    }"
                    >{{ slotProps.data.amount }}
                    <i
                      class="pi currency-change-caret-table"
                      :class="{
                        'pi-caret-up': !slotProps.data.expense,
                        'pi-caret-down': slotProps.data.expense
                      }"
                      style="fontsize: 1rem"
                    />
                  </span>
                </template>
              </column>
              <column field="description" header="Opis">
                <template #body="slotProps">
                  {{ slotProps.data.description }}
                </template>
              </column>
              <column field="paymentSource" header="Izvor plaćanja">
                <template #body="slotProps">
                  {{ formatPaymentSource(slotProps.data.paymentSource) }}
                </template>
              </column>
              <column field="category" header="Kategorija">
                <template #body="slotProps">
                  {{ formatCategory(slotProps.data.category) || "Dobitak" }}
                </template>
              </column>
              <column field="date" header="Datum">
                <template #body="slotProps">
                  {{
                    format(slotProps.data.date.toDate(), "dd/MM/yyyy - HH:mm")
                  }}
                </template>
              </column>
            </data-table>
          </div>
          <div class="p-col-12" v-else>
            <div class="p-grid p-justify-center" v-if="state.loading">
              <i
                class="pi pi-spin pi-spinner"
                style="fontsize: 5rem; color: grey"
              ></i>
            </div>
            <div class="p-grid" v-else>
              <div
                class="p-col-4"
                v-for="(expense, i) in state.expensesAndGains"
                :key="i"
              >
                <card class="p-shadow-5 card-bg">
                  <template #title>
                    <div class="expense-title p-px-3">
                      <span
                        :class="{
                          'expense-text': expense.expense,
                          'gain-text': !expense.expense
                        }"
                        >{{ expense.amount }}
                        <i
                          class="pi currency-change-caret"
                          :class="{
                            'pi-caret-up': !expense.expense,
                            'pi-caret-down': expense.expense
                          }"
                          style="fontsize: 1rem"
                        />
                      </span>
                      <span class="expense-description">{{
                        formatCategory(expense.category) || "Dobitak"
                      }}</span>
                    </div>
                  </template>
                  <template #content>
                    <div class="p-grid p-px-3">
                      <div class="p-col-12">
                        {{ format(expense.date.toDate(), "dd.MM.yyyy. HH:mm") }}
                      </div>
                      <div class="p-col-12">
                        <span class="expense-description">{{
                          expense.description
                        }}</span>
                      </div>
                    </div>
                  </template>
                  <template #footer>
                    <div class="p-grid p-justify-end p-nogutter">
                      <btn
                        icon="pi pi-trash"
                        class="p-button-rounded p-button-text p-button-danger p-button-lg"
                        v-tooltip.bottom="
                          'Izbriši unos i vrati stanje kakvo je bilo u ovome trenutku'
                        "
                      />
                      <btn
                        icon="pi pi-list"
                        class="p-button-rounded p-button-text p-button-info p-button-lg p-mx-2"
                        v-tooltip.bottom="'Vidi detalje'"
                      />
                      <btn
                        icon="pi pi-copy"
                        class="p-button-rounded p-button-text p-button-success p-button-lg"
                        v-tooltip.bottom="
                          'Otvori dijalog s jednakim podatcima unosa'
                        "
                      />
                    </div>
                  </template>
                </card>
              </div>
            </div>
          </div>
        </div>
      </group-box>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, watch, inject } from "vue";
import { AmountHistoryService } from "@/services/api/amount-history-service";
import { Timestamp } from "@firebase/firestore-types";
import {
  parseCurrency,
  formatCategory,
  formatPaymentSource
} from "@/helpers/helpers";
import { format } from "date-fns";
import { TableItem } from "@/constants/table-item";

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
  amountHistoryService: AmountHistoryService;
  loading: boolean;
  account: Account;
  graphData: GraphData | null;
  totalAmount: string;
  expensesAndGains: Array<TableItem>;
  cardView: boolean;
  // eslint-disable-next-line
  refresh: any;
}

export default defineComponent({
  name: "Home",
  setup() {
    const state: State = reactive({
      refresh: inject("refresh"),
      cardView: true,
      expensesAndGains: [],
      account: {
        gyro: true,
        pocket: true,
        checking: true
      },
      currentAmount: {
        gyro: "",
        checking: "",
        pocket: ""
      },
      loading: false,
      amountHistoryService: new AmountHistoryService(),
      graphOptions: {
        legend: {
          display: true
        },
        elements: {
          line: {
            tension: 0.2
          }
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
        borderColor: "#43A047",
        backgroundColor: "rgba(67, 160, 71, 0.2)"
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
        borderColor: "#1565C0",
        backgroundColor: "rgba(21, 101, 192, 0.2)"
      };

      const pocketDataset: DatasetItem = {
        label: "Džep",
        data: [],
        fill: true,
        borderColor: "#fdd835",
        backgroundColor: "rgba(253, 216, 53, 0.2)"
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
          +(
            parseCurrency(x.gyro) +
            parseCurrency(x.pocket) +
            parseCurrency(x.checking)
          ).toFixed(2)
      );

      state.currentAmount.gyro =
        gyroDataset.data[gyroDataset.data.length - 1].toString() + "HRK";
      state.currentAmount.pocket =
        pocketDataset.data[pocketDataset.data.length - 1].toString() + "HRK";
      state.currentAmount.checking =
        checkingDataset.data[checkingDataset.data.length - 1].toString() +
        "HRK";
      state.totalAmount =
        totalDataset.data[totalDataset.data.length - 1].toString() + "HRK";

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
      state.expensesAndGains = await state.amountHistoryService.getGainsAndExpenses();
      state.loading = false;
    }

    onMounted(async () => {
      updateData();
    });

    watch([state.account, state.refresh], () => updateData());

    return { state, format, formatCategory, formatPaymentSource };
  }
});
</script>

<style>
.aside-reverse {
  position: absolute;
  right: 45px;
  top: 55px;
}
.card-bg {
  background-color: #7673731a !important;
}
.expense-text {
  color: rgb(197, 38, 38);
}
.gain-text {
  color: rgb(69, 170, 98);
}
.p-card .p-card-body {
  padding: 10px 0px 0px 0px !important;
}
.p-card .p-card-title {
  border-bottom: 1px solid var(--color-dark);
  padding-bottom: 10px;
}
.expense-description {
  color: rgb(155, 154, 154);
}
.expense-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.p-card-footer {
  border-top: 1px solid var(--color-dark);
  padding: 15px 10px 15px 10px !important;
}
.currency-change-caret {
  -webkit-animation: up-and-down 0.5s infinite alternate;
  animation: up-and-down 0.5s infinite alternate;
}
.currency-change-caret-table {
  -webkit-animation: up-and-down-table 0.5s infinite alternate;
  animation: up-and-down-table 0.5s infinite alternate;
}
@-webkit-keyframes up-and-down {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-4px);
  }
}
@keyframes up-and-down {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-4px);
  }
}
@-webkit-keyframes up-and-down-table {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-2px);
  }
}
@keyframes up-and-down-table {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-2px);
  }
}
</style>
