<template>
  <div class="flex flex-col my-8 items-center text-white">
    <span class="text-4xl proxima-bold font-bold">FinApp</span>
    <span class="text-sm">by Matija Novosel</span>
  </div>
  <div class="flex flex-col space-y-1 text-gray-100">
    <div
      :class="{
        'bg-gray-700': state.currentRoute.name == 'home',
        'bg-gray-600': state.currentRoute.name != 'home'
      }"
      class="flex text-lg items-center cursor-pointer rounded-lg hover:bg-gray-700 py-2 px-3 mx-3 p-ripple"
      v-ripple
    >
      <mdi-icon class="mr-3" color="#ffffff" name="home" />
      <span class="select-none">Home</span>
    </div>
    <div
      class="flex text-lg items-center cursor-pointer rounded-lg hover:bg-gray-700 py-2 px-3 mx-3 p-ripple"
      v-ripple
    >
      <mdi-icon class="mr-3" color="#ffffff" name="clock" />
      <span class="select-none">History</span>
    </div>
    <div
      class="p-ripple flex text-lg items-center cursor-pointer rounded-lg hover:bg-gray-700 py-2 px-3 mx-3"
      v-ripple
    >
      <mdi-icon class="mr-3" color="#ffffff" name="scale" />
      <span class="select-none">Balances</span>
    </div>
    <div class="flex flex-col border-b border-gray-700 pb-3">
      <div
        class="p-ripple flex text-lg items-center cursor-pointer rounded-lg hover:bg-gray-700 py-2 px-3 mx-3"
        v-ripple
      >
        <mdi-icon class="mr-3" color="#ffffff" name="credit-card-outline" />
        <span class="select-none">Accounts</span>
      </div>
    </div>
    <div class="flex flex-col pt-2">
      <div
        class="p-ripple flex text-lg items-center cursor-pointer rounded-lg hover:bg-gray-700 py-2 px-3 mx-3"
        v-ripple
      >
        <mdi-icon class="mr-3" color="#ffffff" name="cog" />
        <span class="select-none">Settings</span>
      </div>
    </div>
    <div
      class="p-ripple flex text-lg items-center cursor-pointer rounded-lg hover:bg-gray-700 py-2 px-3 mx-3"
      v-ripple
    >
      <mdi-icon class="mr-3" color="#ffffff" name="shield-check" />
      <span class="select-none">Privacy</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "vue";
import { useStore } from "vuex";
import { AppUser } from "@/models/user";
import { useRouter, useRoute } from "vue-router";

interface State {
  user: AppUser;
}

export default defineComponent({
  name: "drawer",
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const state: State = reactive({
      user: computed(() => store.getters.user),
      currentRoute: computed(() => {
        return route.name;
      })
    });

    return {
      state,
      store,
      router
    };
  }
});
</script>
