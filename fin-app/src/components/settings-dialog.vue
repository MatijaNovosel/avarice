<template>
  <p-dialog
    @hide="hideDialog"
    :maximizable="true"
    :modal="true"
    v-model:visible="state.dialog"
    :style="{ width: '50vw' }"
  >
    <template #header>
      <h3>Postavke</h3>
    </template>
    <div class="p-my-5 p-shadow-6 graph-settings-container">
      <div class="p-grid p-formgrid p-mt-3">
        <div class="p-field p-col-12">
          <p-color-picker v-model="state.settings.gyroColor" />
          <span class="p-ml-3">Žiro račun</span>
        </div>
        <div class="p-field p-col-12">
          <p-color-picker v-model="state.settings.checkingColor" />
          <span class="p-ml-3">Tekući račun</span>
        </div>
        <div class="p-field p-col-12">
          <p-color-picker v-model="state.settings.pocketColor" />
          <span class="p-ml-3">Džep (novčanik)</span>
        </div>
        <div class="p-field p-col-12">
          <p-color-picker v-model="state.settings.totalColor" />
          <span class="p-ml-3">Ukupno</span>
        </div>
      </div>
    </div>
    <template #footer>
      <progress-spinner
        strokeWidth="10"
        style="width: 25px; height: 25px"
        class="p-mr-4"
        v-if="state.loading"
      />
      <btn
        v-else
        @click="save"
        label="Spremi"
        icon="pi pi-save"
        class="p-button-raised p-button-success"
      />
    </template>
  </p-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  SetupContext,
  watch,
  onMounted,
  inject
} from "vue";
import { UserSettings } from "@/models/user-settings";
import { getService, Types } from "@/di-container";
import { ISettingsService } from "@/services/interfaces/settings-service";

interface Props {
  dialog: boolean;
}

interface State {
  settings: UserSettings;
  dialog: boolean;
  loading: boolean;
  // eslint-disable-next-line
  refresh: any;
}

export default defineComponent({
  name: "settings-dialog",
  emits: ["update:dialog"],
  props: {
    dialog: Boolean
  },
  setup(props: Props, context: SetupContext) {
    const state: State = reactive({
      dialog: props.dialog,
      loading: false,
      settings: {
        gyroColor: "",
        checkingColor: "",
        totalColor: "",
        pocketColor: ""
      },
      refresh: inject("refresh")
    });

    watch(
      () => props.dialog,
      (val) => (state.dialog = val)
    );

    function hideDialog() {
      context.emit("update:dialog", state.dialog);
    }

    async function save() {
      state.loading = true;
      await getService<ISettingsService>(Types.SettingsService).saveSettings(
        state.settings
      );
      state.dialog = false;
      state.refresh.refresh();
      state.loading = false;
    }

    onMounted(async () => {
      state.settings = await getService<ISettingsService>(
        Types.SettingsService
      ).getSettings();
    });

    return {
      state,
      hideDialog,
      save
    };
  }
});
</script>

<style>
.graph-settings-container {
  padding: 1.5em;
  border-radius: 12px;
  background-color: #1e1e1e;
}
</style>
