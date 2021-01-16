<template>
  <toast position="top-right" />
  <template v-if="state.isAuthenticated">
    <drawer v-model:visible="state.visible" />
  </template>
  <div class="grid grid-cols-12">
    <div class="col-span-2 bg-gray-600 text-white px-3 space-y-2">
      <div class="flex flex-col my-8 items-center">
        <span class="text-4xl proxima-bold font-bold">FinApp</span>
        <span class="text-sm">by Matija Novosel</span>
      </div>
      <div class="flex flex-col">
        <div class="flex text-lg items-center cursor-pointer rounded-lg bg-gray-700 py-2 px-3">
          <mdi-icon class="mr-3" color="#ffffff" name="home" /> <span>Home</span>
        </div>
      </div>
      <div class="flex flex-col">
        <div class="flex text-lg items-center cursor-pointer rounded-lg hover:bg-gray-700 py-2 px-3">
          <mdi-icon class="mr-3" color="#ffffff" name="clock" /> <span>History</span>
        </div>
      </div>
      <div class="flex flex-col">
        <div class="flex text-lg items-center cursor-pointer rounded-lg hover:bg-gray-700 py-2 px-3">
          <mdi-icon class="mr-3" color="#ffffff" name="scale" /> <span>Balances</span>
        </div>
      </div>
      <div class="flex flex-col border-b border-gray-800 pb-3">
        <div class="flex text-lg items-center cursor-pointer rounded-lg hover:bg-gray-700 py-2 px-3">
          <mdi-icon class="mr-3" color="#ffffff" name="credit-card-outline" /> <span>Accounts</span>
        </div>
      </div>
      <div class="flex flex-col pt-1">
        <div class="flex text-lg items-center cursor-pointer rounded-lg hover:bg-gray-700 py-2 px-3">
          <mdi-icon class="mr-3" color="#ffffff" name="cog" /> <span>Settings</span>
        </div>
      </div>
      <div class="flex flex-col">
        <div class="flex text-lg items-center cursor-pointer rounded-lg hover:bg-gray-700 py-2 px-3">
          <mdi-icon class="mr-3" color="#ffffff" name="shield-check" /> <span>Privacy</span>
        </div>
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
import MdiIcon from "./components/mdi-icon.vue";

interface State {
  visible: boolean;
}

export default defineComponent({
  components: {
    navbar,
    drawer,
    MdiIcon
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
