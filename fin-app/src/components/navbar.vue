<template>
  <div
    class="no-border-radius no-border navbar shadow-md bg-white px-8 pb-4 pt-1 grid grid-rows-2"
  >
    <div class="flex items-center w-full justify-end border-b border-gray-200">
      <mdi-icon
        class="cursor-pointer mr-3"
        name="bell-outline"
        color="#94a3b8"
      />
      <img
        class="inline-block h-8 w-8 rounded-full"
        src="https://avatars0.githubusercontent.com/u/36193643?s=460&u=476cacf3518a2a0914c512b60ea1b046413900cf&v=4"
        alt=""
      />
      <span class="text-black ml-4 mr-3 font-bold">Matija Novosel</span>
      <mdi-icon class="cursor-pointer" name="chevron-down" color="#000000" />
    </div>
    <div class="flex items-center pt-4 w-full justify-between">
      <div class="flex items-center">
        <img
          class="h-26 w-16 rounded-full flex-none"
          src="https://avatars0.githubusercontent.com/u/36193643?s=460&u=476cacf3518a2a0914c512b60ea1b046413900cf&v=4"
          alt=""
        />
        <div class="flex flex-col ml-4">
          <span class="text-black font-bold text-2xl"
            >Good {{ state.timeOfDay }}, Matija Novosel</span
          >
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
      <button
        @click="openNewTransactionDialog"
        class="text-white rounded-md bg-gray-600 hover:bg-gray-700 py-1 px-6"
      >
        New transaction
      </button>
    </div>
    <financial-change-dialog v-model:dialog="state.newTransactionDialog" />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, SetupContext, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getService, Types } from "@/di-container";
import { IAuthService } from "@/services/interfaces/auth-service";
import mdiIcon from "./mdi-icon.vue";
import FinancialChangeDialog from "@/components/financial-change-dialog.vue";

interface Props {
  title?: string | null;
  sidebar: boolean;
}

interface State {
  title?: string | null;
  sidebar: boolean;
  newTransactionDialog: boolean;
}

export default defineComponent({
  components: { mdiIcon, FinancialChangeDialog },
  name: "navbar",
  emits: ["update:sidebar"],
  props: {
    title: String,
    sidebar: Boolean
  },
  setup(props: Props, context: SetupContext) {
    const store = useStore();
    const router = useRouter();
    const state: State = reactive({
      newTransactionDialog: false,
      sidebar: props.sidebar,
      title: props.title,
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

    watch(
      () => props.title,
      (val) => (state.title = val)
    );

    watch(
      () => props.sidebar,
      (val) => (state.sidebar = val)
    );

    async function logout() {
      await getService<IAuthService>(Types.AuthService).signOut();
      store.dispatch("unsetUser");
      router.push({ name: "login" });
    }

    function changeSiderbarState() {
      state.sidebar = !state.sidebar;
      context.emit("update:sidebar", state.sidebar);
    }

    function openNewTransactionDialog() {
      state.newTransactionDialog = true;
    }

    return {
      state,
      logout,
      changeSiderbarState,
      store,
      openNewTransactionDialog
    };
  }
});
</script>

<style lang="sass">
@use "../assets/css/variables"

.navbar
  z-index: 1

.leading-text
  font-size: 1.7rem
  font-family: "ProximaNovaBold" !important
  font-weight: bold
  align-self: center

.following-text
  margin-left: 5px

.logout-button
  background: linear-gradient(90deg, #ff8a00, #e52e71) !important
</style>
