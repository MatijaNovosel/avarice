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
    <group-box
      icon="palette"
      title="Boje grafova"
      class="p-my-5 p-shadow-6"
      style="position: relative"
    >
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
    </group-box>
    <template #footer>
      <btn
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
import { UserSettingsService } from "@/services/api/user-settings-service";
import { UserSettings } from "@/models/user-settings";

interface Props {
  dialog: boolean;
}

interface State {
  settings: UserSettings;
  dialog: boolean;
  userSettingsService: UserSettingsService;
  // eslint-disable-next-line
  refresh: any;
}

export default defineComponent({
  name: "settings-dialog",
  props: {
    dialog: Boolean
  },
  setup(props: Props, context: SetupContext) {
    const state: State = reactive({
      dialog: props.dialog,
      settings: {
        gyroColor: "",
        checkingColor: "",
        totalColor: "",
        pocketColor: ""
      },
      userSettingsService: new UserSettingsService(),
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
      await state.userSettingsService.saveSettings(state.settings);
      state.dialog = false;
      state.refresh.refresh();
    }

    onMounted(async () => {
      state.settings = await state.userSettingsService.getSettings();
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
</style>
