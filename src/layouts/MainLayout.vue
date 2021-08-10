<template>
  <q-layout view="lhh lpR lFf">
    <q-header class="bg-grey-2 row justify-end q-py-md q-pr-md">
      <q-btn color="white" dense class="q-mr-md">
        <q-icon
          class="q-pa-xs"
          name="mdi-bell-outline"
          color="grey-9"
          size="sm"
        />
        <q-badge rounded color="orange" floating>22</q-badge>
      </q-btn>
      <q-btn color="white" dense>
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
      v-model="leftDrawerOpen"
      side="left"
      class="bg-white"
    >
      <q-list>
        <q-item-label header class="text-grey-8"> FinApp </q-item-label>
        <drawer-item
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>
    <q-page-container>
      <q-page padding class="bg-grey-2">
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import DrawerItem from "src/components/DrawerItem.vue";

const linksList = [
  {
    title: "Dashboard",
    caption: "quasar.dev",
    icon: "dashboard",
    link: "https://quasar.dev"
  },
  {
    title: "Accounts",
    caption: "github.com/quasarframework",
    icon: "mdi-account",
    link: "https://github.com/quasarframework"
  },
  {
    title: "History",
    caption: "chat.quasar.dev",
    icon: "mdi-clock",
    link: "https://chat.quasar.dev"
  }
];

import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",
  components: {
    DrawerItem
  },
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      }
    };
  }
});
</script>
