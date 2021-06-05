<template>
  <v-tabs fixed-tabs v-model="state.activeTab">
    <v-tab key="calendar">
      <slot name="dateIcon">
        <v-icon>mdi-calendar</v-icon>
      </slot>
    </v-tab>
    <v-tab key="timer">
      <slot name="timeIcon">
        <v-icon>mdi-clock-outline</v-icon>
      </slot>
    </v-tab>
    <v-tab-item key="calendar">
      <v-date-picker
        v-model="state.date"
        v-bind="state.datePickerProps"
        full-width
        first-day-of-week="1"
        @input="showTimePicker"
        @change="pickerChanged"
      ></v-date-picker>
    </v-tab-item>
    <v-tab-item key="timer">
      <v-time-picker
        ref="time"
        v-model="state.time"
        full-width
        @change="pickerChanged"
      ></v-time-picker>
    </v-tab-item>
  </v-tabs>
</template>

<script lang="ts">
import { defineComponent, SetupContext, reactive } from "@vue/composition-api";
import format from 'date-fns/format';
import formatISO from 'date-fns/formatISO';
import parseISO from 'date-fns/parseISO';

interface Props {
  value?: string;
  datePickerProps: Record<string, any>;
  timePickerProps: Record<string, any>;
}

export default defineComponent({
  name: "date-time-tab",

  props: {
    value: null,
    datePickerProps: Object,
    timePickerProps: Object
  },

  model: {
    prop: "value",
    event: "input"
  },

  setup(props: Props, context: SetupContext) {
    const state = reactive({
      activeTab: 0,
      date:
        props.value != null ? format(parseISO(props.value), "yyyy-MM-dd") : null,
      time:
        props.value != null
          ? format(parseISO(props.value), "hh:mm")
          : null,
      datePickerProps: props.datePickerProps,
      timePickerProps: props.timePickerProps
    });

    function resetPicker() {
      state.activeTab = 0;
    }

    function showTimePicker() {
      state.activeTab = 1;
    }

    function pickerChanged() {
      if (state.date == null || state.time == null) {
        return;
      } 
      
      resetPicker();      

      const tmpDateTime = parseISO(state.date);

      const time = state.time.split(":");
      
      tmpDateTime.setHours(parseInt(time[0]));
      tmpDateTime.setMinutes(parseInt(time[1]));

      context.emit("change", formatISO(tmpDateTime));
    }

    return {
      state,
      resetPicker,
      showTimePicker,
      pickerChanged
    };
  }
});
</script>