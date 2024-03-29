<template>
  <q-page class="row justify-center items-center">
    <div class="column text-center">
      <span class="text-h3 q-mb-lg text-bold text-yellow">Avarice</span>
      <q-card flat class="q-pa-md shadow-1 rounded">
        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input
              :disabled="state.loading"
              square
              filled
              clearable
              v-model="state.auth.username"
              dense
              label="Username"
              :error="$v.username.$error"
              :error-message="collectErrors($v.username.$errors)"
              :hide-bottom-space="!$v.username.$error"
            >
              <template #prepend>
                <q-icon name="mdi-account" />
              </template>
            </q-input>
            <q-input
              :disabled="state.loading"
              square
              filled
              clearable
              v-model="state.auth.email"
              type="email"
              dense
              label="Email"
              :error="$v.email.$error"
              :error-message="collectErrors($v.email.$errors)"
              :hide-bottom-space="!$v.email.$error"
            >
              <template #prepend>
                <q-icon name="mdi-email" />
              </template>
            </q-input>
            <q-input
              :disabled="state.loading"
              square
              filled
              clearable
              v-model="state.auth.password"
              dense
              type="password"
              label="Password"
              autocomplete="new-password"
              :error="$v.password.$error"
              :error-message="collectErrors($v.password.$errors)"
              :hide-bottom-space="!$v.password.$error"
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
            @click="register"
            unelevated
            color="yellow"
            size="md"
            class="full-width text-black"
            label="Register"
            :disable="$v.$invalid"
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
import useVuelidate from "@vuelidate/core";
import { email, helpers, minLength, required } from "@vuelidate/validators";
import { useQuasar } from "quasar";
import IAuthService from "src/api/interfaces/authService";
import { getService, Types } from "src/di-container";
import ROUTE_NAMES from "src/router/routeNames";
import { collectErrors } from "src/utils/helpers";
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

const rules = {
  password: {
    required,
    $autoDirty: true,
    mustMeetRequirements: helpers.withMessage(
      "Password must be max 8 characters, have one special character and a number!",
      mustMeetRequirements
    )
  },
  username: { required, minLength: minLength(5), $autoDirty: true },
  email: { required, email, $autoDirty: true }
};

const state: State = reactive({
  loading: false,
  auth: {
    username: null,
    password: null,
    email: null
  }
});

const $v = useVuelidate(rules, state.auth);

const register = async () => {
  state.loading = true;

  try {
    const data = await getService<IAuthService>(Types.AuthService).register(
      state.auth.username as string,
      state.auth.email as string,
      state.auth.password as string
    );

    if (!data.result) {
      $q.notify({
        message: data.errors?.join(", "),
        color: "dark",
        textColor: "red",
        position: "bottom"
      });
      state.loading = false;
      return;
    }

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
    $v.value.$reset();
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
