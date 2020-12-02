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
    <btn
      @click="state.settingsDialog = true"
      icon="pi pi-cog"
      class="p-button-rounded p-button-text settings-button p-button-lg"
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

.drawer-header
  margin: 10px 0px 15px 0px
  text-align: center
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center

.navbar-height
  height: variables.$navbar-height

.header-title
  margin: 10px 0px 5px 0px
  font-size: 16px
  color: variables.$tarkov-brown

.header-subtitle
  font-size: 12px

.avatar
  border-radius: 50%
  width: 100px

.settings-button
  position: absolute !important
  top: -10px
  right: 0px
  color: grey !important

.sidebar
  outline: none
</style>
