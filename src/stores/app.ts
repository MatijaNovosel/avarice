import { defineStore } from "pinia";
import { setCssVar } from "quasar";
import IAccountService from "src/api/interfaces/accountService";
import { Types, getService } from "src/di-container";
import { ref } from "vue";
import { TransactionModel } from "./../models/transaction";
import { useUserStore } from "./user";

export const useAppStore = defineStore(
  "app",
  () => {
    const userStore = useUserStore();
    const transactionsChangeNotifier = ref(false);
    const accentColor = ref("#f44336");
    const transactionEphemeral = ref<TransactionModel | null>(null);

    const transactionDialogOpen = ref(false);
    const categoryDialogOpen = ref(false);
    const accountDialogOpen = ref(false);

    const notifyTransactionChanged = async () => {
      const accounts = await getService<IAccountService>(Types.AccountService).getLatestValues();
      userStore.setAccounts(accounts);
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

    const setTransactionEphemeral = (transaction: TransactionModel) => {
      transactionEphemeral.value = transaction;
    };

    return {
      transactionEphemeral,
      accentColor,
      changeAccentColor,
      transactionDialogOpen,
      toggleTransactionDialog,
      notifyTransactionChanged,
      transactionsChangeNotifier,
      categoryDialogOpen,
      accountDialogOpen,
      toggleCategoryDialog,
      toggleAccountDialog,
      setTransactionEphemeral
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
