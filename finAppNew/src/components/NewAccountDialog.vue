<template>
  <v-dialog
    persistent
    v-model="state.open"
    max-width="50%"
    :fullscreen="$vuetify.breakpoint.xs"
  >
    <v-card>
      <v-card-title>
        <span
          class="text-overline"
          :style="{
            'font-size':
              $vuetify.breakpoint.xs || $vuetify.breakpoint.sm ? '15px' : '20px'
          }"
        >
          New account
        </span>
        <v-spacer />
        <v-btn @click="resetNewAccountDialog" small icon class="mr-3">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-card-text class="pb-0">
        <validation-observer ref="newAccountFormRef" v-slot="{ handleSubmit }">
          <form @submit.prevent="handleSubmit(addNewTransfer)">
            <v-row class="mt-1">
              <v-col cols="12">
                <validation-provider
                  vid="startingAmount"
                  :name="$t('startingAmount')"
                  rules="required|numberWithComma"
                  v-slot="{ errors, valid, untouched, required, failed }"
                >
                  <v-text-field
                    outlined
                    :error-messages="errors"
                    :hide-details="valid || (untouched && !failed)"
                    dense
                    v-model="state.startingAmount"
                    clearable
                    suffix="HRK"
                  >
                    <template #label>
                      <required-icon v-show="required" />
                      <span>{{ $t("startingAmount") }}</span>
                    </template>
                  </v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider
                  vid="newAccountName"
                  :name="$t('newAccountName')"
                  rules="required|min:4"
                  v-slot="{ errors, valid, untouched, required, failed }"
                >
                  <v-text-field
                    outlined
                    :error-messages="errors"
                    :hide-details="valid || (untouched && !failed)"
                    dense
                    v-model="state.newAccountName"
                    clearable
                  >
                    <template #label>
                      <required-icon v-show="required" />
                      <span>{{ $t("newAccountName") }}</span>
                    </template>
                  </v-text-field>
                </validation-provider>
              </v-col>
              <v-col cols="12" class="text-center text-md-right mt-2">
                <v-btn
                  :loading="state.loading"
                  :disabled="state.loading"
                  small
                  type="submit"
                  color="success"
                >
                  {{ $t("save") }}
                </v-btn>
              </v-col>
            </v-row>
          </form>
        </validation-observer>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  SetupContext,
  watch
} from "@vue/composition-api";
import { ValidationObserver } from "@/models/validationObserver";

interface State {
  startingAmount: string | null;
  newAccountName: string | null;
  loading: boolean;
  open?: boolean;
}

interface Props {
  value?: boolean;
}

export default defineComponent({
  name: "new-account-dialog",
  props: {
    value: null
  },
  setup(props: Props, context: SetupContext) {
    const vm = getCurrentInstance();

    const state: State = reactive({
      paymentSources: [],
      startingAmount: null,
      newAccountName: null,
      loading: false,
      open: false
    });

    function resetNewAccountDialog() {
      state.startingAmount = null;
      state.newAccountName = null;
      ((vm?.$refs.newAccountFormRef as any) as ValidationObserver).reset();
      state.open = false;
      context.emit("input", state.open);
      context.emit("close");
    }

    async function addNewTransfer() {
      state.loading = true;

      // Save new account here

      resetNewAccountDialog();
      await context.root.$store.dispatch("app/refresh");
      state.loading = false;
    }

    watch(
      () => props.value,
      val => (state.open = val)
    );

    return {
      state,
      resetNewAccountDialog,
      addNewTransfer
    };
  }
});
</script>
