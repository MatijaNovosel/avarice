<template>
  <menubar class="no-border-radius no-border navbar shadow-lg bg-gray-800">
    <template #start>
      <div class="header flex items-center">
        <btn
          icon="pi pi-bars"
          class="p-button-rounded p-button-text text-white ml-3 mr-5"
          @click="changeSiderbarState"
        />
        <span class="leading-text gradient-text">FinApp</span>
        <span class="following-text mt-2">by Matija Novosel</span>
      </div>
    </template>
    <template #end>
      <div class="flex mr-5">
        <btn
          icon="pi pi-power-off"
          class="p-button-rounded logout-button"
          @click="logout"
        />
      </div>
    </template>
  </menubar>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, SetupContext } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getService, Types } from "@/di-container";
import { IAuthService } from "@/services/interfaces/auth-service";

interface Props {
  title?: string | null;
  sidebar: boolean;
}

interface State {
  title?: string | null;
  sidebar: boolean;
}

export default defineComponent({
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
      sidebar: props.sidebar,
      title: props.title
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

    return {
      state,
      logout,
      changeSiderbarState,
      store
    };
  }
});
</script>

<style lang="sass">
@use "../assets/css/variables"

.navbar
  position: fixed
  top: 0
  width: 100%
  z-index: 1
  height: variables.$navbar-height

.leading-text
  font-size: 1.7rem
  font-family: "ProximaNovaBold" !important
  font-weight: bold
  align-self: center

.following-text
  margin-left: 5px
  color: white

.logout-button
  background: linear-gradient(90deg, #ff8a00, #e52e71) !important
</style>
