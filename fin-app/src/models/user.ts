import { LanguageEnum } from "@/constants/language";
import { Currency } from "@/types";

export interface AppUser {
  uid?: string | null;
  email?: string | null;
  photoURL?: string;
  displayName?: string;
  accessToken?: string;
  preferredCurrency?: Currency;
  emailConfirmed?: boolean;
  dateFormat?: string;
  language?: LanguageEnum;
}

export interface UserDto {
  uid?: string;
  email?: string;
  photoURL?: string;
  displayName?: string;
  language?: number;
  dateFormat?: string;
  preferredCurrency?: string;
  emailConfirmed?: boolean;
  accessToken: string;
}