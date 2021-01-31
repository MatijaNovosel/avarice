<template>
  <div
    class="shadow-md bg-white px-8 flex justify-between h-24 z-50 sticky w-full top-0 rounded-bl-2xl"
  >
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
    <div class="flex items-center w-full justify-end select-none">
      <mdi-icon
        class="cursor-pointer mr-3"
        name="bell-outline"
        color="#94a3b8"
      />
      <img
        ref="overlayMenuTrigger"
        id="overlayMenuTrigger"
        class="inline-block h-8 w-8 rounded-full"
        :src="state.user.photoURL"
        alt=""
      />
      <div @click="openMenu" class="cursor-pointer flex p-ripple" v-ripple>
        <span class="text-black ml-4 mr-3 mt-1 font-bold">
          {{ state.user.displayName }}
        </span>
        <mdi-icon name="chevron-down" color="#000000" />
      </div>
    </div>
    <transaction-dialog v-model:dialog="state.newTransactionDialog" />
    <transfer-dialog v-model:dialog="state.transferDialog" />
    <div
      :class="{
        hidden: !state.menuVisible
      }"
      :style="state.menuStyle"
      class="rounded-lg bg-white shadow-md absolute flex flex-col top-16 border w-44"
    >
      <div
        :class="{
          'py-1 px-5 bg-white first:rounded-t-lg last:rounded-b-lg cursor-pointer hover:bg-gray-100 hover:rounded-lg p-ripple': !menuItem.separator,
          'border-t border-gray-200': menuItem.separator
        }"
        v-for="(menuItem, i) in state.menuItems"
        class="select-none"
        :key="i"
        v-ripple
        @click="menuItem.command"
      >
        <span v-if="!menuItem.separator">
          {{ menuItem.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, computed, Ref, ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { getService, Types } from "@/di-container";
import { IAuthService } from "@/services/interfaces/auth-service";
import mdiIcon from "./mdi-icon.vue";
import TransactionDialog from "@/components/transaction-dialog.vue";
import TransferDialog from "@/components/transfer-dialog.vue";
import { RouteNames } from "@/constants/route-names";
import { MenuItem } from "@/models/menu-item";
import { AppUser } from "@/models/user";
import { getOffset } from "@/helpers/helpers";

interface MenuStyle {
  left: string;
}

interface State {
  newTransactionDialog: boolean;
  transferDialog: boolean;
  currentRoute: string | symbol | null | undefined;
  timeOfDay: string;
  menuItems: MenuItem[];
  user: AppUser;
  menuVisible: boolean;
  menuStyle: MenuStyle;
}

export default defineComponent({
  components: { mdiIcon, TransactionDialog, TransferDialog },
  name: "navbar",
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const overlayMenuTrigger: Ref<HTMLElement | null> = ref(
      document.getElementById("overlayMenuTrigger")
    );

    const state: State = reactive({
      menuVisible: false,
      menuStyle: {
        left: "0px"
      },
      menuItems: [
        {
          label: "New transaction",
          command: () => {
            state.newTransactionDialog = true;
            state.menuVisible = false;
          }
        },
        {
          separator: true
        },
        {
          label: "New transfer",
          command: () => {
            state.transferDialog = true;
            state.menuVisible = false;
          }
        },
        {
          separator: true
        },
        {
          label: "Log out",
          command: async () => {
            state.menuVisible = false;
            await getService<IAuthService>(Types.AuthService).signOut();
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

    function openMenu() {
      state.menuVisible = !state.menuVisible;

      const { left } = getOffset(overlayMenuTrigger?.value as HTMLElement);
      const sidebarWidth =
        document.getElementById("sidebar")?.getBoundingClientRect().width || 0;

      state.menuStyle.left = `${left - sidebarWidth}px`;
    }

    const homeRoute = RouteNames.HOME;

    return {
      state,
      openMenu,
      homeRoute,
      overlayMenuTrigger
    };
  }
});
</script>
