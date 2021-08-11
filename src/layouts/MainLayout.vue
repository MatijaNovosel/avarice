<template>
  <q-layout view="lhh lpR lFf">
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
      v-model="leftDrawerOpen"
      side="left"
      class="bg-white"
    >
      <div class="text-center q-py-lg">
        <span class="text-h4"> FinApp </span>
      </div>
      <q-list class="q-px-md" dense>
        <drawer-item
          v-for="(link, i) in essentialLinks"
          :class="{
            'q-mb-sm': i != essentialLinks.length - 1
          }"
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
    icon: "mdi-view-dashboard-outline",
    link: {
      name: "dashboard"
    }
  },
  {
    title: "History",
    caption: "chat.quasar.dev",
    icon: "mdi-timer-sand",
    link: {
      name: "history"
    }
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
