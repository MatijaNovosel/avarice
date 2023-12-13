<template>
  <q-page class="row justify-center items-center">
    <div class="column text-center">
      <span class="text-h3 q-mb-lg text-bold text-yellow">Avarice</span>
      <q-card flat class="q-pa-md shadow-1 rounded">
        <q-card-section>
          <vv-form as="q-form" class="q-gutter-md" @submit="login">
            <vv-field v-slot="{ field, errors }" name="email" label="Email" rules="email|required">
              <q-input
                :disabled="state.loading"
                square
                filled
                clearable
                v-model="state.login.email"
                v-bind="field"
                type="email"
                dense
                label="Email"
                :error-message="errors.join('')"
                :error="!!errors.length"
                :hide-bottom-space="!errors.length"
              >
                <template #prepend>
                  <q-icon name="mdi-email" />
                </template>
              </q-input>
            </vv-field>
            <vv-field v-slot="{ field, errors }" name="password" label="Password" rules="required">
              <q-input
                :disabled="state.loading"
                square
                filled
                clearable
                v-model="state.login.password"
                v-bind="field"
                dense
                type="password"
                label="Password"
                :error-message="errors.join('')"
                :error="!!errors.length"
                :hide-bottom-space="!errors.length"
              >
                <template #prepend>
                  <q-icon name="mdi-lock" />
                </template>
              </q-input>
            </vv-field>
            <q-btn
              :loading="state.loading"
              unelevated
              color="yellow"
              size="md"
              class="text-black"
              label="Login"
              type="submit"
            />
          </vv-form>
        </q-card-section>
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
import { onKeyStroke } from "@vueuse/core";
import jwt_decode from "jwt-decode";
import { useQuasar } from "quasar";
import IAccountService from "src/api/interfaces/accountService";
import IAuthService from "src/api/interfaces/authService";
import ICategoryService from "src/api/interfaces/categoryService";
import ITemplateService from "src/api/interfaces/templateService";
import { Types, getService } from "src/di-container";
import { DecodedToken } from "src/models/auth";
import ROUTE_NAMES from "src/router/routeNames";
import { useUserStore } from "src/stores/user";
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

const state: State = reactive({
  loading: false,
  login: {
    password: null,
    email: null
  }
});

const login = async () => {
  console.log("xdd");
  state.loading = true;

  try {
    const { accessToken, refreshToken } = await getService<IAuthService>(Types.AuthService).login(
      state.login.email as string,
      state.login.password as string
    );

    const decodedToken = jwt_decode<DecodedToken>(accessToken as string);

    userStore.login({
      id: decodedToken.userId,
      email: state.login.email as string,
      userName: "username",
      emailConfirmed: false,
      token: accessToken,
      refreshToken,
      exp: decodedToken.exp,
      iat: decodedToken.iat
    });

    const categories = await getService<ICategoryService>(
      Types.CategoryService
    ).getUserCategories();
    const accounts = await getService<IAccountService>(Types.AccountService).getLatestValues();
    const templates = await getService<ITemplateService>(Types.TemplateService).getAll();

    userStore.setCategories(categories);
    userStore.setAccounts(accounts);
    userStore.setSelectedAccount(accounts[0]);
    userStore.setTemplates(templates);

    $q.notify({
      message: "Successfully logged in!",
      color: "dark",
      textColor: "green",
      position: "bottom"
    });

    if (accounts.length !== 0) {
      await router.push({ name: ROUTE_NAMES.DASHBOARD });
    } else {
      await router.push({ name: ROUTE_NAMES.ACCOUNT_SETUP });
    }
  } catch (e) {
    $q.notify({
      message: "Error while signing in!",
      color: "dark",
      textColor: "red",
      position: "bottom"
    });
  } finally {
    state.loading = false;
  }
};

onKeyStroke("Enter", () => {
  login();
});
</script>
