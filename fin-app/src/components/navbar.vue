<template>
  <div
    class="no-border-radius no-border navbar shadow-md bg-white px-8 pb-4 pt-1 grid grid-rows-2 divide-y divide-grey-500"
  >
    <div class="flex items-center w-full justify-end">
      <img
        class="inline-block h-8 w-8 rounded-full"
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        alt=""
      />
      <span class="text-black ml-4 mr-3 font-bold">Matija Novosel</span>
      <mdi-icon class="cursor-pointer" name="chevron-down" color="#000000" />
    </div>
    <div class="flex items-center pt-4">
      <img
        class="h-26 w-16 rounded-full flex-none"
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        alt=""
      />
      <div class="flex flex-col ml-4">
        <span class="text-black font-bold text-2xl"
          >Good morning, Matija Novosel</span
        >
        <div class="flex items-center text-gray-400 font-bold"><mdi-icon class="mr-1" :size="18" name="check-circle" color="#38bf8c" /> Verified account</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, SetupContext } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getService, Types } from "@/di-container";
import { IAuthService } from "@/services/interfaces/auth-service";
import mdiIcon from "./mdi-icon.vue";

interface Props {
  title?: string | null;
  sidebar: boolean;
}

interface State {
  title?: string | null;
  sidebar: boolean;
}

export default defineComponent({
  components: { mdiIcon },
  name: "navbar",
  emits: ["update:sidebar"],
  props: {
    title: String,
    sidebar: Boolean
  },
  setup(props: Props, context: SetupContext) {
    const store = useStore();
    const router = useRouter();
    const state: State = reactive({
      sidebar: props.sidebar,
      title: props.title
    });

    watch(
      () => props.title,
      (val) => (state.title = val)
    );

    watch(
      () => props.sidebar,
      (val) => (state.sidebar = val)
    );

    async function logout() {
      await getService<IAuthService>(Types.AuthService).signOut();
      store.dispatch("unsetUser");
      router.push({ name: "login" });
    }

    function changeSiderbarState() {
      state.sidebar = !state.sidebar;
      context.emit("update:sidebar", state.sidebar);
    }

    return {
      state,
      logout,
      changeSiderbarState,
      store
    };
  }
});
</script>

<style lang="sass">
@use "../assets/css/variables"

.navbar
  z-index: 1

.leading-text
  font-size: 1.7rem
  font-family: "ProximaNovaBold" !important
  font-weight: bold
  align-self: center

.following-text
  margin-left: 5px

.logout-button
  background: linear-gradient(90deg, #ff8a00, #e52e71) !important
</style>
