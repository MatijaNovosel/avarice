<template>
  <div class="shadow-md bg-white px-8 flex justify-between h-24 z-50 sticky w-full top-0">
    <div
      class="flex items-center w-full"
      v-show="state.currentRoute == homeRoute"
    >
      <img
        class="h-26 w-16 rounded-full flex-none"
        :src="state.user.photoURL"
        alt=""
      />
      <div class="flex flex-col ml-4">
        <span class="text-black font-bold text-2xl">
          Good {{ state.timeOfDay }}, {{ state.user.displayName }}
        </span>
        <div class="flex items-center text-gray-400 font-bold">
          <mdi-icon
            class="mr-1"
            :size="18"
            name="check-circle"
            color="#38bf8c"
          />
          Verified account
        </div>
      </div>
    </div>
    <div class="flex items-center w-full justify-end">
      <mdi-icon
        class="cursor-pointer mr-3"
        name="bell-outline"
        color="#94a3b8"
      />
      <img
        class="inline-block h-8 w-8 rounded-full"
        :src="state.user.photoURL"
        alt=""
      />
      <div @click="openMenu" class="cursor-pointer flex p-ripple" v-ripple>
        <span class="text-black ml-4 mr-3 font-bold">
          {{ state.user.displayName }}
        </span>
        <mdi-icon
          name="chevron-down"
          color="#000000"
          aria-haspopup="true"
          aria-controls="overlayMenu"
        />
      </div>
      <p-menu
        class="rounded-md"
        id="overlayMenu"
        ref="overlayMenu"
        :model="state.menuItems"
        :popup="true"
      />
    </div>
    <transaction-dialog v-model:dialog="state.newTransactionDialog" />
    <transfer-dialog v-model:dialog="state.transferDialog" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, ref, Ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { getService, Types } from "@/di-container";
import { IAuthService } from "@/services/interfaces/auth-service";
import mdiIcon from "./mdi-icon.vue";
import TransactionDialog from "@/components/transaction-dialog.vue";
import TransferDialog from "@/components/transfer-dialog.vue";
import { RouteNames } from "@/constants/route-names";
import { MenuItem } from "@/models/menu-item";

interface MenuNode {
  toggle: Function;
}

interface State {
  newTransactionDialog: boolean;
  transferDialog: boolean;
  currentRoute: string | symbol | null | undefined;
  timeOfDay: string;
  menuItems: MenuItem[];
}

export default defineComponent({
  components: { mdiIcon, TransactionDialog, TransferDialog },
  name: "navbar",
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const state: State = reactive({
      menuItems: [
        {
          label: "New transaction",
          command: () => {
            state.newTransactionDialog = true;
          }
        },
        {
          separator: true
        },
        {
          label: "New transfer",
          command: () => {
            state.transferDialog = true;
          }
        },
        {
          separator: true
        },
        {
          label: "Log out",
          command: () => {
            store.dispatch("unsetUser");
            router.push({ name: RouteNames.LOGIN });
          }
        }
      ],
      newTransactionDialog: false,
      transferDialog: false,
      currentRoute: computed(() => route.name),
      user: computed(() => store.getters.user),
      timeOfDay: computed(() => {
        const hours = new Date().getHours();
        const minutes = new Date().getMinutes();
        if (hours >= 6 && hours <= 11 && minutes <= 59) {
          return "Morning";
        } else if (hours >= 12 && hours <= 17) {
          return "Afternoon";
        } else {
          return "Evening";
        }
      })
    });

    const overlayMenu: Ref<MenuNode | null> = ref(null);

    async function logout() {
      await getService<IAuthService>(Types.AuthService).signOut();
      store.dispatch("unsetUser");
      router.push({ name: "login" });
    }

    function openMenu(event: Event) {
      overlayMenu?.value?.toggle(event);
    }

    const accountsRoute = RouteNames.ACCOUNTS;
    const homeRoute = RouteNames.HOME;

    return {
      state,
      logout,
      store,
      accountsRoute,
      openMenu,
      overlayMenu,
      homeRoute
    };
  }
});
</script>
