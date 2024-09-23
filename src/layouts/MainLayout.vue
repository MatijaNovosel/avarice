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
import Navbar from "@/components/Navbar.vue";
import NewAccountDialog from "@/components/NewAccountDialog.vue";
import TransactionDialog from "@/components/TransactionDialog.vue";
import ROUTE_NAMES from "@/router/routeNames";
import { useAppStore } from "@/stores/app";
import { storeToRefs } from "pinia";
import { setCssVar } from "quasar";
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
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
