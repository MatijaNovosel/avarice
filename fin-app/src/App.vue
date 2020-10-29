<template>
  <navbar style="z-index: 99" v-model:sidebar="state.visible" />
  <sidebar
    :dismissable="true"
    :modal="false"
    :autoZIndex="false"
    :showCloseIcon="false"
    v-model:visible="state.visible"
    style="z-index: -1"
  >
    <panel-menu style="margin-top: 65px" :model="state.menuItems" />
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
</style>
