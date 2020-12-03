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
    <mdi-icon
      @click="state.settingsDialog = true"
      name="cog"
      class="settings-button cursor-pointer"
      v-tooltip.bottom="'Postavke'"
    />
    <div class="drawer-header">
      <img class="avatar" :src="state.user.photoURL" />
      <span class="header-title">{{
        state.user.displayName ?? "Unknown"
      }}</span>
      <span class="header-subtitle">{{ state.user.email ?? "Unknown" }}</span>
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
import mdiIcon from "./mdi-icon.vue";

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
    GainDialog,
    mdiIcon
  },
  setup(props: Props) {
    const store = useStore();
    const state: State = reactive({
      visible: props.visible,
      settingsDialog: false,
      expenseDialog: false,
      gainDialog: false,
      user: computed(() => store.getters.user),
      menuItems: [
        {
          label: "Financijske akcije",
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
  margin: 25px 0px 25px 0px
  text-align: center
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center

.navbar-height
  height: variables.$navbar-height

.header-title
  margin: 10px 0px 5px 0px
  font-size: 1.3rem
  font-family: "ProximaNovaBold" !important

.header-subtitle
  font-size: 12px
  color: #7e7e7e
  font-family: "ProximaNovaBold" !important

.avatar
  border-radius: 50%
  width: 100px

.settings-button
  position: absolute !important
  top: -10px
  right: 10px
  color: grey !important

.sidebar
  outline: none
</style>
