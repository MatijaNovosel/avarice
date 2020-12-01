<template>
  <template v-if="store.getters.isAuthenticated">
    <navbar v-model:sidebar="state.visible" />
    <drawer v-model:visible="state.visible" />
  </template>
  <router-view :class="{ 'offset-top': store.getters.isAuthenticated }" />
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
  margin-top: var(--navbar-height) !important;
}
.offset-top {
  margin-top: calc(var(--navbar-height) * 1.4) !important;
}
</style>
