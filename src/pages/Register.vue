<template>
  <q-page class="row justify-center items-center">
    <div class="column text-center">
      <span class="text-h3 q-mb-lg text-bold text-yellow">Avarice</span>
      <q-card flat class="q-pa-md shadow-1 rounded">
        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input
              v-model="state.auth.username"
              :disabled="state.loading"
              square
              filled
              clearable
              dense
              label="Username"
            >
              <template #prepend>
                <q-icon name="mdi-account" />
              </template>
            </q-input>
            <q-input
              v-model="state.auth.email"
              :disabled="state.loading"
              square
              filled
              clearable
              type="email"
              dense
              label="Email"
            >
              <template #prepend>
                <q-icon name="mdi-email" />
              </template>
            </q-input>
            <q-input
              v-model="state.auth.password"
              :disabled="state.loading"
              square
              filled
              clearable
              dense
              type="password"
              label="Password"
              autocomplete="new-password"
            >
              <template #prepend>
                <q-icon name="mdi-lock" />
              </template>
            </q-input>
          </q-form>
        </q-card-section>
        <q-card-actions class="q-px-md">
          <q-btn
            :loading="state.loading"
            unelevated
            color="yellow"
            size="md"
            class="full-width text-black"
            label="Register"
            :disable="$v.$invalid"
            @click="register"
          />
        </q-card-actions>
        <q-card-section class="text-center q-pa-none">
          <router-link class="text-grey-6" :to="{ name: ROUTE_NAMES.LOGIN }"> Sign in </router-link>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { useQuasar } from "quasar";
import IAuthService from "src/api/interfaces/authService";
import { Types, getService } from "src/di-container";
import ROUTE_NAMES from "src/router/routeNames";
import { reactive } from "vue";

interface State {
  loading: boolean;
  auth: {
    username: string | null;
    password: string | null;
    email: string | null;
  };
}

const $q = useQuasar();

const mustMeetRequirements = (value: string) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(value);

const state: State = reactive({
  loading: false,
  auth: {
    username: null,
    password: null,
    email: null
  }
});

const register = async () => {
  state.loading = true;

  try {
    const { accessToken, refreshToken } = await getService<IAuthService>(
      Types.AuthService
    ).register(
      state.auth.username as string,
      state.auth.email as string,
      state.auth.password as string
    );

    $q.notify({
      message: "Successfully registered an account!",
      color: "dark",
      textColor: "green",
      position: "bottom"
    });

    state.loading = false;
    state.auth = {
      username: null,
      password: null,
      email: null
    };
  } catch (e) {
    $q.notify({
      message: (e as Error).message,
      color: "dark",
      textColor: "red",
      position: "bottom"
    });
    state.loading = false;
  }
};
</script>
