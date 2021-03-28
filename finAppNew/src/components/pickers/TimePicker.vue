<template>
  <v-dialog v-if="state.dialog" v-model="state.display" width="340">
    <template #activator="{ on }">
      <v-text-field
        v-bind="state.textFieldProps"
        :disabled="state.disabled"
        :loading="state.loading"
        :name="state.name"
        :label="state.label"
        :value="state.timeFormatted"
        v-on="on"
        readonly
      >
        <template #progress>
          <slot name="progress">
            <v-progress-linear color="primary" indeterminate absolute height="2"></v-progress-linear>
          </slot>
        </template>
      </v-text-field>
    </template>

    <v-time-picker
      ref="time"
      v-model="state.time"
      v-bind="state.timePickerProps"
      full-width
      @change="timePickerChanged"
    ></v-time-picker>
  </v-dialog>
  <v-menu
    v-else
    ref="display"
    v-model="state.display"
    transition="scale-transition"
    offset-y
    max-width="290"
    min-width="290"
  >
    <template #activator="{ on }">
      <v-text-field
        v-bind="state.textFieldProps"
        :disabled="state.disabled"
        :loading="state.loading"
        :name="state.name"
        :label="state.label"
        :value="state.timeFormatted"
        v-on="on"
        readonly
      >
        <template #progress>
          <slot name="progress">
            <v-progress-linear color="primary" indeterminate absolute height="2"></v-progress-linear>
          </slot>
        </template>
      </v-text-field>
    </template>

    <v-time-picker
      ref="time"
      v-model="state.time"
      v-bind="state.timePickerProps"
      full-width
      @change="timePickerChanged"
    ></v-time-picker>
  </v-menu>
</template>

<script lang="ts">
import {
  defineComponent,
  SetupContext,
  reactive,
  computed,
  watch
} from "@vue/composition-api";

interface Props {
  value?: Date;
  disabled: false;
  loading: false;
  label: string;
  dialog: false;
  name: string;
  textFieldProps: Record<string, any>;
  timePickerProps: Record<string, any>;
}

export default defineComponent({
  name: "time-picker",

  props: {
    value: null,
    disabled: null,
    loading: null,
    label: null,
    dialog: null,
    name: null,
    textFieldProps: Object,
    timePickerProps: Object
  },

  model: {
    prop: "value",
    event: "input"
  },

  setup(props: Props, context: SetupContext) {
    const state = reactive({
      disabled: props.disabled,
      loading: props.loading,
      label: props.label,
      dialog: props.dialog,
      name: name,
      textFieldProps: props.textFieldProps,
      timePickerProps: props.timePickerProps,
      display: false,
      time:
        props.value != null
          ? props.value
          : null,
      timeFormatted: computed(() => {
        return state.time;
      })
    });

    function timePickerChanged() {
      state.display = false;

      context.emit("input", state.time);
    }

    watch(
      () => props.value,
      (val) => {
        state.time = val;
      }
    );

    watch(
      () => props.textFieldProps,
      (val) => (state.textFieldProps = val)
    );

    return {
      state,
      timePickerChanged
    };
  }
});
</script>