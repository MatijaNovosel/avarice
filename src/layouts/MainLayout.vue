<template>
  <q-layout view="lhh lpR lFf">
    <template v-if="state.showUi">
      <q-header class="bg-grey-2 row justify-end q-pt-lg q-pr-md">
        <q-btn flat dense class="q-mr-md bg-white rounded">
          <q-icon
            class="q-pa-xs"
            name="mdi-bell-outline"
            color="grey-9"
            size="sm"
          />
          <q-badge rounded color="orange" floating>22</q-badge>
        </q-btn>
        <q-btn flat dense class="bg-white rounded">
          <q-icon
            class="q-pa-xs"
            name="mdi-account-outline"
            color="grey-9"
            size="sm"
          />
          <q-menu>
            <q-list dense style="min-width: 100px">
              <q-item class="q-my-sm">
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white"> MN </q-avatar>
                </q-item-section>
                <q-item-section> Matija Novosel </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section>New tab</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>New incognito tab</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup>
                <q-item-section>Log out</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-header>
      <q-drawer
        show-if-above
        v-model="state.drawer"
        side="left"
        class="bg-white"
      >
        <div class="text-center q-py-lg">
          <span class="text-h4"> FinApp </span>
        </div>
        <q-list class="q-px-md" dense>
          <drawer-item
            v-for="(link, i) in drawerItems"
            :class="{
              'q-mb-sm': i != drawerItems.length - 1
            }"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </q-drawer>
    </template>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import DrawerItem from "src/components/DrawerItem.vue";
import ROUTE_NAMES from "src/router/routeNames";

const drawerItems = [
  {
    title: "Dashboard",
    caption: "quasar.dev",
    icon: "mdi-view-dashboard-outline",
    link: {
      name: ROUTE_NAMES.DASHBOARD
    }
  },
  {
    title: "History",
    caption: "chat.quasar.dev",
    icon: "mdi-timer-sand",
    link: {
      name: ROUTE_NAMES.HISTORY
    }
  }
];

import { defineComponent, reactive, computed } from "vue";
import { useRouter } from "vue-router";

interface State {
  showUi: boolean;
  drawer: boolean;
}

export default defineComponent({
  name: "MainLayout",
  components: {
    DrawerItem
  },
  setup() {
    const router = useRouter();

    const state: State = reactive({
      showUi: computed(
        () =>
          ![ROUTE_NAMES.LOGIN].includes(
            router.currentRoute.value.name as string
          )
      ),
      drawer: false
    });

    function toggleLeftDrawer() {
      state.drawer = !state.drawer;
    }

    return {
      toggleLeftDrawer,
      drawerItems,
      state
    };
  }
});
</script>
