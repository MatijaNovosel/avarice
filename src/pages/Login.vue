<template>
  <q-page class="row justify-center items-center">
    <div class="column text-center">
      <span class="text-h3 q-mb-lg text-bold text-yellow">Avarice</span>
      <q-card flat class="q-pa-md shadow-1 rounded">
        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input
              v-model="state.login.email"
              :disabled="state.loading"
              square
              filled
              clearable
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
              v-model="state.login.password"
              :disabled="state.loading"
              square
              filled
              clearable
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
            unelevated
            color="yellow"
            size="md"
            class="full-width text-black"
            label="Login"
            :disable="$v.$invalid"
            @click="login"
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
import IAccountService from "@/api/interfaces/accountService";
import IAuthService from "@/api/interfaces/authService";
import ICategoryService from "@/api/interfaces/categoryService";
import { getService, Types } from "@/di-container";
import { DecodedToken } from "@/models/auth";
import ROUTE_NAMES from "@/router/routeNames";
import { useUserStore } from "@/stores/user";
import { collectErrors } from "@/utils/helpers";
import useVuelidate from "@vuelidate/core";
import { email, required } from "@vuelidate/validators";
import { jwtDecode } from "jwt-decode";
import { useQuasar } from "quasar";
import { reactive } from "vue";
import { useRouter } from "vue-router";

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

const state: State = reactive({
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

    const decodedToken: DecodedToken = jwtDecode(data.token as string);

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
    userStore.setSelectedAccount(accounts[0]);

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
