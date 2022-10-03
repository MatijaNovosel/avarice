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
              v-model="state.login.email"
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
              v-model="state.login.password"
              dense
              type="password"
              label="Password"
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
            @click="login"
            unelevated
            color="yellow"
            size="md"
            class="full-width text-black"
            label="Login"
            :disable="$v.$invalid"
          />
        </q-card-actions>
        <q-card-section class="text-center q-pa-none">
          <router-link class="text-grey-6" :to="{ name: ROUTE_NAMES.REGISTER }">
            Create an account
          </router-link>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { DecodedToken } from "src/models/auth";
import jwt_decode from "jwt-decode";
import { getService, Types } from "src/di-container";
import IAuthService from "src/api/interfaces/authService";
import ROUTE_NAMES from "src/router/routeNames";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { required, email } from "@vuelidate/validators";
import ICategoryService from "src/api/interfaces/categoryService";
import IAccountService from "src/api/interfaces/accountService";
import useVuelidate from "@vuelidate/core";
import { collectErrors } from "src/utils/helpers";
import { useUserStore } from "src/stores/user";

interface State {
  loading: boolean;
  login: {
    password: string | null;
    email: string | null;
  };
}

const userStore = useUserStore();
const router = useRouter();
const $q = useQuasar();

const rules = {
  password: { required, $autoDirty: true },
  email: { required, email, $autoDirty: true }
};

const state = reactive<State>({
  loading: false,
  login: {
    password: null,
    email: null
  }
});

const $v = useVuelidate(rules, state.login);

const login = async () => {
  state.loading = true;

  try {
    const data = await getService<IAuthService>(Types.AuthService).login(
      state.login.email as string,
      state.login.password as string
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

    const decodedToken: DecodedToken = jwt_decode(data.token as string);

    userStore.login({
      id: decodedToken.Id,
      email: state.login.email as string,
      userName: decodedToken.unique_name,
      emailConfirmed: false,
      token: data.token as string
    });

    const categories = await getService<ICategoryService>(
      Types.CategoryService
    ).getUserCategories();

    const accounts = await getService<IAccountService>(Types.AccountService).getLatestValues();

    userStore.setCategories(categories);
    userStore.setAccounts(accounts);

    $q.notify({
      message: "Successfully logged in!",
      color: "dark",
      textColor: "green",
      position: "bottom"
    });

    state.loading = false;

    if (accounts.length !== 0) {
      await router.push({ name: ROUTE_NAMES.DASHBOARD });
    } else {
      await router.push({ name: ROUTE_NAMES.ACCOUNT_SETUP });
    }
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
