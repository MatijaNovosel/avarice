<template>
  <div class="p-grid p-nogutter p-justify-center">
    <div
      class="p-col-12 p-md-4 p-px-4 p-pl-md-4 p-pr-md-0 p-pb-5 p-pb-md-0 amount-cards-container"
    >
      <dashboard-amount-card
        icon="credit-card-outline"
        :title="$t('account.gyro')"
        :loading="state.loading"
        :color="`#${state.settings.gyroColor}`"
        :amount="state.currentAmount.gyro"
        :amount-visible="state.amountVisible.gyro"
        v-model:enabled="state.account.gyro"
      />
      <dashboard-amount-card
        icon="credit-card"
        :title="$t('account.checking')"
        :loading="state.loading"
        :color="`#${state.settings.checkingColor}`"
        :amount="state.currentAmount.checking"
        :amount-visible="state.amountVisible.checking"
        v-model:enabled="state.account.checking"
      />
      <dashboard-amount-card
        icon="wallet"
        :title="$t('account.pocket')"
        :loading="state.loading"
        :color="`#${state.settings.pocketColor}`"
        :amount="state.currentAmount.pocket"
        :amount-visible="state.amountVisible.pocket"
        v-model:enabled="state.account.pocket"
      />
      <dashboard-amount-card
        icon="currency-eur"
        :title="$t('account.euros')"
        :loading="state.loading"
        :color="`#${state.settings.totalColor}`"
        :amount="state.currentAmount.euros"
        :amount-visible="state.amountVisible.euros"
        no-enabling
      />
      <dashboard-amount-card
        icon="sigma"
        :title="$t('account.total')"
        :loading="state.loading"
        :color="`#${state.settings.totalColor}`"
        :amount="state.totalAmount"
        :amount-visible="state.amountVisible.total"
        no-enabling
      />
    </div>
    <div class="p-col-12 p-md-8 p-px-5">
      <div class="p-shadow-6 chart-container">
        <div class="month-select-container">
          <mdi-icon
            class="p-mr-3 cursor-pointer"
            @click="changeGraphVisibility"
            :size="20"
            :name="state.graphValuesVisible ? 'eye' : 'eye-off'"
            v-tooltip="'Prikaži vrijednosti'"
          />
          <div v-ripple class="p-ripple month-select-item cursor-pointer">
            {{ $t("months.november") }}
          </div>
          <div v-ripple class="p-ripple month-select-item cursor-pointer">
            {{ $t("months.december") }}
          </div>
        </div>
        <chart
          ref="graph"
          type="line"
          :data="state.graphData"
          :options="state.graphOptions"
        />
      </div>
    </div>
    <div class="p-col-12 p-pl-4 p-pr-5 p-mt-5">
      <div class="p-shadow-6 changes-container">
        <div class="p-grid">
          <div class="p-col-12 p-mb-5">
            <accordion>
              <accordion-tab>
                <template #header>
                  <icon class="p-pr-3" name="filter" />
                  <span>{{ $t("filterAndOtherOptions") }}</span>
                </template>
                <div class="p-grid">
                  <div class="p-col-12 p-mt-2 filter-item-text">
                    {{ $t("tag") }}
                  </div>
                  <div class="p-col-12 p-my-2">
                    <list-box
                      :multiple="true"
                      v-model="state.filter.tag"
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
                  <div class="p-col-12 p-mt-3 p-text-right">
                    <btn
                      @click="resetFilter"
                      :label="$t('removeFilter')"
                      icon="pi pi-ban"
                      class="p-button-raised p-button-danger"
                    />
                    <btn
                      @click="getChanges"
                      :label="$t('filter')"
                      icon="pi pi-filter"
                      class="p-button-raised p-button-info p-ml-3"
                    />
                  </div>
                </div>
              </accordion-tab>
            </accordion>
          </div>
          <div class="p-col-12">
            <div
              class="p-grid p-justify-center p-my-6"
              v-if="state.changesLoading"
            >
              <progress-spinner
                strokeWidth="10"
                style="height: 100px; width: 100px"
              />
            </div>
            <div v-else class="p-grid">
              <div
                class="p-col-12 p-md-3 p-p-2"
                v-for="change in state.changes"
                :key="change.uid"
              >
                <change-card
                  :expense="change.expense"
                  :title="change.description"
                  :amount="change.amount"
                  :tags="change.tags"
                  :date="format(change.date, 'dd/MM/yyyy - HH:mm')"
                  :show="false"
                />
              </div>
              <div class="p-col-12 p-mt-5">
                <paginator
                  v-model:first="state.changesOffset"
                  v-model:rows="state.numberOfRows"
                  :totalRecords="state.changesTotalItems"
                  :rowsPerPageOptions="[16, 32]"
                  :pageLinkSize="state.changesNumberOfPages"
                  @page="pageChanged"
                  :alwaysShow="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, inject, ref, onMounted } from "vue";
import { formatTag, formatPaymentSource } from "../helpers/helpers";
import { format } from "date-fns";
import { DatasetItem } from "../models/dataset";
import {
  hexToRgba,
  adjustHexColor,
  createSelectFromEnum
} from "../helpers/helpers";
import { UserSettings } from "../models/user-settings";
import { euroRate } from "../constants/app-constants";
import { TagEnum } from "../constants/tag-enum";
import { ChangeItem } from "../models/change-item";
import { useI18n } from "vue-i18n";
import { Account } from "../models/account";
import DashboardAmountCard from "@/components/dashboard-amount-card.vue";
import ChangeCard from "../components/change-card.vue";
import { getService, Types } from "../di-container";
import { IChangeService } from "../services/interfaces/change-service";
import { ISettingsService } from "../services/interfaces/settings-service";
import MdiIcon from "../components/mdi-icon.vue";

interface Filter {
  tag: TagEnum[];
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

interface PaginatorInfo {
  page: number;
  first: number;
  rows: number;
  pageCount: number;
}

interface DataSets {
  gyro: DatasetItem | null;
  checking: DatasetItem | null;
  pocket: DatasetItem | null;
  total: DatasetItem | null;
}

interface AmountVisible {
  gyro: boolean;
  checking: boolean;
  pocket: boolean;
  euros: boolean;
  total: boolean;
}

interface GraphLineOptions {
  tension: number;
}

interface GraphElementsOptions {
  line: GraphLineOptions;
}

interface GraphLegendOptions {
  display: boolean;
}

interface GraphYAxesOptions {
  display: boolean;
}

interface GraphScalesOptions {
  yAxes: GraphYAxesOptions[];
}

interface GraphOptions {
  scales: GraphScalesOptions;
  legend: GraphLegendOptions;
  responsive: boolean;
}

interface State {
  currentAmount: CurrentAmount;
  loading: boolean;
  changesLoading: boolean;
  account: Account;
  graphData: GraphData | null;
  totalAmount: string;
  changes: ChangeItem[];
  baseChanges: ChangeItem[];
  // eslint-disable-next-line
  refresh: any;
  settings: UserSettings;
  filter: Filter;
  maxValue: number;
  entry: number;
  changesNumberOfPages: number;
  changesTotalItems: number;
  numberOfRows: number;
  changesOffset: number;
  amountVisible: AmountVisible;
  dataSets: DataSets;
  graphValuesVisible: boolean;
  graphOptions: GraphOptions;
}

export default defineComponent({
  name: "Home",
  components: {
    DashboardAmountCard,
    ChangeCard,
    MdiIcon
  },
  setup() {
    const { t } = useI18n();
    // eslint-disable-next-line
    const graph: any = ref(null);

    const state: State = reactive({
      graphValuesVisible: false,
      dataSets: {
        gyro: null,
        checking: null,
        pocket: null,
        total: null
      },
      amountVisible: {
        gyro: false,
        checking: false,
        pocket: false,
        euros: true,
        total: false
      },
      entry: 0,
      changesNumberOfPages: 0,
      changesOffset: 0,
      changesTotalItems: 0,
      numberOfRows: 16,
      refresh: inject("refresh"),
      changes: [],
      baseChanges: [],
      maxValue: 0,
      filter: {
        tag: []
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
      graphOptions: {
        scales: {
          yAxes: [
            {
              display: false
            }
          ]
        },
        legend: {
          display: true
        },
        elements: {
          line: {
            tension: 0.3
          }
        },
        responsive: true
      },
      graphData: null,
      totalAmount: "0,00HRK"
    });

    async function getChanges() {
      state.changesLoading = true;
      state.baseChanges = await getService<IChangeService>(
        Types.ChangeService
      ).getChanges(state.filter);
      state.changes = state.baseChanges.slice(0, state.numberOfRows);
      state.changesTotalItems = state.baseChanges.length;
      state.changesNumberOfPages = Math.floor(
        state.baseChanges.length / state.numberOfRows
      );
      state.changesLoading = false;
    }

    function resetFilter() {
      state.filter.tag = [];
      getChanges();
    }

    function updateGraph() {
      const dataSets: DatasetItem[] = [];

      if (
        state.account.gyro &&
        state.account.pocket &&
        state.account.checking
      ) {
        dataSets.push(state.dataSets.total as DatasetItem);
      } else {
        if (state.account.gyro) {
          dataSets.push(state.dataSets.gyro as DatasetItem);
        }
        if (state.account.pocket) {
          dataSets.push(state.dataSets.pocket as DatasetItem);
        }
        if (state.account.checking) {
          dataSets.push(state.dataSets.checking as DatasetItem);
        }
      }

      (state.graphData as GraphData).datasets = dataSets;
      graph.value.reinit();
    }

    async function updateData() {
      state.loading = true;
      getChanges();

      const history = await getService<IChangeService>(
        Types.ChangeService
      ).getHistory();

      state.settings = await getService<ISettingsService>(
        Types.SettingsService
      ).getSettings();

      state.dataSets.total = {
        label: t("account.total"),
        data: history.map(
          (x) =>
            +(
              x.gyro +
              x.pocket +
              x.checking +
              ((x.euros as number) * euroRate || 0)
            ).toFixed(2)
        ),
        fill: true,
        borderColor: `#${state.settings.totalColor}`,
        backgroundColor: hexToRgba(
          adjustHexColor(state.settings.totalColor, -10),
          0.4
        ) as string
      };

      state.dataSets.gyro = {
        label: t("account.gyro"),
        data: history.map((x) => +x.gyro.toFixed(2)),
        fill: true,
        borderColor: `#${state.settings.gyroColor}`,
        backgroundColor: hexToRgba(
          adjustHexColor(state.settings.gyroColor, -10),
          0.4
        ) as string
      };

      state.dataSets.checking = {
        label: t("account.checking"),
        data: history.map((x) => +x.checking.toFixed(2)),
        fill: true,
        borderColor: `#${state.settings.checkingColor}`,
        backgroundColor: hexToRgba(
          adjustHexColor(state.settings.checkingColor, -10),
          0.4
        ) as string
      };

      state.dataSets.pocket = {
        label: t("account.pocket"),
        data: history.map((x) => +x.pocket.toFixed(2)),
        fill: true,
        borderColor: `#${state.settings.pocketColor}`,
        backgroundColor: hexToRgba(
          adjustHexColor(state.settings.pocketColor, -10),
          0.4
        ) as string
      };

      state.graphData = {
        labels: history.map((x) =>
          format(x.date.toDate(), "dd/MM/yyyy - HH:mm")
        ),
        datasets: []
      };

      state.currentAmount.gyro = `${
        state.dataSets.gyro.data[state.dataSets.gyro.data.length - 1]
      }HRK`;
      state.currentAmount.pocket = `${
        state.dataSets.pocket.data[state.dataSets.pocket.data.length - 1]
      }HRK`;
      state.currentAmount.checking = `${
        state.dataSets.checking.data[state.dataSets.checking.data.length - 1]
      }HRK`;
      state.currentAmount.euros = `${history[history.length - 1].euros}€`;

      state.totalAmount = `${
        state.dataSets.total.data[state.dataSets.total.data.length - 1]
      }HRK`;

      updateGraph();

      state.loading = false;
    }

    function pageChanged(paginationInfo: PaginatorInfo) {
      const { page, first, rows } = { ...paginationInfo };
      state.changes = state.baseChanges.slice(page * rows, first + rows);
    }

    function changeGraphVisibility() {
      state.graphValuesVisible = !state.graphValuesVisible;
      state.graphOptions.scales.yAxes[0].display = state.graphValuesVisible;
      updateGraph();
    }

    onMounted(async () => {
      // await getService<IChangeService>(Types.ChangeService).function();
      updateData();
    });

    watch(
      () => state.account,
      () => updateGraph(),
      { deep: true }
    );

    watch(
      () => state.refresh,
      () => updateData(),
      { deep: true }
    );

    const categories = createSelectFromEnum(TagEnum, "tag");

    return {
      state,
      format,
      formatTag,
      formatPaymentSource,
      categories,
      resetFilter,
      getChanges,
      pageChanged,
      graph,
      changeGraphVisibility
    };
  }
});
</script>

<style lang="sass">
@use "../assets/css/variables"
@import "../assets/css/helpers"

.amount-card
  background-color: #7673731a !important
  border-radius: 12px !important
  margin: 0.5em

.expense-text
  color: rgb(197, 38, 38)

.gain-text
  color: rgb(69, 170, 98)

.p-card .p-card-title
  border-bottom: 1px solid variables.$color-dark
  padding-bottom: 10px

.expense-description
  color: rgb(155, 154, 154)

.expense-title
  display: flex
  flex-direction: row
  justify-content: space-between

.currency-change-caret
  animation: up-and-down 0.5s infinite alternate

  &-table
    animation: up-and-down-table 0.5s infinite alternate

.amount-cards-container
  display: grid
  grid-template-columns: repeat(auto-fit, 100%)
  grid-gap: 1.5em

.changes-container
  padding: 1.5rem
  background-color: #1e1e1e
  border-radius: 12px

.chart-container
  padding: 2rem
  background-color: #1e1e1e
  border-radius: 12px
  display: flex
  flex-direction: column

.month-select-container
  display: flex
  align-items: center

.month-select-item
  font-size: 0.8em
  margin: 0.2em 0.5em
  padding: 1.2em
  background-color: #191515
  border-radius: 12px
  color: white
  font-family: "ProximaNovaBold" !important
  user-select: none

@keyframes up-and-down-table
  0%
    transform: translateY(0)
  100%
    transform: translateY(-2px)

.p-accordion-header-link
  background-color: rgba(255, 255, 255, 0.04) !important
  z-index: 0 !important

.p-paginator
  justify-content: center !important

.filter-item-text
  color: #b6b3b3
  font-size: 14px

.filter-divider
  border-bottom: 1px solid variables.$color-dark

.spinner-accounts
  width: 25px !important
  height: 25px !important

.p-dataview .p-dataview-content
  padding: 0px !important
</style>
