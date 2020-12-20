<template>
  <sidebar
    :dismissable="true"
    :modal="false"
    :showCloseIcon="false"
    :autoZIndex="false"
    v-model:visible="state.visible"
    style="z-index: 1"
    class="navbar-offset sidebar"
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
  <expense-dialog v-model:dialog="state.expenseDialog" />
  <gain-dialog v-model:dialog="state.gainDialog" />
  <settings-dialog v-model:dialog="state.settingsDialog" />
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watch } from "vue";
import MenuItem from "@/constants/menu-item";
import ExpenseDialog from "@/components/expense-dialog.vue";
import GainDialog from "@/components/gain-dialog.vue";
import SettingsDialog from "@/components/settings-dialog.vue";
import { useStore } from "vuex";
import { AppUser } from "@/models/user";
import { useRouter } from "vue-router";

interface Props {
  visible: boolean;
}

interface State {
  menuItems: MenuItem[];
  visible: boolean;
  expenseDialog: boolean;
  gainDialog: boolean;
  settingsDialog: boolean;
  user: AppUser;
}

export default defineComponent({
  name: "drawer",
  props: {
    visible: Boolean
  },
  components: {
    ExpenseDialog,
    SettingsDialog,
    GainDialog
  },
  setup(props: Props) {
    const store = useStore();
    const router = useRouter();

    const state: State = reactive({
      visible: props.visible,
      settingsDialog: false,
      expenseDialog: false,
      gainDialog: false,
      user: computed(() => store.getters.user),
      menuItems: [
        {
          label: "Početna stranica",
          icon: "pi pi-home",
          command: () => {
            router.push({ name: "home" });
          }
        },
        {
          label: "Financijske akcije",
          icon: "pi pi-dollar",
          items: [
            {
              label: "Novi trošak",
              icon: "pi pi-minus",
              command: () => {
                state.expenseDialog = true;
              }
            },
            {
              label: "Novi dobitak",
              icon: "pi pi-plus",
              command: () => {
                state.gainDialog = true;
              }
            }
          ]
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
