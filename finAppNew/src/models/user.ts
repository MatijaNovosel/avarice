import { LanguageEnum } from "@/constants/language";
import { Currency } from "@/types";

export interface AppUser {
  id: number | null;
  uid?: string | null;
  email?: string | null;
  photoUrl?: string;
  displayName?: string;
  accessToken?: string;
  preferredCurrency?: Currency;
  emailConfirmed?: boolean;
  dateFormat?: string;
  language?: LanguageEnum;
}

export interface UserDto {
  id: number | null;
  uid?: string;
  email?: string;
  photoUrl?: string;
  displayName?: string;
  language?: number;
  dateFormat?: string;
  preferredCurrency?: string;
  emailConfirmed?: boolean;
  accessToken: string;
}
