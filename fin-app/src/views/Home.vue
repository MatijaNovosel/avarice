<template>
  <div class="p-grid p-mt-5 p-nogutter p-justify-center">
    <div
      class="p-col-12 p-md-4 p-px-4 p-pl-md-4 p-pr-md-0 p-pb-5 p-pb-md-0 amount-cards-container"
    >
      <dashboard-amount-card
        icon="id-card"
        title="Žiro račun"
        :loading="state.loading"
        :color="`#${state.settings.gyroColor}`"
        :amount="state.currentAmount.gyro"
        v-model:enabled="state.account.gyro"
      />
      <dashboard-amount-card
        icon="dollar"
        title="Tekući račun"
        :loading="state.loading"
        :color="`#${state.settings.checkingColor}`"
        :amount="state.currentAmount.checking"
        v-model:enabled="state.account.checking"
      />
      <dashboard-amount-card
        icon="briefcase"
        title="Džep"
        :loading="state.loading"
        :color="`#${state.settings.pocketColor}`"
        :amount="state.currentAmount.pocket"
        v-model:enabled="state.account.pocket"
      />
      <dashboard-amount-card
        icon="globe"
        title="Euri"
        :loading="state.loading"
        :color="`#${state.settings.totalColor}`"
        :amount="state.currentAmount.euros"
        no-checkbox
      />
      <dashboard-amount-card
        icon="table"
        title="Ukupno"
        :loading="state.loading"
        :color="`#${state.settings.totalColor}`"
        :amount="state.totalAmount"
        no-checkbox
      />
    </div>
    <div class="p-col-12 p-md-8 p-px-5">
      <div class="p-shadow-6 chart-container">
        <chart
          type="line"
          :data="state.graphData"
          :options="state.graphOptions"
        />
      </div>
    </div>
    <div class="p-col-12 p-pl-4 p-pr-5 p-mt-5">
      <div class="p-shadow-6 changes-container">
        <div class="p-grid">
          <div class="p-col-12 p-px-3">
            <accordion>
              <accordion-tab>
                <template #header>
                  <icon class="p-pr-3" name="filter" />
                  <span>Filtriranje i ostale mogućnosti</span>
                </template>
                <div class="p-grid">
                  <div class="p-col-12 p-mt-2 filter-item-text">
                    <icon name="tags" /> Kategorija
                  </div>
                  <div class="p-col-12 p-my-2">
                    <list-box
                      :multiple="true"
                      v-model="state.filter.category"
                      :options="categories"
                      dataKey="val"
                      listStyle="max-height: 250px"
                      optionValue="val"
                      optionLabel="text"
                    >
                      <template #option="slotProps">
                        {{ slotProps.option.text }}
                      </template>
                    </list-box>
                  </div>
                  <div class="p-col-12 p-my-2">
                    <input-switch v-model="state.cardView" id="input-switch" />
                    <label for="input-switch"> Prikaz u obliku kartica</label>
                  </div>
                  <div class="p-col-12 p-mt-3 p-text-right">
                    <btn
                      @click="resetFilter"
                      label="Poništi filtriranje"
                      icon="pi pi-ban"
                      class="p-button-raised p-button-danger"
                    />
                    <btn
                      @click="getChanges"
                      label="Filtriraj"
                      icon="pi pi-filter"
                      class="p-button-raised p-button-info p-ml-3"
                    />
                  </div>
                </div>
              </accordion-tab>
            </accordion>
          </div>
          <div class="p-col-12" v-if="!state.cardView">
            <data-table
              :value="state.changes"
              :paginator="true"
              :rows="10"
              :rowHover="true"
              class="p-datatable-striped p-datatable-sm"
              :loading="state.changesLoading"
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
                    >{{ `${slotProps.data.amount}HRK` }}
                    <i
                      class="pi currency-change-caret-table p-ml-1"
                      :class="{
                        'pi-caret-up': !slotProps.data.expense,
                        'pi-caret-down': slotProps.data.expense
                      }"
                      style="font-size: 1rem"
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
                  {{ formatCategory(slotProps.data.category) }}
                </template>
              </column>
              <column field="date" header="Datum">
                <template #body="slotProps">
                  {{ format(slotProps.data.date, "dd/MM/yyyy - HH:mm") }}
                </template>
              </column>
            </data-table>
          </div>
          <div class="p-col-12" v-else>
            <div
              class="p-grid p-justify-center p-my-6"
              v-if="state.changesLoading"
            >
              <progress-spinner
                strokeWidth="10"
                style="height: 100px; width: 100px"
              />
            </div>
            <data-view
              v-else
              layout="grid"
              :paginator="true"
              :rows="9"
              :value="state.changes"
              paginatorPosition="bottom"
            >
              <template #grid="slotProps">
                <div class="p-col-12 p-md-4">
                  <card class="p-shadow-6 amount-card">
                    <template #title>
                      <div class="expense-title p-px-3">
                        <span
                          :class="{
                            'expense-text': slotProps.data.expense,
                            'gain-text': !slotProps.data.expense
                          }"
                          >{{ `${slotProps.data.amount}HRK` }}
                          <i
                            class="pi currency-change-caret p-ml-1"
                            :class="{
                              'pi-caret-up': !slotProps.data.expense,
                              'pi-caret-down': slotProps.data.expense
                            }"
                            style="font-size: 1rem"
                          />
                        </span>
                        <span class="expense-description">{{
                          formatCategory(slotProps.data.category)
                        }}</span>
                      </div>
                    </template>
                    <template #content>
                      <div class="p-grid p-px-3">
                        <div class="p-col-12">
                          {{ format(slotProps.data.date, "dd.MM.yyyy. HH:mm") }}
                        </div>
                        <div class="p-col-12">
                          <span class="expense-description">{{
                            slotProps.data.description
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
              </template>
            </data-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, watch, inject } from "vue";
import { AmountHistoryService } from "@/services/api/amount-history-service";
import { formatCategory, formatPaymentSource } from "@/helpers/helpers";
import { format } from "date-fns";
import { DatasetItem } from "@/models/dataset";
import { UserSettingsService } from "@/services/api/user-settings-service";
import {
  hexToRGBA,
  adjustHexColor,
  createSelectFromEnum
} from "@/helpers/helpers";
import { UserSettings } from "@/models/user-settings";
import { euroRate } from "@/constants/app-constants";
import { CategoryEnum } from "@/constants/category-enum";
import { ChangeItem } from "@/models/change-item";
import DashboardAmountCard from "@/components/dashboard-amount-card.vue";
import { useI18n } from "vue-i18n";

interface ChangeFilterOptions {
  category: CategoryEnum[];
}

interface Filter {
  category: CategoryEnum[];
  amountRange: number[];
}

interface GraphData {
  labels: string[];
  datasets: DatasetItem[];
}

interface CurrentAmount {
  gyro: string;
  checking: string;
  pocket: string;
  euros: string;
}

interface Account {
  gyro: boolean;
  pocket: boolean;
  checking: boolean;
}

interface State {
  currentAmount: CurrentAmount;
  amountHistoryService: AmountHistoryService;
  loading: boolean;
  changesLoading: boolean;
  account: Account;
  graphData: GraphData | null;
  totalAmount: string;
  changes: ChangeItem[];
  cardView: boolean;
  // eslint-disable-next-line
  refresh: any;
  userSettingsService: UserSettingsService;
  settings: UserSettings;
  filter: Filter;
  maxValue: number;
  entry: number;
}

export default defineComponent({
  name: "Home",
  components: {
    DashboardAmountCard
  },
  setup() {
    const { t } = useI18n();

    const state: State = reactive({
      entry: 0,
      refresh: inject("refresh"),
      cardView: true,
      changes: [],
      maxValue: 0,
      filter: {
        category: [],
        amountRange: [1, 9999]
      },
      settings: {
        gyroColor: "",
        checkingColor: "",
        totalColor: "",
        pocketColor: ""
      },
      account: {
        gyro: true,
        pocket: true,
        checking: true
      },
      currentAmount: {
        gyro: "",
        checking: "",
        pocket: "",
        euros: ""
      },
      loading: false,
      changesLoading: false,
      amountHistoryService: new AmountHistoryService(),
      graphOptions: {
        legend: {
          display: true
        },
        elements: {
          line: {
            tension: 0.2
          }
        },
        responsive: true,
        chartArea: {
          backgroundColor: "rgba(251, 85, 85, 0.4)"
        }
      },
      graphData: null,
      totalAmount: "0,00HRK",
      userSettingsService: new UserSettingsService()
    });

    async function getChanges() {
      state.changesLoading = true;

      state.changes = await state.amountHistoryService.getChanges(state.filter);
      state.filter.amountRange[1] = state.maxValue = JSON.parse(
        JSON.stringify(state.changes)
      )
        .filter((x: ChangeItem) => x.expense == true)
        .sort((a: ChangeItem, b: ChangeItem) => b.amount - a.amount)[0].amount;

      state.changesLoading = false;
    }

    function resetFilter() {
      state.filter.category = [];
      getChanges();
    }

    async function updateData() {
      state.loading = true;
      getChanges();

      const history = await (state.amountHistoryService as AmountHistoryService).getHistory();
      state.settings = await state.userSettingsService.getSettings();

      const totalDataset: DatasetItem = {
        label: "Ukupno",
        data: [],
        fill: true,
        borderColor: `#${state.settings.totalColor}`,
        backgroundColor: hexToRGBA(
          adjustHexColor(state.settings.totalColor, -10),
          0.4
        )
      };

      const gyroDataset: DatasetItem = {
        label: "Žiro račun",
        data: [],
        fill: true,
        borderColor: `#${state.settings.gyroColor}`,
        backgroundColor: hexToRGBA(
          adjustHexColor(state.settings.gyroColor, -10),
          0.4
        )
      };

      const checkingDataset: DatasetItem = {
        label: "Tekući račun",
        data: [],
        fill: true,
        borderColor: `#${state.settings.checkingColor}`,
        backgroundColor: hexToRGBA(
          adjustHexColor(state.settings.checkingColor, -10),
          0.4
        )
      };

      const pocketDataset: DatasetItem = {
        label: t("account.pocket"),
        data: [],
        fill: true,
        borderColor: `#${state.settings.pocketColor}`,
        backgroundColor: hexToRGBA(
          adjustHexColor(state.settings.pocketColor, -10),
          0.4
        )
      };

      const graphData: GraphData = {
        labels: history.map((x) =>
          format(x.date.toDate(), "dd/MM/yyyy - HH:mm")
        ),
        datasets: []
      };

      gyroDataset.data = history.map((x) => +x.gyro.toFixed(2));
      pocketDataset.data = history.map((x) => +x.pocket.toFixed(2));
      checkingDataset.data = history.map((x) => +x.checking.toFixed(2));
      totalDataset.data = history.map(
        (x) =>
          +(
            x.gyro +
            x.pocket +
            x.checking +
            ((x.euros as number) * euroRate || 0)
          ).toFixed(2)
      );

      state.currentAmount.gyro = `${
        gyroDataset.data[gyroDataset.data.length - 1]
      }HRK`;
      state.currentAmount.pocket = `${
        pocketDataset.data[pocketDataset.data.length - 1]
      }HRK`;
      state.currentAmount.checking = `${
        checkingDataset.data[checkingDataset.data.length - 1]
      }HRK`;
      state.currentAmount.euros = `${history[history.length - 1].euros}€`;

      state.totalAmount = `${
        totalDataset.data[totalDataset.data.length - 1]
      }HRK`;

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
      updateData();
    });

    watch([state.account, state.refresh], () => updateData());

    const categories = createSelectFromEnum(CategoryEnum, "category");

    return {
      state,
      format,
      formatCategory,
      formatPaymentSource,
      categories,
      resetFilter,
      getChanges
    };
  }
});
</script>

<style>
.aside-reverse {
  position: absolute;
  right: 45px;
  top: 55px;
}
.amount-card {
  background-color: #7673731a !important;
  border-radius: 12px !important;
  margin: 0.5em;
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
.amount-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, 100%);
  grid-gap: 1.5em;
}
.changes-container {
  padding: 1.5rem;
  background-color: #1e1e1e;
  border-radius: 12px;
}
.chart-container {
  padding: 2rem;
  background-color: #1e1e1e;
  border-radius: 12px;
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
.p-accordion-header-link {
  background-color: rgba(255, 255, 255, 0.04) !important;
  z-index: 0 !important;
}
.p-paginator {
  justify-content: center !important;
}
.filter-item-text {
  color: #b6b3b3;
  font-size: 14px;
}
.filter-divider {
  border-bottom: 1px solid var(--color-dark);
}
.spinner-accounts {
  width: 25px !important;
  height: 25px !important;
}
.p-dataview .p-dataview-content {
  padding: 0px !important;
}
</style>
