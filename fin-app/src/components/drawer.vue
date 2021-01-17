<template>
  <sidebar
    :dismissable="true"
    :modal="false"
    :showCloseIcon="false"
    :autoZIndex="false"
    v-model:visible="state.visible"
    style="z-index: 1"
    class="navbar-offset sidebar bg-gray-900 border-r border-gray-600"
  >
    <div class="drawer-header">
      <div class="avatar-container">
        <img class="avatar" :src="state.user.photoURL" />
        <svg class="half-circle" viewBox="0 0 106 57">
          <path d="M102 4c0 27.1-21.9 49-49 49S4 31.1 4 4"></path>
        </svg>
      </div>
      <div class="header-content">
        <span class="header-title">{{
          state.user.displayName ?? "Unknown"
        }}</span>
        <span class="header-subtitle">{{ state.user.email ?? "Unknown" }}</span>
      </div>
    </div>
    <panel-menu :model="state.menuItems" />
  </sidebar>
  <transaction-dialog v-model:dialog="state.TransactionDialog" />
  <settings-dialog v-model:dialog="state.settingsDialog" />
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watch } from "vue";
import MenuItem from "@/models/menu-item";
import TransactionDialog from "@/components/transaction-dialog.vue";
import SettingsDialog from "@/components/settings-dialog.vue";
import { useStore } from "vuex";
import { AppUser } from "@/models/user";
import { useRouter, useRoute } from "vue-router";

interface Props {
  visible: boolean;
}

interface State {
  menuItems: MenuItem[];
  visible: boolean;
  TransactionDialog: boolean;
  settingsDialog: boolean;
  user: AppUser;
}

export default defineComponent({
  name: "drawer",
  props: {
    visible: Boolean
  },
  components: {
    TransactionDialog,
    SettingsDialog
  },
  setup(props: Props) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const state: State = reactive({
      visible: props.visible,
      settingsDialog: false,
      TransactionDialog: false,
      user: computed(() => store.getters.user),
      menuItems: [
        {
          label: "Početna stranica",
          icon: "pi pi-home",
          disabled: computed(() => route.name == "home"),
          command: () => {
            router.push({ name: "home" });
          }
        },
        {
          icon: "pi pi-dollar",
          label: "New financial change",
          command: () => {
            state.TransactionDialog = true;
          }
        },
        {
          label: "Postavke",
          icon: "pi pi-cog",
          command: () => {
            state.settingsDialog = true;
          }
        }
      ]
    });

    watch(
      () => props.visible,
      (val) => (state.visible = val)
    );

    return {
      state,
      store
    };
  }
});
</script>

<style lang="sass">
@use "../assets/css/variables"
@import "../assets/css/helpers"

.drawer-header
  margin: 1.6em 0px
  display: flex
  justify-content: center
  align-items: center

.header-content
  padding-left: 1.3rem
  text-align: left
  display: flex
  flex-direction: column

.navbar-height
  height: variables.$navbar-height

.header-title
  margin: 0px 0px 5px 0px
  font-size: 1.3rem
  font-family: "ProximaNovaBold" !important
  color: var(--primary-color)

.header-subtitle
  font-size: 12px
  color: #7e7e7e
  font-family: "ProximaNovaBold" !important

.avatar
  border-radius: 50%
  width: 50px
  display: block
  overflow: hidden
  margin: 16px 10px

.half-circle
  position: absolute
  bottom: 0
  left: 0
  width: 71px
  height: 48px
  stroke: #ff8a00
  stroke-width: 8
  stroke-linecap: round
  pointer-events: none
  fill: none

.settings-button
  position: absolute !important
  top: -10px
  right: 10px
  color: grey !important

.sidebar
  outline: none

.avatar-container
  position: relative
  display: grid
  grid-template-columns: 70px 0
  align-items: center
</style>
