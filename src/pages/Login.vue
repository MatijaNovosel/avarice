<template>
  <q-page class="bg-grey-3 window-height window-width row justify-center items-center">
    <div class="row">
      <q-card flat class="q-pa-md shadow-1 rounded">
        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input
              :disabled="state.loading"
              square
              filled
              clearable
              hide-bottom-space
              :error-message="emailErrors"
              :error="!!emailErrors"
              v-model="email"
              type="email"
              dense
              label="Email"
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
              hide-bottom-space
              v-model="password"
              :error-message="passwordErrors"
              :error="!!passwordErrors"
              dense
              type="password"
              label="Password"
            >
              <template #prepend>
                <q-icon name="mdi-account" />
              </template>
            </q-input>
          </q-form>
        </q-card-section>
        <q-card-actions class="q-px-md">
          <q-btn
            :loading="state.loading"
            @click="login"
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
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { useStore } from "src/store";
import { useForm, useField } from "vee-validate";
import { object, string } from "yup";

interface State {
  loading: boolean;
}

interface LoginFormSchema {
  password: string | null;
  email: string | null;
}

export default defineComponent({
  name: "Login",
  setup() {
    const store = useStore();
    const router = useRouter();
    const $q = useQuasar();

    const schema = object({
      email: string().required().email().label("Email"),
      password: string().required()
    });

    const { handleSubmit } = useForm<LoginFormSchema>({
      validationSchema: schema,
      initialValues: {
        password: "",
        email: ""
      }
    });

    const { value: email, errorMessage: emailErrors } = useField<string>("email");
    const { value: password, errorMessage: passwordErrors } = useField<string>("password");

    const state: State = reactive({
      loading: false
    });

    const login = handleSubmit(async () => {
      state.loading = true;

      try {
        const data = await getService<IAuthService>(Types.AuthService).login(
          email.value,
          password.value
        );

        if (!data.result) {
          $q.notify({
            message: data.errors?.join(", "),
            color: "red",
            position: "top"
          });
          state.loading = false;
          return;
        }

        const decodedToken: DecodedToken = jwt_decode(data.token as string);

        await store.dispatch("user/login", {
          id: decodedToken.Id,
          email: email.value,
          userName: decodedToken.unique_name,
          emailConfirmed: false,
          token: data.token
        });

        $q.notify({
          message: "Successfully logged in!",
          color: "green",
          position: "top"
        });

        state.loading = false;
        await router.push({ name: ROUTE_NAMES.DASHBOARD });
      } catch (e) {
        $q.notify({
          message: (e as Error).message,
          color: "red",
          position: "top"
        });
        state.loading = false;
      }
    });

    return {
      state,
      login,
      email,
      password,
      emailErrors,
      passwordErrors
    };
  }
});
</script>
