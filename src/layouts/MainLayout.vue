<template>
  <q-layout view="lhh lpR lFf" :class="{ layout: shouldShowUi }" class="q-mx-auto">
    <template v-if="shouldShowUi">
      <navbar />
    </template>
    <q-page-container>
      <router-view />
      <transaction-dialog />
      <new-account-dialog />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import ROUTE_NAMES from "src/router/routeNames";
import Navbar from "src/components/Navbar.vue";
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { setCssVar } from "quasar";
import { useAppStore } from "src/stores/app";
import TransactionDialog from "src/components/TransactionDialog.vue";
import NewAccountDialog from "src/components/NewAccountDialog.vue";
import { storeToRefs } from "pinia";

const route = useRoute();
const appStore = useAppStore();
const { accentColor } = storeToRefs(appStore);

const shouldShowUi = computed(
  () =>
    ![ROUTE_NAMES.LOGIN, ROUTE_NAMES.REGISTER, ROUTE_NAMES.ACCOUNT_SETUP].includes(
      route.name as string
    )
);

onMounted(() => setCssVar("accent", accentColor.value));
</script>

<style lang="scss">
.layout {
  max-width: 1350px;
}
</style>
