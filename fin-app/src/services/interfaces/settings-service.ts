import { GUserSettings, UserSettings } from "@/models/user-settings";

export interface ISettingsService {
  getSettings(): Promise<UserSettings>;
  saveSettings(settings: UserSettings): Promise<void>;
}

export interface ISettingsServiceGql {
  getSettings(appUserId: number): Promise<GUserSettings>;
}