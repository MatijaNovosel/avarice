<template>
  <v-dialog v-if="state.dialog" v-model="state.display" width="340">
    <template #activator="{ on }">
      <v-text-field
        v-bind="state.textFieldProps"
        :disabled="state.disabled"
        :loading="state.loading"
        :name="state.name"
        :value="state.dateFormatted"
        v-on="on"
        @click:clear="clearValues"
        @change="datePickerChanged"
        @blur="datePickerBlur"
        readonly
      >
        <template #label>
          <required-icon v-show="state.required" />
          <span>{{ state.label }}</span>
        </template>
        <template #append>
          <v-icon>mdi-calendar</v-icon>
        </template>
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
    <v-date-picker
      v-model="state.date"
      v-bind="state.datePickerProps"
      full-width
      first-day-of-week="1"
      @change="datePickerChanged"
    ></v-date-picker>
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
        :value="state.dateFormatted"
        v-on="on"
        @click:clear="clearValues"
        @change="datePickerChanged"
        @blur="datePickerBlur"
        readonly
      >
        <template #label>
          <required-icon v-show="state.required" />
          <span>{{ state.label }}</span>
        </template>
        <template #append>
          <v-icon>mdi-calendar</v-icon>
        </template>
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
    <v-date-picker
      v-model="state.date"
      v-bind="state.datePickerProps"
      full-width
      first-day-of-week="1"
      @change="datePickerChanged"
    ></v-date-picker>
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
import format from "date-fns/format";
import formatISO from "date-fns/formatISO";
import parseISO from "date-fns/parseISO";

interface Props {
  value?: string;
  disabled: false;
  loading: false;
  label: string;
  dialog: false;
  name: string;
  required: boolean;
  textFieldProps: Record<string, any>;
  datePickerProps: Record<string, any>;
}

export default defineComponent({
  name: "date-picker",

  props: {
    value: null,
    disabled: null,
    loading: null,
    label: null,
    dialog: null,
    name: null,
    required: Boolean,
    textFieldProps: Object,
    datePickerProps: Object
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
      required: props.required,
      name: name,
      textFieldProps: props.textFieldProps,
      datePickerProps: props.datePickerProps,
      display: false,
      date:
        props.value != null
          ? format(parseISO(props.value), "yyyy-MM-dd")
          : null,
      dateFormatted: computed(() => {
        return context.root.$options.filters?.formatDate(state.date);
      })
    });

    function clearValues() {
      state.date = null;
      context.emit("input", null);
    }

    function datePickerBlur() {
      context.emit(
        "input",
        state.date != null ? formatISO(parseISO(state.date)) : null
      );
    }

    function datePickerChanged() {
      state.display = false;

      context.emit(
        "input",
        state.date != null ? formatISO(parseISO(state.date)) : null
      );
    }

    watch(
      () => props.value,
      (val) =>
        (state.date =
          val != null ? format(parseISO(val as string), "yyyy-MM-dd") : null)
    );

    watch(
      () => props.required,
      (val) => (state.required = val)
    );

    watch(
      () => props.textFieldProps,
      (val) => (state.textFieldProps = val)
    );

    return {
      state,
      datePickerChanged,
      datePickerBlur,
      clearValues
    };
  }
});
</script>
