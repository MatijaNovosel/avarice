<template>
  <q-dialog v-model="state.open" persistent>
    <q-card style="min-width: 700px">
      <q-card-section class="row justify-between items-center">
        <span class="text-h6"> Add new account </span>
        <q-btn size="xs" @click="closeDialog" flat dense class="q-mr-md bg-grey-9 rounded">
          <q-icon class="q-pa-xs" name="mdi-close" size="xs" />
        </q-btn>
      </q-card-section>
      <q-separator />
      <q-card-section class="text-center">
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
          class="text-black q-mt-md"
          label="Create account"
          :disable="$v.$invalid"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { reactive, watch } from "vue";
import { required, numeric, minLength } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { collectErrors } from "src/utils/helpers";
import { useQuasar } from "quasar";
import IAccountService from "src/api/interfaces/accountService";
import { getService, Types } from "src/di-container";
import { useUserStore } from "src/stores/user";

interface State {
  open: boolean;
  loading: boolean;
  data: {
    name: string;
    initialBalance: string;
  };
}

const emit = defineEmits(["update:open"]);
const $q = useQuasar();

const rules = {
  initialBalance: { required, numeric, $autoDirty: true },
  name: { required, minLength: minLength(3), $autoDirty: true }
};

const state = reactive<State>({
  open: false,
  loading: false,
  data: {
    initialBalance: "0",
    name: ""
  }
});

const $v = useVuelidate(rules, state.data);
const userStore = useUserStore();

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
});

const closeDialog = () => {
  state.data = {
    initialBalance: "0",
    name: ""
  };
  $v.value.$reset();
  emit("update:open", false);
};

const createAccount = async () => {
  state.loading = true;

  try {
    await getService<IAccountService>(Types.AccountService).create({
      initialBalance: parseFloat(state.data.initialBalance),
      name: state.data.name
    });

    $q.notify({
      message: "Successfully created an account!",
      color: "dark",
      textColor: "green",
      position: "bottom"
    });

    const accounts = await getService<IAccountService>(Types.AccountService).getLatestValues();
    userStore.setAccounts(accounts);

    state.loading = false;
    closeDialog();
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

watch(
  () => props.open,
  (val) => (state.open = val)
);
</script>