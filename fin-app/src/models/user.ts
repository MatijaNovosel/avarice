import { LanguageEnum } from "@/constants/language";
import { Currency } from "@/types";

export interface AppUser {
  uid?: string | null;
  email?: string | null;
  photoURL?: string;
  displayName?: string;
  accessToken?: string;
  preferredCurrency?: Currency;
  dateFormat?: string;
  language?: LanguageEnum;
}
