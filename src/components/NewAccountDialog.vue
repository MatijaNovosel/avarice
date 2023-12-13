<template>
  <q-dialog v-model="accountDialogOpen" persistent>
    <q-card flat style="min-width: 700px">
      <q-card-section class="row justify-between items-center">
        <span class="text-h6"> New account </span>
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
            suffix="EUR"
          >
            <template #prepend>
              <q-icon name="mdi-bank" />
            </template>
          </q-input>
        </q-form>
      </q-card-section>
      <q-card-actions class="q-px-md q-pb-md justify-end">
        <q-btn
          :loading="state.loading"
          @click="createAccount"
          unelevated
          color="accent"
          label="Create account"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import IAccountService from "src/api/interfaces/accountService";
import { Types, getService } from "src/di-container";
import { useAppStore } from "src/stores/app";
import { useUserStore } from "src/stores/user";
import { reactive } from "vue";

interface State {
  loading: boolean;
  data: {
    name: string;
    initialBalance: string;
  };
}

const state: State = reactive({
  loading: false,
  data: {
    initialBalance: "0",
    name: ""
  }
});

const $q = useQuasar();
const appStore = useAppStore();
const { accountDialogOpen } = storeToRefs(appStore);
const userStore = useUserStore();

const closeDialog = () => {
  state.data = {
    initialBalance: "0",
    name: ""
  };
  appStore.toggleAccountDialog();
};

const createAccount = async () => {
  try {
    state.loading = true;

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

    closeDialog();
  } catch (e) {
    $q.notify({
      message: (e as Error).message,
      color: "dark",
      textColor: "red",
      position: "bottom"
    });
  } finally {
    state.loading = false;
  }
};
</script>
