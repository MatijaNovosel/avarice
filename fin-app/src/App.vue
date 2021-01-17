<template>
  <toast position="top-right" />
  <div class="grid grid-cols-12">
    <div class="col-span-2 bg-gray-600 space-y-2 h-screen">
      <div class="flex flex-col my-8 items-center text-white">
        <span class="text-5xl proxima-bold font-bold gradient-text"
          >FinApp</span
        >
        <span class="text-sm">by Matija Novosel</span>
      </div>
      <div class="flex flex-col space-y-1 text-gray-100">
        <div
          :class="{
            'bg-gray-700': state.currentRoute.name == 'home',
            'bg-gray-600': state.currentRoute.name != 'home'
          }"
          class="flex text-lg items-center cursor-pointer rounded-lg hover:bg-gray-700 py-2 px-3 mx-3 p-ripple"
          @click="redirect('home')"
          v-ripple
        >
          <mdi-icon class="mr-3 select-none" color="#ffffff" name="home" />
          <span class="select-none">Home</span>
        </div>
        <div
          class="flex text-lg items-center cursor-pointer rounded-lg hover:bg-gray-700 py-2 px-3 mx-3 p-ripple"
          v-ripple
        >
          <mdi-icon class="mr-3 select-none" color="#ffffff" name="clock" />
          <span class="select-none">History</span>
        </div>
        <div
          class="p-ripple flex text-lg items-center cursor-pointer rounded-lg hover:bg-gray-700 py-2 px-3 mx-3"
          v-ripple
        >
          <mdi-icon class="mr-3 select-none" color="#ffffff" name="scale" />
          <span class="select-none">Balances</span>
        </div>
        <div class="flex flex-col border-b border-gray-700 pb-3">
          <div
            :class="{
              'bg-gray-700': state.currentRoute.name == 'accounts',
              'bg-gray-600': state.currentRoute.name != 'accounts'
            }"
            class="p-ripple flex text-lg items-center cursor-pointer rounded-lg hover:bg-gray-700 py-2 px-3 mx-3"
            @click="redirect('accounts')"
            v-ripple
          >
            <mdi-icon
              class="mr-3 select-none"
              color="#ffffff"
              name="credit-card-outline"
            />
            <span class="select-none">Accounts</span>
          </div>
        </div>
        <div class="flex flex-col pt-2">
          <div
            class="p-ripple flex text-lg items-center cursor-pointer rounded-lg hover:bg-gray-700 py-2 px-3 mx-3"
            v-ripple
          >
            <mdi-icon class="mr-3 select-none" color="#ffffff" name="cog" />
            <span class="select-none">Settings</span>
          </div>
        </div>
        <div
          class="p-ripple flex text-lg items-center cursor-pointer rounded-lg hover:bg-gray-700 py-2 px-3 mx-3"
          v-ripple
        >
          <mdi-icon
            class="mr-3 select-none"
            color="#ffffff"
            name="shield-check"
          />
          <span class="select-none">Privacy</span>
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
import refresh from "@/helpers/refresh";
import MdiIcon from "./components/mdi-icon.vue";
import { useRoute, useRouter } from "vue-router";

interface State {
  visible: boolean;
}

export default defineComponent({
  components: {
    navbar,
    MdiIcon
  },
  provide: {
    refresh
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const state: State = reactive({
      visible: false,
      currentRoute: computed(() => {
        return route;
      }),
      isAuthenticated: computed(() => store.getters.isAuthenticated)
    });

    function redirect(name: string) {
      if (route.name != name) {
        router.push({ name });
      }
    }

    return {
      state,
      store,
      redirect
    };
  }
});
</script>

<style lang="sass">
@use "assets/css/variables"

.proxima-bold
  font-family: "ProximaNovaBold" !important
</style>
