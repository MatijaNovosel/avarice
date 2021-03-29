<template>
  <v-app-bar dense app class="elevation-1 rounded-bl-xl" height="70">
    <v-list-item>
      <v-list-item-avatar>
        <v-img alt="" src="https://cdn.vuetifyjs.com/images/lists/1.jpg" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>
          {{ $t("good") }} {{ state.timeOfDay.toLowerCase() }}, <b>Username</b>!
        </v-list-item-title>
        <v-list-item-subtitle>
          <v-icon small color="success">mdi-check-circle</v-icon>
          Verified account
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-spacer />
    <v-menu bottom left offset-y>
      <template #activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on" class="mr-3">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item @click="state.newTransactionDialog = true">
          <v-list-item-title>
            New transaction
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            New transfer
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            New account
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <new-transaction-dialog v-model="state.newTransactionDialog" />
  </v-app-bar>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  reactive
} from "@vue/composition-api";
import RouteNames from "../constants/routeNames";
import NewTransactionDialog from "@/components/NewTransactionDialog.vue";

interface State {
  routeNames: RouteNames;
  timeOfDay: string;
  newTransactionDialog: boolean;
}

export default defineComponent({
  name: "app-bar",
  components: {
    NewTransactionDialog
  },
  setup() {
    const vm = getCurrentInstance();

    const state: State = reactive({
      newTransactionDialog: false,
      routeNames: RouteNames,
      timeOfDay: computed(() => {
        const hours = new Date().getHours();
        const minutes = new Date().getMinutes();
        if (hours >= 6 && hours <= 11 && minutes <= 59) {
          return vm?.$t("morning") as string;
        } else if (hours >= 12 && hours <= 17) {
          return vm?.$t("afternoon") as string;
        } else {
          return vm?.$t("evening") as string;
        }
      })
    });

    return {
      state
    };
  }
});
</script>
