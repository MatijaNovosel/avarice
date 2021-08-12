<template>
  <q-page
    class="
      bg-light-green
      window-height window-width
      row
      justify-center
      items-center
    "
  >
    <div class="row">
      <q-card bordered class="q-pa-md shadow-1 rounded">
        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input
              square
              filled
              clearable
              v-model="state.email"
              type="email"
              label="Email"
            >
              <template #append>
                <q-icon name="mdi-email" />
              </template>
            </q-input>
            <q-input
              square
              filled
              clearable
              v-model="state.password"
              type="password"
              label="Password"
            >
              <template #append>
                <q-icon name="mdi-account" />
              </template>
            </q-input>
          </q-form>
        </q-card-section>
        <q-card-actions class="q-px-md">
          <q-btn
            unelevated
            color="light-green-7"
            size="md"
            class="full-width"
            label="Login"
          />
        </q-card-actions>
        <q-card-section class="text-center q-pa-none">
          <p class="text-grey-6">Create an account</p>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { DecodedToken } from "src/models/auth";
import jwt_decode from "jwt-decode";
import { getService, Types } from "src/di-container";
import IAuthService from "src/api/interfaces/authService";
import ROUTE_NAMES from "src/router/routeNames";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

interface State {
  email: string | null;
  password: string | null;
  loading: boolean;
}

export default defineComponent({
  name: "Login",
  setup() {
    const store = useStore();
    const router = useRouter();

    const state: State = reactive({
      loading: false,
      email: null,
      password: null
    });

    async function login() {
      state.loading = true;

      const data = await getService<IAuthService>(Types.AuthService).login(
        state.email as string,
        state.password as string
      );

      const decodedToken: DecodedToken = jwt_decode(data.token as string);

      await store.dispatch("user/login", {
        id: decodedToken.Id,
        email: state.email,
        userName: decodedToken.unique_name,
        emailConfirmed: false,
        token: data.token
      });

      state.loading = false;
      await router.push({ name: ROUTE_NAMES.DASHBOARD });
    }

    return {
      state,
      login
    };
  }
});
</script>