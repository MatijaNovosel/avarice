import { defineStore } from "pinia";
import { setCssVar } from "quasar";
import { ref } from "vue";

export interface AppStoreState {
  transactionDialogOpen: boolean;
  accountDialogOpen: boolean;
  categoryDialogOpen: boolean;
  transactionCreatedTrigger: boolean;
  accentColor: string;
}

export const useAppStore = defineStore(
  "app",
  () => {
    const transactionCreatedTrigger = ref(false);
    const accentColor = ref("#f44336");

    const transactionDialogOpen = ref(false);
    const categoryDialogOpen = ref(false);
    const accountDialogOpen = ref(false);

    const notifyTransactionCreated = () => {
      transactionCreatedTrigger.value = !transactionCreatedTrigger.value;
    };

    const toggleTransactionDialog = () => {
      transactionDialogOpen.value = !transactionDialogOpen.value;
    };

    const toggleCategoryDialog = () => {
      categoryDialogOpen.value = !categoryDialogOpen.value;
    };

    const toggleAccountDialog = () => {
      accountDialogOpen.value = !accountDialogOpen.value;
    };

    const changeAccentColor = (state: AppStoreState, color: string) => {
      setCssVar("accent", color);
      state.accentColor = color;
    };

    return {
      accentColor,
      changeAccentColor,
      transactionDialogOpen,
      toggleTransactionDialog,
      notifyTransactionCreated,
      transactionCreatedTrigger,
      categoryDialogOpen,
      accountDialogOpen,
      toggleCategoryDialog,
      toggleAccountDialog
    };
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          storage: sessionStorage,
          paths: ["accentColor"]
        }
      ]
    }
  }
);
