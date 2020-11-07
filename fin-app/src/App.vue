<template>
  <navbar v-model:sidebar="state.visible" />
  <drawer v-model:visible="state.visible" />
  <router-view />
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import navbar from "@/components/navbar.vue";
import drawer from "@/components/drawer.vue";

interface State {
  visible: boolean;
}

export default defineComponent({
  components: {
    navbar,
    drawer
  },
  setup() {
    const state: State = reactive({
      visible: false
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
  color: #2c3e50;
}
.navbar-offset {
  margin-top: var(--navbar-height);
}
</style>
