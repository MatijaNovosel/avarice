import { AccountModel, CategoryModel } from "@/api/client";
import { defineStore } from "pinia";
import { AppUser } from "src/models/user";
import { computed, ref } from "vue";

export const useUserStore = defineStore(
  "user",
  () => {
    const data = ref<AppUser | null>(null);
    const categories = ref<CategoryModel[]>([]);
    const accounts = ref<AccountModel[]>([]);
    const selectedAccount = ref<AccountModel | null>(null);

    const totalBalance = computed(() => {
      if (accounts.value) {
        return accounts.value.map((a) => a.balance).reduce((prev, curr) => prev + curr, 0);
      }
      return 0;
    });

    const isAuthenticated = computed(() => data.value != null);

    const logout = () => {
      data.value = null;
    };

    const setCategories = (payload: CategoryModel[]) => {
      categories.value = payload;
    };

    const setSelectedAccount = (payload: AccountModel) => {
      selectedAccount.value = payload;
    };

    const setAccounts = (payload: AccountModel[]) => {
      accounts.value = payload;
    };

    const login = (payload: AppUser) => {
      data.value = payload;
    };

    return {
      data,
      categories,
      accounts,
      isAuthenticated,
      logout,
      setCategories,
      setAccounts,
      login,
      totalBalance,
      selectedAccount,
      setSelectedAccount
    };
  },
  {
    persist: true
  }
);
