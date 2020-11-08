<template>
  <menubar class="no-border-radius no-border navbar-height">
    <template #start>
      <btn
        icon="pi pi-bars"
        class="p-button-rounded p-button-text p-mx-2"
        style="color: white"
        @click="changeSiderbarState"
      />
      <div class="top-left">
        <span class="leading-text">FinApp</span
        ><span class="following-text">MatijaNovosel</span>
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
.navbar-height {
  height: var(--navbar-height);
}
.p-panelmenu-content {
  background-color: var(--color-dark-gradient-3) !important;
}
.top-left {
  position: absolute;
  top: 17px;
  left: 55px;
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
