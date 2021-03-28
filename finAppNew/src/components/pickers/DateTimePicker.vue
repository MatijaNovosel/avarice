<template>
  <v-dialog v-if="dialog" v-model="display" width="340">
    <template #activator="{ on }">
      <v-text-field
        v-bind="state.textFieldProps"
        :disabled="state.disabled"
        :loading="state.loading"
        :name="state.name"
        :label="state.label"
        :value="state.dateTimeFormatted"
        v-on="on"
        readonly
      >
        <template #progress>
          <slot name="progress">
            <v-progress-linear
              color="primary"
              indeterminate
              absolute
              height="2"
            ></v-progress-linear>
          </slot>
        </template>
      </v-text-field>
    </template>

    <date-time-tab
      v-model="state.dateTime"
      :datePickerProps="state.datePickerProps"
      :timePickerProps="state.timePickerProps"
    ></date-time-tab>
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
        :value="state.dateTimeFormatted"
        v-on="on"
        readonly
      >
        <template #progress>
          <slot name="progress">
            <v-progress-linear
              color="primary"
              indeterminate
              absolute
              height="2"
            ></v-progress-linear>
          </slot>
        </template>
      </v-text-field>
    </template>

    <date-time-tab
      v-model="state.dateTime"
      :datePickerProps="state.datePickerProps"
      :timePickerProps="state.timePickerProps"
      @change="dateTimePickerChanged"
    ></date-time-tab>
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
import DateTimeTab from "./DateTimeTab.vue";
import { stat } from "fs";
import formatISO from "date-fns/formatISO";
import parseISO from "date-fns/parseISO";

interface Props {
  value?: string;
  disabled: false;
  loading: false;
  label: string;
  dialog: false;
  name: string;
  errorMessages: string[];
  textFieldProps: Record<string, any>;
  datePickerProps: Record<string, any>;
  timePickerProps: Record<string, any>;
}

export default defineComponent({
  name: "date-time-picker",

  components: {
    DateTimeTab
  },

  props: {
    value: null,
    disabled: null,
    loading: null,
    label: null,
    dialog: null,
    name: null,
    textFieldProps: Object,
    datePickerProps: Object,
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
      datePickerProps: props.datePickerProps,
      timePickerProps: props.timePickerProps,
      display: false,
      activeTab: 0,
      dateTime: props.value,
      dateTimeFormatted: computed(() => {
        return state.dateTime == null
          ? null
          : context.root.$options.filters?.formatDateTime(state.dateTime);
      })
    });

    function dateTimePickerChanged(value) {
      state.display = false;

      state.dateTime = value;

      context.emit(
        "input",
        state.dateTime != null ? formatISO(parseISO(state.dateTime)) : null
      );
    }

    watch(
      () => props.value,
      (val) => {
        state.dateTime =
          val != null ? formatISO(parseISO(val as string)) : null;
      }
    );

    watch(
      () => props.textFieldProps,
      (val) => (state.textFieldProps = val)
    );

    return {
      state,
      dateTimePickerChanged
    };
  }
});
</script>