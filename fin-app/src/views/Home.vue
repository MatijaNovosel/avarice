<template>
  <div class="p-grid p-nogutter p-justify-center">
    <div
      class="p-col-12 p-md-4 p-px-4 p-pl-md-4 p-pr-md-0 p-pb-5 p-pb-md-0 amount-cards-container"
    >
      <dashboard-amount-card
        v-for="paymentSource in state.paymentSources"
        :key="paymentSource.id"
        :icon="paymentSource.icon"
        :title="paymentSource.description"
        :loading="state.loading"
        :color="'#ff8a00'"
        :amount="paymentSource.currentAmount"
        :amount-visible="paymentSource.visible"
        :currency="'HRK'"
        v-model:enabled="state.account.gyro"
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
                <div class="filter-container">
                  <list-box
                    :multiple="true"
                    v-model="state.filter.tag"
                    :options="tags"
                    dataKey="val"
                    listStyle="max-height: 250px"
                    optionValue="val"
                    optionLabel="text"
                  >
                    <template #option="slotProps">
                      {{ slotProps.option.text }}
                    </template>
                  </list-box>
                  <div class="filter-actions">
                    <mdi-icon
                      class="cursor-pointer eye-btn-visible"
                      @click="
                        state.changeAmountVisible = !state.changeAmountVisible
                      "
                      :size="20"
                      :name="state.changeAmountVisible ? 'eye' : 'eye-off'"
                      v-tooltip="'Prikaži vrijednosti'"
                    />
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
                :key="change.id"
              >
                <change-card
                  :expense="change.expense"
                  :title="change.description"
                  :amount="change.amount"
                  :tags="change.tagIds"
                  :date="change.createdAt"
                  :show="state.changeAmountVisible"
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
import {
  formatTag,
  formatPaymentSource,
  hexToRgba,
  adjustHexColor
} from "../helpers/helpers";
import { format } from "date-fns";
import { DatasetItem } from "../models/dataset";
import { createSelectFromEnum } from "../helpers/helpers";
import { UserSettings } from "../models/user-settings";
import { TagEnum } from "../constants/tag-enum";
import { FinancialChangeItem } from "../models/change-item";
import { Account } from "../models/account";
import DashboardAmountCard from "@/components/dashboard-amount-card.vue";
import ChangeCard from "../components/change-card.vue";
import { getService, Types } from "../di-container";
import { IChangeService } from "../services/interfaces/change-service";
import { ISettingsService } from "../services/interfaces/settings-service";
import MdiIcon from "../components/mdi-icon.vue";
import { GraphOptions } from "@/models/graph";
import { IPaymentSourceService } from "@/services/interfaces/payment-source-service";
import { PaymentSource } from "@/models/payment-source";

interface Filter {
  tag: TagEnum[];
}

interface GraphData {
  labels: string[];
  datasets: DatasetItem[];
}

interface PaginatorInfo {
  page: number;
  first: number;
  rows: number;
  pageCount: number;
}

interface AmountVisible {
  gyro: boolean;
  checking: boolean;
  pocket: boolean;
  euros: boolean;
  total: boolean;
}

interface State {
  loading: boolean;
  changesLoading: boolean;
  account: Account;
  graphData: GraphData | null;
  totalAmount: string;
  changes: FinancialChangeItem[];
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
  dataSets: DatasetItem[];
  graphValuesVisible: boolean;
  graphOptions: GraphOptions;
  changeAmountVisible: boolean;
  paymentSources: PaymentSource[];
}

export default defineComponent({
  name: "Home",
  components: {
    DashboardAmountCard,
    ChangeCard,
    MdiIcon
  },
  setup() {
    // eslint-disable-next-line
    const graph: any = ref(null);

    const state: State = reactive({
      paymentSources: [],
      changeAmountVisible: false,
      graphValuesVisible: false,
      dataSets: [],
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
        checkingGraphColor: "#383737",
        checkingGraphVisible: false
      },
      account: {
        gyro: true,
        pocket: true,
        checking: true
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

    async function getChanges(skip?: number, take?: number) {
      state.changesLoading = true;

      const itemCollection = await getService<IChangeService>(
        Types.ChangeService
      ).getChanges(1, skip, take);

      state.changes = itemCollection.items;
      state.changesTotalItems = itemCollection.count;
      state.changesNumberOfPages = Math.floor(
        state.changesTotalItems / state.numberOfRows
      );

      state.changesLoading = false;
    }

    function resetFilter() {
      state.filter.tag = [];
      getChanges();
    }

    function updateGraph() {
      graph.value.reinit();
    }

    async function updateData() {
      state.loading = true;
      getChanges(0, state.numberOfRows);

      state.paymentSources = await getService<IPaymentSourceService>(
        Types.PaymentSourceService
      ).getAllByUserId(1);

      const history = await getService<IChangeService>(
        Types.ChangeService
      ).getHistory(1);

      state.settings = await getService<ISettingsService>(
        Types.SettingsService
      ).getSettings(1);

      state.paymentSources.forEach((x) => {
        x.currentAmount = history[history.length - 1].paymentSources.filter(
          (z) => z.id == x.id
        )[0].amount;
        x.visible = false;
        state.dataSets.push({
          label: x.description,
          data: history
            .map((y) => y.paymentSources.filter((z) => z.id == x.id)[0])
            .map((y) => y.amount),
          fill: true,
          borderColor: "#ff8a00",
          backgroundColor: hexToRgba(
            adjustHexColor("#ff8a00".replace("#", ""), -10),
            0.4
          ) as string
        });
      });

      state.paymentSources.push({
        id: -1,
        description: "Total",
        currency: "HRK",
        icon: "sigma",
        visible: false,
        currentAmount: history[history.length - 1].total
      });

      state.dataSets.push({
        label: "Total",
        data: history.map((x) => x.total),
        fill: true,
        borderColor: "#ff8a00",
        backgroundColor: hexToRgba(
          adjustHexColor("#ff8a00".replace("#", ""), -10),
          0.4
        ) as string
      });

      state.graphData = {
        labels: history.map((x) => x.createdAt),
        datasets: state.dataSets
      };

      updateGraph();

      state.loading = false;
    }

    function pageChanged(paginationInfo: PaginatorInfo) {
      const { page, rows } = { ...paginationInfo };
      getChanges(page * rows, state.numberOfRows);
    }

    function changeGraphVisibility() {
      state.graphValuesVisible = !state.graphValuesVisible;
      state.graphOptions.scales.yAxes[0].display = state.graphValuesVisible;
      updateGraph();
    }

    onMounted(async () => {
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

    const tags = createSelectFromEnum(TagEnum, "tag");

    return {
      state,
      format,
      formatTag,
      formatPaymentSource,
      tags,
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

.p-accordion-header-link
  background-color: rgba(255, 255, 255, 0.04) !important
  z-index: 0 !important

.p-paginator
  justify-content: center !important

.p-dataview .p-dataview-content
  padding: 0px !important

.filter-container
  display: flex
  flex-direction: column
  padding: 1.4em 0 0 0

.filter-actions
  padding: 1.4em 0 0.8em 0
  display: flex
  flex-direction: row
  justify-content: flex-end

.eye-btn-visible
  align-self: center
  margin-right: 1em
</style>
