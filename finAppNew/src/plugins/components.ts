import _Vue from "vue";
import DatePicker from "@/components/pickers/DatePicker.vue";
import DateTimePicker from "@/components/pickers/DateTimePicker.vue";
import TimePicker from "@/components/pickers/TimePicker.vue";
import RequiredIcon from "@/components/RequiredIcon.vue";
import {
  ValidationObserver,
  ValidationProvider
} from "vee-validate/dist/vee-validate.full";

export default function ComponentPlugin<ComponentPluginOptions>(
  Vue: typeof _Vue,
  options?: ComponentPluginOptions
): void {
  Vue.component("date-picker", DatePicker);
  Vue.component("date-time-picker", DateTimePicker);
  Vue.component("time-picker", TimePicker);
  Vue.component("validation-provider", ValidationProvider);
  Vue.component("validation-observer", ValidationObserver);
  Vue.component("required-icon", RequiredIcon);
}

export class ComponentPluginOptions {}
