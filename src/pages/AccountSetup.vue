<template>
  <q-page padding class="bg-dark-1 column justify-center items-center">
    <q-card>
      <q-card-section>
        <div class="text-h6 q-mb-sm">Hold up!</div>
        <div class="text-subtitle2 text-grey-6">
          You'll need to set up at least 1 account before you use the application
        </div>
      </q-card-section>
      <q-separator dark inset />
      <q-card-section>
        <div class="q-pb-md text-center">Account data</div>
        <q-form class="q-gutter-md">
          <q-input
            :disabled="state.loading"
            square
            filled
            clearable
            v-model="state.data.name"
            dense
            label="Name"
            :error="$v.name.$error"
            :error-message="collectErrors($v.name.$errors)"
            :hide-bottom-space="!$v.name.$error"
          >
            <template #prepend>
              <q-icon name="mdi-tag" />
            </template>
          </q-input>
          <q-input
            :disabled="state.loading"
            square
            filled
            clearable
            v-model="state.data.initialBalance"
            dense
            label="Initial balance"
            suffix="HRK"
            :error="$v.initialBalance.$error"
            :error-message="collectErrors($v.initialBalance.$errors)"
            :hide-bottom-space="!$v.initialBalance.$error"
          >
            <template #prepend>
              <q-icon name="mdi-bank" />
            </template>
          </q-input>
        </q-form>
        <q-btn
          :loading="state.loading"
          @click="createAccount"
          unelevated
          color="yellow"
          size="md"
          class="text-black q-mt-md full-width"
          label="Create account"
          :disable="$v.$invalid"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang="ts" setup>
import { collectErrors } from "src/utils/helpers";
import useVuelidate from "@vuelidate/core";
import { required, numeric, minLength } from "@vuelidate/validators";
import { reactive } from "vue";
import { useQuasar } from "quasar";
import IAccountService from "src/api/interfaces/accountService";
import { getService, Types } from "src/di-container";
import { useUserStore } from "src/stores/user";
import { useRouter } from "vue-router";
import ROUTE_NAMES from "src/router/routeNames";

interface State {
  loading: boolean;
  data: {
    name: string;
    initialBalance: string;
  };
}

const rules = {
  initialBalance: { required, numeric, $autoDirty: true },
  name: { required, minLength: minLength(3), $autoDirty: true }
};

const state = reactive<State>({
  loading: false,
  data: {
    initialBalance: "0",
    name: ""
  }
});

const $v = useVuelidate(rules, state.data);
const $q = useQuasar();
const userStore = useUserStore();
const router = useRouter();

const createAccount = async () => {
  state.loading = true;

  try {
    const data = await getService<IAccountService>(Types.AccountService).create();

    const accounts = await getService<IAccountService>(Types.AccountService).getLatestValues();
    userStore.setAccounts(accounts);

    $q.notify({
      message: "Successfully created an account!",
      color: "dark",
      textColor: "green",
      position: "bottom"
    });

    state.loading = false;

    await router.push({ name: ROUTE_NAMES.DASHBOARD });
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
