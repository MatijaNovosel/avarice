<template>
  <q-header class="layout bg-dark-1 row justify-end q-pt-lg q-pr-sm">
    <q-btn flat dense class="bg-grey-10 rounded">
      <q-icon class="q-pa-xs" name="mdi-account-outline" size="sm" />
      <q-menu>
        <q-list dense style="min-width: 100px">
          <q-item class="q-my-sm">
            <q-item-section avatar>
              <q-avatar color="accent" text-color="white">
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
            <q-item-section> User settings </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <q-btn flat dense class="q-ml-md bg-grey-10 rounded" @click="createTransaction">
      <q-icon class="q-pa-xs" name="mdi-plus" size="sm" />
    </q-btn>
    <q-btn flat dense class="q-mx-md bg-grey-10 rounded">
      <q-icon class="q-pa-xs" name="mdi-eyedropper-variant" size="sm" color="accent" />
      <q-menu touch-position>
        <q-color v-model="selectedColor" no-header no-footer default-view="palette" />
      </q-menu>
    </q-btn>
    <q-btn flat dense class="q-mr-md rounded bg-accent" @click="logOut">
      <q-icon class="q-pa-xs" name="mdi-power-standby" color="black" size="sm" />
    </q-btn>
  </q-header>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useStore } from "src/store";
import { useRouter } from "vue-router";
import ROUTE_NAMES from "src/router/routeNames";
import { AppUser } from "src/models/user";
import { acronym } from "src/utils/helpers";

const store = useStore();
const router = useRouter();
const selectedColor = ref(null);

// eslint-disable-next-line
const user = computed(() => store.getters["user/data"] as AppUser);

async function logOut() {
  await store.dispatch("user/logout");
  await router.push({
    name: ROUTE_NAMES.LOGIN
  });
}

async function createTransaction() {
  await store.dispatch("app/createTransaction");
}

watch(
  () => selectedColor.value,
  async (val) => {
    await store.dispatch("app/changeAccentColor", val);
  }
);
</script>
