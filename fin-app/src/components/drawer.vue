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
      icon="pi pi-cog"
      class="p-button-rounded p-button-text settings-button p-button-lg pb-button-secondary"
      v-tooltip.bottom="'Postavke'"
    />
    <div class="drawer-header">
      <img
        class="avatar"
        src="https://p7.hiclipart.com/preview/873/489/293/avatar-youtube-cat-cute-dog-thumbnail.jpg"
      />
      <span class="header-title">Matija Novosel</span>
      <span class="header-subtitle">Admin</span>
    </div>
    <panel-menu :model="state.menuItems" />
  </sidebar>
  <expense-dialog
    v-model:input="state.input"
    v-model:dialog="state.dialog"
    @add-expense="addExpense"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";
import MenuItem from "@/constants/menu-item";
import ExpenseDialog from "@/components/expense-dialog.vue";
import { PaymentSourceEnum } from "@/constants/payment-source-enum";

interface Input {
  PaymentSourceEnum: PaymentSourceEnum | null;
  categories: Array<number>;
  description: string | null;
  amount: string | null;
}

interface Props {
  visible: boolean;
}

interface State {
  menuItems: Array<MenuItem>;
  visible: boolean;
  dialog: boolean;
  input: Input;
}

export default defineComponent({
  name: "drawer",
  props: {
    visible: Boolean
  },
  components: {
    ExpenseDialog
  },
  setup(props: Props) {
    const state: State = reactive({
      input: {
        PaymentSourceEnum: PaymentSourceEnum.GyroAccount,
        categories: [],
        description: null,
        amount: null
      },
      visible: props.visible,
      dialog: false,
      menuItems: [
        {
          label: "Financijske akcije",
          items: [
            {
              label: "Novi unos",
              icon: "pi pi-plus",
              command: () => {
                state.dialog = true;
              }
            },
            {
              label: "Stanje kroz vrijeme",
              icon: "pi pi-dollar",
              command: () => {
                console.log("Click!");
              }
            }
          ]
        },
        {
          label: "Postavke",
          items: [
            {
              label: "Aplikacijske postavke",
              icon: "pi pi-cog",
              command: () => {
                console.log("Click!");
              }
            },
            {
              label: "Korisničke postavke",
              icon: "pi pi-user",
              command: () => {
                console.log("Click!");
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

    function addExpense() {
      // const payload = { ...state.input };
      state.dialog = false;
    }

    return {
      state,
      addExpense
    };
  }
});
</script>

<style scoped>
.drawer-header {
  margin: 10px 0px 15px 0px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.navbar-height {
  height: var(--navbar-height);
}
.header-title {
  margin: 10px 0px 5px 0px;
  font-size: 16px;
}
.header-subtitle {
  font-size: 12px;
  color: #dc2424;
}
.avatar {
  border-radius: 50%;
  width: 100px;
}
.settings-button {
  position: absolute;
  top: -10px;
  right: 0px;
  color: grey !important;
}
.sidebar {
  outline: none;
}
</style>
