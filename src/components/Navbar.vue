<template>
  <q-header class="layout bg-dark-1 row justify-end q-pt-lg q-pr-sm items-center" v-if="user">
    <div class="q-mr-md bg-dark q-px-md q-py-sm rounded text-bold">
      {{ formatBalance(totalAccountValue, "HRK") }}
    </div>
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
    <q-btn flat dense class="q-ml-md bg-grey-10 rounded" @click="openTransactionDialog">
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
import { useRouter } from "vue-router";
import ROUTE_NAMES from "src/router/routeNames";
import { acronym, formatBalance } from "src/utils/helpers";
import { useAppStore } from "src/stores/app";
import { useUserStore } from "src/stores/user";

const appStore = useAppStore();
const userStore = useUserStore();
const router = useRouter();
const selectedColor = ref<string>("#ffffff");

const user = computed(() => userStore.data);
const totalAccountValue = computed(() =>
  userStore.accounts.map((a) => a.balance).reduce((sum, val) => sum + val, 0)
);

async function logOut() {
  userStore.logout();
  await router.push({
    name: ROUTE_NAMES.LOGIN
  });
}

const openTransactionDialog = () => {
  appStore.openTransactionDialog();
};

watch(
  () => selectedColor.value,
  (val) => appStore.changeAccentColor(appStore, val)
);
</script>
