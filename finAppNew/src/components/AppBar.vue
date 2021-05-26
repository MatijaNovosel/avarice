<template>
  <v-app-bar clipped-right app class="elevation-3" height="65">
    <v-list-item v-if="state.user" class="pl-15">
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
import { User } from "@/models/user";

interface Props {
  loading: boolean;
}

interface State {
  routeNames: RouteNames;
  timeOfDay: string;
  user: User;
  loading: boolean;
}

export default defineComponent({
  name: "app-bar",
  props: {
    loading: null
  },
  setup(props: Props, context: SetupContext) {
    const vm = getCurrentInstance();

    const state: State = reactive({
      loading: props.loading,
      routeNames: RouteNames,
      user: computed(() => {
        return context.root.$store.getters["user/data"] as User;
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
