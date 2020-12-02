<template>
  <toast position="top-right" />
  <template v-if="state.isAuthenticated">
    <navbar v-model:sidebar="state.visible" />
    <drawer v-model:visible="state.visible" />
  </template>
  <router-view :class="{ 'offset-top': state.isAuthenticated }" />
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "vue";
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
      visible: false,
      isAuthenticated: computed(() => store.getters.isAuthenticated)
    });

    return {
      state,
      store
    };
  }
});
</script>

<style lang="sass">
@use "assets/css/variables"
.navbar-offset
  margin-top: variables.$navbar-height !important
.offset-top
  margin-top: variables.$navbar-height * 1.4 !important
</style>
