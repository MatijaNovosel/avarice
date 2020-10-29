<template>
  <navbar v-model:sidebar="state.visible" />
  <sidebar
    :dismissable="true"
    :modal="false"
    :showCloseIcon="false"
    :autoZIndex="false"
    v-model:visible="state.visible"
    style="z-index: 1"
    class="navbar-offset"
  >
    <panel-menu :model="state.menuItems" />
  </sidebar>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import navbar from "@/components/navbar.vue";
import MenuItem from "@/models/menu-item";

interface State {
  visible: boolean;
  menuItems: Array<MenuItem>;
}

export default defineComponent({
  components: {
    navbar
  },
  setup() {
    const state: State = reactive({
      visible: false,
      menuItems: [
        {
          label: "Options",
          items: [
            {
              label: "Update",
              icon: "pi pi-refresh",
              command: () => {
                console.log("Click!");
              }
            },
            {
              label: "Delete",
              icon: "pi pi-times",
              command: () => {
                console.log("Click!");
              }
            }
          ]
        },
        {
          label: "Options",
          items: [
            {
              label: "Update",
              icon: "pi pi-refresh",
              command: () => {
                console.log("Click!");
              }
            },
            {
              label: "Delete",
              icon: "pi pi-times",
              command: () => {
                console.log("Click!");
              }
            }
          ]
        }
      ]
    });

    return {
      state
    };
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.navbar-offset {
  margin-top: var(--navbar-height);
}
</style>
