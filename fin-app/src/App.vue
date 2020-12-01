<template>
  <template v-if="store.getters.isAuthenticated">
    <navbar v-model:sidebar="state.visible" />
    <drawer v-model:visible="state.visible" />
  </template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { useStore } from "vuex";
import navbar from "@/components/navbar.vue";
import drawer from "@/components/drawer.vue";
import refresh from "@/helpers/refresh";

interface State {
  visible: boolean;
}

export default defineComponent({
  components: {
    navbar,
    drawer
  },
  provide: {
    refresh
  },
  setup() {
    const store = useStore();
    const state: State = reactive({
      visible: false
    });

    return {
      state,
      store
    };
  }
});
</script>

<style>
.navbar-offset {
  margin-top: var(--navbar-height);
}
</style>
