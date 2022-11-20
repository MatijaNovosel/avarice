<template>
  <q-header class="layout bg-dark-1 q-pt-lg" v-if="user">
    <div class="row">
      <div class="col-12 row justify-end">
        <div class="q-mr-md bg-dark q-px-md q-py-sm rounded text-bold">
          {{ formatBalance(totalBalance, "HRK") }}
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
        <q-btn flat dense class="q-ml-md bg-grey-10 rounded" @click="toggleTransactionDialog">
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
      </div>
      <div class="col-12">
        <q-tabs
          dense
          class="text-grey q-my-md"
          active-color="accent"
          indicator-color="accent"
          align="center"
          narrow-indicator
        >
          <q-route-tab
            v-for="(route, i) in routes"
            :key="i"
            :label="route.title"
            :to="route.link"
            exact
          />
        </q-tabs>
      </div>
    </div>
  </q-header>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { DrawerItem } from "src/models/common";
import ROUTE_NAMES from "src/router/routeNames";
import { useAppStore } from "src/stores/app";
import { useUserStore } from "src/stores/user";
import { acronym, formatBalance } from "src/utils/helpers";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const { toggleTransactionDialog, changeAccentColor } = useAppStore();
const userStore = useUserStore();
const { data: user, totalBalance } = storeToRefs(userStore);
const router = useRouter();
const selectedColor = ref<string>("#ffffff");

async function logOut() {
  userStore.logout();
  await router.push({
    name: ROUTE_NAMES.LOGIN
  });
}

const routes: DrawerItem[] = [
  {
    title: "Dashboard",
    caption: "Data overview",
    icon: "mdi-view-dashboard-outline",
    link: {
      name: ROUTE_NAMES.DASHBOARD
    }
  },
  {
    title: "History",
    caption: "Detailed transaction history",
    icon: "mdi-timer-sand",
    link: {
      name: ROUTE_NAMES.HISTORY
    }
  },
  {
    title: "Categories",
    caption: "User created categories",
    icon: "mdi-tag-multiple",
    link: {
      name: ROUTE_NAMES.CATEGORIES
    }
  },
  {
    title: "Templates",
    caption: "Predefined transactions",
    icon: "mdi-file-multiple",
    link: {
      name: ROUTE_NAMES.TEMPLATES
    }
  },
  {
    title: "Statistics",
    caption: "Visual representation of user data",
    icon: "mdi-chart-line",
    link: {
      name: ROUTE_NAMES.STATISTICS
    }
  }
];

watch(selectedColor, changeAccentColor);
</script>
