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
    <div class="graph-settings-container">
      <div>
        <div>
          <p-color-picker v-model="state.settings.gyroGraphColor" />
          <span>Gyro</span>
        </div>
        <div>
          <p-color-picker v-model="state.settings.checkingGraphColor" />
          <span>Checking</span>
        </div>
        <div>
          <p-color-picker v-model="state.settings.pocketGraphColor" />
          <span>Pocket</span>
        </div>
        <div>
          <p-color-picker v-model="state.settings.totalGraphColor" />
          <span>Total</span>
        </div>
      </div>
    </div>
    <template #footer>
      <progress-spinner
        strokeWidth="10"
        style="width: 25px; height: 25px"
        v-if="state.loading"
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
import { UpdateUserSettingsDto, UserSettings } from "@/models/user-settings";
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
        checkingGraphColor: "",
        gyroGraphColor: "",
        pocketGraphColor: "",
        totalGraphColor: "",
        gyroGraphVisible: false,
        checkingGraphVisible: false,
        pocketGraphVisible: false,
        totalGraphVisible: false
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

      const settings = { ...state.settings };
      settings.checkingGraphColor = "#" + settings.checkingGraphColor;
      settings.gyroGraphColor = "#" + settings.gyroGraphColor;
      settings.totalGraphColor = "#" + settings.totalGraphColor;
      settings.pocketGraphColor = "#" + settings.pocketGraphColor;

      const payload: UpdateUserSettingsDto = {
        ...settings,
        appUserId: 1
      };

      await getService<ISettingsService>(Types.SettingsService).saveSettings(
        payload
      );
      state.dialog = false;
      state.refresh.refresh();
      state.loading = false;
    }

    onMounted(async () => {
      const settings = await getService<ISettingsService>(
        Types.SettingsService
      ).getSettings(1);

      settings.checkingGraphColor = settings.checkingGraphColor?.replace(
        "#",
        ""
      );
      settings.pocketGraphColor = settings.pocketGraphColor?.replace("#", "");
      settings.totalGraphColor = settings.totalGraphColor?.replace("#", "");
      settings.gyroGraphColor = settings.gyroGraphColor?.replace("#", "");

      state.settings = settings;
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
