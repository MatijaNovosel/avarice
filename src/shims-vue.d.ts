/* eslint-disable */

import { Field, Form } from "vee-validate";
import { DefineComponent } from "vue";

/// <reference types="vite/client" />
declare module "*.vue" {
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, any>;
  export default component;
}

declare module "@vue/runtime-core" {
  export interface GlobalComponents {
    vvForm: typeof Form;
    vvField: typeof Field;
  }
}
