<template>
  <menubar class="no-border-radius no-border navbar navbar-shadow">
    <template #start>
      <div class="header">
        <btn
          icon="pi pi-bars"
          class="p-button-rounded p-button-text p-mx-2"
          style="color: white"
          @click="changeSiderbarState"
        />
        <svg
          class="p-mr-2 p-ml-2 logo"
          style="width: 24px; height: 24px"
          viewBox="0 0 24 24"
        >
          <path
            fill="white"
            d="M21,18V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V6H12C10.89,6 10,6.9 10,8V16A2,2 0 0,0 12,18M12,16H22V8H12M16,13.5A1.5,1.5 0 0,1 14.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,12A1.5,1.5 0 0,1 16,13.5Z"
          />
        </svg>
        <span class="leading-text">FinApp</span>
        <span class="following-text">Matija Novosel</span>
      </div>
    </template>
    <template #end>
      <btn
        icon="pi pi-power-off"
        class="p-button-rounded p-mr-2 logout-button"
        @click="logout"
      />
    </template>
  </menubar>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, SetupContext } from "vue";

interface Props {
  title?: string | null;
  sidebar: boolean;
}

interface State {
  title?: string | null;
  sidebar: boolean;
}

export default defineComponent({
  name: "navbar",
  props: {
    title: String,
    sidebar: Boolean
  },
  setup(props: Props, context: SetupContext) {
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

    function logout() {
      console.log("Click!");
    }

    function changeSiderbarState() {
      state.sidebar = !state.sidebar;
      context.emit("update:sidebar", state.sidebar);
    }

    return {
      state,
      logout,
      changeSiderbarState
    };
  }
});
</script>

<style>
.navbar {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1;
  height: var(--navbar-height);
}
.logo {
  align-self: center;
}
.header {
  display: flex;
  flex-direction: row;
  align-items: baseline;
  align-content: center;
}
.p-panelmenu-content {
  background-color: var(--color-dark-gradient-3) !important;
}
.leading-text {
  font-size: 16px;
  color: var(--tarkov-brown);
}
.following-text {
  margin-left: 5px;
  color: white;
}
.logout-button {
  background-color: var(--tarkov-brown) !important;
}
</style>
