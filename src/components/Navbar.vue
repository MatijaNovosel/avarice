<template>
  <q-header class="bg-grey-2 row justify-end q-pt-lg q-pr-md">
    <q-btn flat dense class="q-mr-md bg-white rounded">
      <q-icon class="q-pa-xs" name="mdi-bell-outline" color="grey-9" size="sm" />
      <q-badge rounded color="orange" floating>22</q-badge>
    </q-btn>
    <q-btn flat dense class="bg-white rounded">
      <q-icon class="q-pa-xs" name="mdi-account-outline" color="grey-9" size="sm" />
      <q-menu>
        <q-list dense style="min-width: 100px">
          <q-item class="q-my-sm">
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">
                {{ acronym(user.userName) }}
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium"> {{ user.userName }} </q-item-label>
              <q-item-label caption>
                {{ user.email }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable v-close-popup>
            <q-item-section>New tab</q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section>New incognito tab</q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <q-btn flat dense class="q-mx-md bg-white rounded" @click="logOut">
      <q-icon class="q-pa-xs" name="mdi-power-standby" color="grey-9" size="sm" />
    </q-btn>
  </q-header>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "src/store";
import { useRouter } from "vue-router";
import ROUTE_NAMES from "src/router/routeNames";
import { AppUser } from "src/models/user";
import { acronym } from "src/utils/helpers";

export default defineComponent({
  name: "navbar",
  setup() {
    const store = useStore();
    const router = useRouter();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = computed(() => store.getters["user/data"] as AppUser);

    async function logOut() {
      await store.dispatch("user/logout");
      await router.push({
        name: ROUTE_NAMES.LOGIN
      });
    }

    return {
      logOut,
      user,
      acronym
    };
  }
});
</script>
