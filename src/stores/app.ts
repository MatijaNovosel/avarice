import { defineStore } from "pinia";
import { setCssVar } from "quasar";
import { ref } from "vue";

export const useAppStore = defineStore(
  "app",
  () => {
    const transactionsChangeNotifier = ref(false);
    const accentColor = ref("#f44336");

    const transactionDialogOpen = ref(false);
    const categoryDialogOpen = ref(false);
    const accountDialogOpen = ref(false);

    const notifyTransactionChanged = () => {
      transactionsChangeNotifier.value = !transactionsChangeNotifier.value;
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

    const changeAccentColor = (color: string) => {
      setCssVar("accent", color);
      accentColor.value = color;
    };

    return {
      accentColor,
      changeAccentColor,
      transactionDialogOpen,
      toggleTransactionDialog,
      notifyTransactionChanged,
      transactionsChangeNotifier,
      categoryDialogOpen,
      accountDialogOpen,
      toggleCategoryDialog,
      toggleAccountDialog
    };
  },
  {
    persist: {
      storage: sessionStorage,
      paths: ["accentColor"]
    }
  }
);
