<template>
  <v-navigation-drawer
    color="grey darken-4"
    right
    clipped
    app
    mini-variant
    floating
    permanent
  >
    <v-list dense nav class="mt-1">
      <v-list-item
        color="red"
        exact
        v-for="(item, i) in state.links"
        :key="i"
        :to="item.route"
      >
        <v-icon v-text="item.icon" />
      </v-list-item>
      <v-divider class="my-3" />
      <v-list-item @click="state.newTransactionDialog = true">
        <v-icon>
          mdi-wallet-plus
        </v-icon>
      </v-list-item>
      <v-list-item @click="state.newTransferDialog = true">
        <v-icon>
          mdi-transfer
        </v-icon>
      </v-list-item>
      <v-list-item @click="state.newAccountDialog = true">
        <v-icon>
          mdi-credit-card-plus-outline
        </v-icon>
      </v-list-item>
      <v-divider class="my-3" />
      <v-list-item @click="logOut">
        <v-icon color="grey">
          mdi-logout
        </v-icon>
      </v-list-item>
    </v-list>
    <new-transaction-dialog v-model="state.newTransactionDialog" />
    <new-transfer-dialog v-model="state.newTransferDialog" />
    <new-account-dialog v-model="state.newAccountDialog" />
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent, reactive, SetupContext } from "@vue/composition-api";
import NavigationLink from "../models/navigationLink";
import RouteNames from "@/constants/routeNames";
import NewTransactionDialog from "@/components/NewTransactionDialog.vue";
import NewAccountDialog from "@/components/NewAccountDialog.vue";
import NewTransferDialog from "@/components/NewTransferDialog.vue";

interface Props {
  links: NavigationLink[];
}

interface State {
  links: NavigationLink[];
  appVersion?: string;
  newTransactionDialog: boolean;
  newTransferDialog: boolean;
  newAccountDialog: boolean;
}

export default defineComponent({
  name: "navigation-drawer",
  components: {
    NewTransactionDialog,
    NewTransferDialog,
    NewAccountDialog
  },
  props: {
    links: Array,
    drawer: null
  },
  setup(props: Props, context: SetupContext) {
    const state: State = reactive({
      newTransactionDialog: false,
      newTransferDialog: false,
      newAccountDialog: false,
      links: props.links,
      appVersion: process.env.PACKAGE_VERSION
    });

    async function logOut() {
      await context.root.$store.dispatch("user/logout");
      context.root.$router.push({ name: RouteNames.LOGIN });
    }

    return {
      state,
      logOut
    };
  }
});
</script>
