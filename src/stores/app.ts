import { defineStore } from "pinia";
import { setCssVar } from "quasar";
import { ref } from "vue";

export interface AppStoreState {
  createTransactionTrigger: boolean;
  accentColor: string;
}

export const useAppStore = defineStore(
  "app",
  () => {
    const createTransactionTrigger = ref(false);
    const openTransactionDialogTrigger = ref(false);
    const accentColor = ref("#f44336");

    const createTransaction = () => {
      createTransactionTrigger.value = !createTransactionTrigger.value;
    };

    const openTransactionDialog = () => {
      openTransactionDialogTrigger.value = !openTransactionDialogTrigger.value;
    };

    const changeAccentColor = (state: AppStoreState, color: string) => {
      setCssVar("accent", color);
      state.accentColor = color;
    };

    return {
      accentColor,
      createTransactionTrigger,
      createTransaction,
      changeAccentColor,
      openTransactionDialogTrigger,
      openTransactionDialog
    };
  },
  {
    persist: {
      enabled: true
    }
  }
);
