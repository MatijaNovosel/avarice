<template>
  <div class="center-page d-flex flex-column justify-center align-center">
    <v-card class="rounded-lg elevation-2" :max-width="state.width">
      <div class="py-2">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold">
              Sign into FinApp
            </v-list-item-title>
            <v-list-item-subtitle class="d-none d-sm-block">
              Track your expenses
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </div>
      <v-divider />
      <v-card-text class="pt-5">
        <validation-observer v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(login)">
            <v-row>
              <v-col cols="12">
                <validation-provider
                  vid="email"
                  :name="$t('email')"
                  rules="required|email"
                  v-slot="{ errors, required }"
                >
                  <v-text-field
                    prepend-icon="mdi-email"
                    v-model="state.email"
                    :error-messages="errors"
                    hide-details="auto"
                    dense
                  >
                    <template #label>
                      <required-icon v-show="required" />
                      <span>{{ $t("email") }}</span>
                    </template>
                  </v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider
                  vid="password"
                  :name="$t('password')"
                  rules="required"
                  v-slot="{ errors, required }"
                >
                  <v-text-field
                    :type="state.showPassword ? 'text' : 'password'"
                    v-model="state.password"
                    prepend-icon="mdi-lock"
                    :error-messages="errors"
                    hide-details="auto"
                    dense
                  >
                    <template #label>
                      <required-icon v-show="required" />
                      <span>{{ $t("password") }}</span>
                    </template>
                    <template #append>
                      <v-btn
                        icon
                        small
                        @click="state.showPassword = !state.showPassword"
                      >
                        <v-icon
                          v-text="
                            !state.showPassword ? 'mdi-eye' : 'mdi-eye-off'
                          "
                        />
                      </v-btn>
                    </template>
                  </v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" class="text-center text-md-right mt-2">
                <v-btn
                  :loading="state.loading"
                  :disabled="state.loading"
                  small
                  type="submit"
                  color="primary"
                >
                  {{ $t("submit") }}
                </v-btn>
              </v-col>
            </v-row>
          </form>
        </validation-observer>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import RouteNames from "@/constants/routeNames";
import { getService, Types } from "@/di-container";
import { IAuthService } from "@/interfaces/authService";
import { Snackbar } from "@/models/appNotifications";
import { DecodedToken } from "@/models/auth";
import {
  computed,
  defineComponent,
  getCurrentInstance,
  reactive,
  SetupContext
} from "@vue/composition-api";
import jwt_decode from "jwt-decode";

interface State {
  email: string | null;
  password: string | null;
  showPassword: boolean;
  loading: boolean;
  width: number;
}

export default defineComponent({
  setup(props, context: SetupContext) {
    const vm = getCurrentInstance();

    const state: State = reactive({
      password: null,
      email: null,
      showPassword: false,
      loading: false,
      width: computed(() => {
        switch (vm?.$vuetify.breakpoint.name) {
          case "xs":
            return 300;
          case "sm":
            return 400;
          case "md":
            return 500;
          case "lg":
            return 600;
          case "xl":
            return 700;
          default:
            return 500;
        }
      })
    });

    async function login() {
      state.loading = true;

      const data = await getService<IAuthService>(Types.AuthService).login(
        state.email as string,
        state.password as string
      );

      if (!data.result) {
        await context.root.$store.dispatch("app/showSnackbar", {
          color: "error",
          message: data.errors?.join(", "),
          timeout: 3000
        } as Snackbar);
        state.loading = false;
        return;
      }

      const decodedToken: DecodedToken = jwt_decode(data.token as string);

      await context.root.$store.dispatch("user/login", {
        id: decodedToken.Id,
        email: state.email,
        userName: decodedToken.unique_name,
        emailConfirmed: false,
        token: data.token
      });

      await context.root.$store.dispatch("app/showSnackbar", {
        color: "success",
        message: "Logged in successfully",
        timeout: 3000
      } as Snackbar);

      state.loading = false;
      context.root.$router.push({ name: RouteNames.DASHBOARD });
    }

    return {
      login,
      state
    };
  }
});
</script>

<style scoped lang="sass">
.center-page
  width: 100vw
  height: 100vh
</style>
