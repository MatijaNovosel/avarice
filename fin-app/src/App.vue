<template>
  <toast position="top-right" />
  <template v-if="state.isAuthenticated">
    <drawer v-model:visible="state.visible" />
  </template>
  <div class="grid grid-cols-12">
    <div class="col-span-2 bg-gray-200">
      <div class="flex flex-col p-3 items-center mt-5">
        <span class="text-4xl gradient-text proxima-bold font-bold">FinApp</span>
        <span>by Matija Novosel</span>
      </div>
    </div>
    <div class="col-span-10">
      <navbar v-model:sidebar="state.visible" class="mb-5" />
      <router-view :class="{ 'offset-top': state.isAuthenticated }" />
    </div>
  </div>
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

.proxima-bold
  font-family: "ProximaNovaBold" !important
</style>
