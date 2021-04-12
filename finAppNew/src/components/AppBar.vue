<template>
  <v-app-bar dense app class="elevation-1" height="65">
    <v-list-item v-if="state.user">
      <v-list-item-avatar>
        <img alt="" :src="state.user.photoUrl || '/defaultUser.jpg'" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>
          {{ $t("good") }} {{ state.timeOfDay.toLowerCase() }},
          <b> {{ state.user.displayName }} </b>!
        </v-list-item-title>
        <v-list-item-subtitle class="pt-1">
          <v-icon
            small
            v-text="
              state.user.emailConfirmed
                ? 'mdi-check-circle'
                : 'mdi-close-circle'
            "
            :color="state.user.emailConfirmed ? 'success' : 'error'"
          />
          {{
            state.user.emailConfirmed
              ? "Verified account"
              : "Unverified account"
          }}
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
            {{ $t("newTransaction") }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="state.newTransferDialog = true">
          <v-list-item-title>
            {{ $t("newTransfer") }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item @click="state.newAccountDialog = true">
          <v-list-item-title>
            {{ $t("newAccount") }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <new-transaction-dialog v-model="state.newTransactionDialog" />
    <new-transfer-dialog v-model="state.newTransferDialog" />
    <new-account-dialog v-model="state.newAccountDialog" />
    <v-progress-linear
      :active="state.loading"
      :indeterminate="state.loading"
      absolute
      bottom
    />
  </v-app-bar>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  getCurrentInstance,
  reactive,
  SetupContext,
  watch
} from "@vue/composition-api";
import RouteNames from "../constants/routeNames";
import NewTransactionDialog from "@/components/NewTransactionDialog.vue";
import NewAccountDialog from "@/components/NewAccountDialog.vue";
import NewTransferDialog from "@/components/NewTransferDialog.vue";
import { AppUser } from "@/models/user";

interface Props {
  loading: boolean;
}

interface State {
  routeNames: RouteNames;
  timeOfDay: string;
  user: AppUser;
  newTransactionDialog: boolean;
  newTransferDialog: boolean;
  newAccountDialog: boolean;
  loading: boolean;
}

export default defineComponent({
  name: "app-bar",
  props: {
    loading: null
  },
  components: {
    NewTransactionDialog,
    NewTransferDialog,
    NewAccountDialog
  },
  setup(props: Props, context: SetupContext) {
    const vm = getCurrentInstance();

    const state: State = reactive({
      loading: props.loading,
      newTransactionDialog: false,
      newTransferDialog: false,
      newAccountDialog: false,
      routeNames: RouteNames,
      user: computed(() => {
        return context.root.$store.getters["user/data"] as AppUser;
      }),
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

    watch(
      () => props.loading,
      val => (state.loading = val)
    );

    return {
      state
    };
  }
});
</script>
