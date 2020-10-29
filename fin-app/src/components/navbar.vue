<template>
  <menubar class="no-border-radius" :model="state.items">
    <template #start>
      <btn
        icon="pi pi-bars"
        class="p-button-rounded p-button-text p-mx-2"
        style="color: white"
        @click="openSidebar"
      />
    </template>
    <template #end>
      <btn icon="pi pi-power-off" class="p-button-rounded" @click="logout" />
    </template>
  </menubar>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, SetupContext } from "vue";
import { useToast } from "primevue/usetoast";

interface Props {
  title?: string | null;
  sidebar: boolean;
}

interface NavbarItem {
  label?: string | null;
  icon?: string | null;
  items?: Array<NavbarItem> | null;
}

interface State {
  items: Array<NavbarItem>;
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
      title: props.title,
      items: [
        {
          label: "File",
          icon: "pi pi-fw pi-file",
          items: [
            {
              label: "New",
              icon: "pi pi-fw pi-plus",
              items: [
                {
                  label: "Bookmark",
                  icon: "pi pi-fw pi-bookmark"
                },
                {
                  label: "Video",
                  icon: "pi pi-fw pi-video"
                }
              ]
            },
            {
              label: "Delete",
              icon: "pi pi-fw pi-trash"
            },
            {
              separator: true
            },
            {
              label: "Export",
              icon: "pi pi-fw pi-external-link"
            }
          ]
        },
        {
          label: "Edit",
          icon: "pi pi-fw pi-pencil",
          items: [
            {
              label: "Left",
              icon: "pi pi-fw pi-align-left"
            },
            {
              label: "Right",
              icon: "pi pi-fw pi-align-right"
            },
            {
              label: "Center",
              icon: "pi pi-fw pi-align-center"
            },
            {
              label: "Justify",
              icon: "pi pi-fw pi-align-justify"
            }
          ]
        },
        {
          label: "Users",
          icon: "pi pi-fw pi-user",
          items: [
            {
              label: "New",
              icon: "pi pi-fw pi-user-plus"
            },
            {
              label: "Delete",
              icon: "pi pi-fw pi-user-minus"
            },
            {
              label: "Search",
              icon: "pi pi-fw pi-users",
              items: [
                {
                  label: "Filter",
                  icon: "pi pi-fw pi-filter",
                  items: [
                    {
                      label: "Print",
                      icon: "pi pi-fw pi-print"
                    }
                  ]
                },
                {
                  icon: "pi pi-fw pi-bars",
                  label: "List"
                }
              ]
            }
          ]
        },
        {
          label: "Events",
          icon: "pi pi-fw pi-calendar",
          items: [
            {
              label: "Edit",
              icon: "pi pi-fw pi-pencil",
              items: [
                {
                  label: "Save",
                  icon: "pi pi-fw pi-calendar-plus"
                },
                {
                  label: "Delete",
                  icon: "pi pi-fw pi-calendar-minus"
                }
              ]
            },
            {
              label: "Archieve",
              icon: "pi pi-fw pi-calendar-times",
              items: [
                {
                  label: "Remove",
                  icon: "pi pi-fw pi-calendar-minus"
                }
              ]
            }
          ]
        }
      ]
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

    function openSidebar() {
      state.sidebar = true;
      context.emit("update:sidebar", state.sidebar);
    }

    return {
      state,
      logout,
      openSidebar
    };
  }
});
</script>

<style scoped>
</style>
