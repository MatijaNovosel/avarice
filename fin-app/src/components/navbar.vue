<template>
  <menubar class="no-border-radius no-border navbar navbar-shadow">
    <template #start>
      <div class="header">
        <btn
          icon="pi pi-bars"
          class="p-button-rounded p-button-text p-mx-2"
          style="color: white"
          @click="changeSiderbarState"
        />
        <mdi-icon class="logo p-mx-2" name="wallet" />
        <span class="leading-text">FinApp</span>
        <span class="following-text">Matija Novosel</span>
      </div>
    </template>
    <template #end>
      <div class="end">
        <btn
          icon="pi pi-power-off"
          class="p-button-rounded p-mr-4 logout-button"
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
import mdiIcon from "./mdi-icon.vue";

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
  components: {
    mdiIcon
  },
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

.logo
  align-self: center

.header
  display: flex
  flex-direction: row
  align-items: baseline
  align-content: center

.end
  display: flex
  flex-direction: row
  align-items: center
  align-content: center

.p-panelmenu-content
  background-color: variables.$color-dark-gradient-3 !important

.leading-text
  font-size: 16px
  color: variables.$tarkov-brown

.following-text
  margin-left: 5px
  color: white

.logout-button
  background-color: variables.$tarkov-brown !important
</style>
