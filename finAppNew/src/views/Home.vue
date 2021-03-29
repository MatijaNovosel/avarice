<template>
  <div>
    <v-skeleton-loader v-if="state.loading" type="card" />
    <v-row v-else>
      <v-col cols="12" md="4">
        <v-card>
          <v-list-item two-line>
            <v-list-item-avatar>
              <v-icon>mdi-bank</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold">
                {{
                  formatCurrencyDisplay(
                    true,
                    state.history && state.history.length != 0
                      ? state.history[state.history.length - 1].total
                      : 0,
                    "HRK"
                  )
                }}
              </v-list-item-title>
              <v-list-item-subtitle class="mt-1">
                Total amount
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-list-item two-line>
            <v-list-item-avatar>
              <v-icon>mdi-bank-transfer-in</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="green--text font-weight-bold">
                {{
                  formatCurrencyDisplay(
                    true,
                    state.recentDepositsAndWithdrawals.deposits,
                    "HRK"
                  )
                }}
              </v-list-item-title>
              <v-list-item-subtitle class="mt-1">
                Deposits (Last 30 days)
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-list-item two-line>
            <v-list-item-avatar>
              <v-icon>mdi-bank-transfer-out</v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="red--text font-weight-bold">
                {{
                  formatCurrencyDisplay(
                    true,
                    state.recentDepositsAndWithdrawals.withdrawals,
                    "HRK"
                  )
                }}
              </v-list-item-title>
              <v-list-item-subtitle class="mt-1">
                Withdrawals (Last 30 days)
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { getService, Types } from "@/di-container";
import { ITransactionService } from "@/interfaces/transactionService";
import { RecentDepositsAndWithdrawals } from "@/models/change-item";
import { FinancialHistory } from "@/models/history-item";
import { defineComponent, onMounted, reactive } from "@vue/composition-api";
import { sub } from "date-fns";
import { formatCurrencyDisplay } from "@/helpers";

interface State {
  loading: boolean;
  history: FinancialHistory[];
  recentDepositsAndWithdrawals: RecentDepositsAndWithdrawals;
}

export default defineComponent({
  name: "Home",
  setup() {
    const state: State = reactive({
      loading: false,
      history: [],
      recentDepositsAndWithdrawals: {
        deposits: 0,
        withdrawals: 0
      }
    });

    onMounted(async () => {
      state.loading = true;
      state.history = await getService<ITransactionService>(
        Types.ChangeService
      ).getTotal(1, sub(new Date(), { days: 30 }), new Date());
      state.recentDepositsAndWithdrawals = await getService<
        ITransactionService
      >(Types.ChangeService).getRecentDepositsAndWithdrawals(1);
      state.loading = false;
    });

    return { state, formatCurrencyDisplay };
  }
});
</script>
