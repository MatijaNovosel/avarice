// import en from "@/shared/translations/en";
import hr from "@/shared/translations/hr";

import { createI18n } from "vue-i18n";

const messages = {
  // en,
  hr
};

export type MessageLanguages = keyof typeof messages;
export type MessageSchema = (typeof messages)["hr"];

declare module "vue-i18n" {
  export interface DefineLocaleMessage extends MessageSchema {}
  export interface DefineDateTimeFormat {}
  export interface DefineNumberFormat {}
}

export const i18n = createI18n({
  locale: "hr",
  legacy: false,
  messages
});
