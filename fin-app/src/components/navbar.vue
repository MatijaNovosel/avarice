<template>
  <div
    class="shadow-md dark:bg-gray-800 bg-white px-8 flex justify-between h-24 z-50 sticky w-full top-0 rounded-bl-2xl"
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
        <span class="dark:text-white text-black font-bold text-2xl">
          {{ $t("good") }} {{ state.timeOfDay }}, {{ state.user.displayName }}
        </span>
        <div class="flex items-center text-gray-400 font-bold">
          <mdi-icon
            class="mr-1"
            :size="18"
            name="check-circle"
            color="#38bf8c"
          />
          {{ $t("verifiedAccount") }}
        </div>
      </div>
    </div>
    <div class="flex items-center w-full justify-end select-none">
      <dark-mode-switch
        @change="toggleDarkMode"
        v-model:value="state.darkModeSwitch"
      />
      <img
        ref="userMenuAnchor"
        id="userMenuAnchor"
        class="inline-block h-8 w-8 rounded-full ml-5"
        :src="state.user.photoURL"
        alt=""
      />
      <div
        @click="openMenu"
        class="cursor-pointer flex p-ripple rounded-lg ml-3"
        v-ripple
      >
        <span class="dark:text-white text-black pl-2 mr-3 mt-1 font-bold">
          {{ state.user.displayName }}
        </span>
        <mdi-icon
          name="chevron-down"
          :color="state.darkMode ? '#ffffff' : '#000000'"
        />
      </div>
    </div>
    <transaction-dialog v-model:dialog="state.newTransactionDialog" />
    <transfer-dialog v-model:dialog="state.transferDialog" />
    <div
      :class="{
        hidden: !state.menuVisible
      }"
      :style="state.menuStyle"
      class="rounded-lg shadow-md absolute flex flex-col top-16 dark:border-0 border w-44"
    >
      <div
        :class="{
          'py-1 px-5 dark:bg-gray-700 bg-white first:rounded-t-lg last:rounded-b-lg cursor-pointer dark:hover:bg-gray-600 hover:bg-gray-100 hover:rounded-lg p-ripple dark:text-gray-400': !menuItem.separator,
          'border-t border-gray-200 dark:border-gray-900': menuItem.separator
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
import {
  defineComponent,
  reactive,
  computed,
  Ref,
  ref,
  onMounted
} from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { getService, Types } from "@/di-container";
import { IAuthService } from "@/services/interfaces/auth-service";
import mdiIcon from "./mdi-icon.vue";
import DarkModeSwitch from "./dark-mode-switch.vue";
import TransactionDialog from "@/components/transaction-dialog.vue";
import TransferDialog from "@/components/transfer-dialog.vue";
import { RouteNames } from "@/constants/route-names";
import { MenuItem } from "@/models/menu-item";
import { AppUser } from "@/models/user";
import { getOffset } from "@/helpers/helpers";
import { useI18n } from "vue-i18n";
import { debounce } from "@/helpers/helpers";

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
  darkModeSwitch: boolean;
  darkMode: boolean;
}

export default defineComponent({
  components: { mdiIcon, TransactionDialog, TransferDialog, DarkModeSwitch },
  name: "navbar",
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const { t } = useI18n();

    const userMenuAnchor: Ref<HTMLElement | null> = ref(
      document.getElementById("userMenuAnchor")
    );

    const state: State = reactive({
      darkModeSwitch: false,
      menuVisible: false,
      menuStyle: {
        left: "0px"
      },
      menuItems: [
        {
          label: t("newTransaction"),
          command: () => {
            state.newTransactionDialog = true;
            state.menuVisible = false;
          }
        },
        {
          separator: true
        },
        {
          label: t("newTransfer"),
          command: () => {
            state.transferDialog = true;
            state.menuVisible = false;
          }
        },
        {
          separator: true
        },
        {
          label: t("logOut"),
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
      darkMode: computed(() => store.getters.darkMode),
      timeOfDay: computed(() => {
        const hours = new Date().getHours();
        const minutes = new Date().getMinutes();
        if (hours >= 6 && hours <= 11 && minutes <= 59) {
          return t("morning");
        } else if (hours >= 12 && hours <= 17) {
          return t("afternoon");
        } else {
          return t("evening");
        }
      })
    });

    function openMenu() {
      state.menuVisible = !state.menuVisible;

      const { left } = getOffset(userMenuAnchor?.value as HTMLElement);
      const sidebarWidth =
        document.getElementById("sidebar")?.getBoundingClientRect().width || 0;

      state.menuStyle.left = `${left - sidebarWidth}px`;
    }

    const toggleDarkMode = debounce(() => {
      store.dispatch("setDarkMode", state.darkModeSwitch);
    }, 1000);

    onMounted(() => {
      state.darkModeSwitch = store.getters.darkMode;
    });

    const homeRoute = RouteNames.HOME;

    return {
      state,
      openMenu,
      homeRoute,
      userMenuAnchor,
      toggleDarkMode
    };
  }
});
</script>
