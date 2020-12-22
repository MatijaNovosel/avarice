import { UpdateUserSettingsDto } from './../../models/user-settings';
import { GUserSettings, UserSettings } from "@/models/user-settings";

export interface ISettingsService {
  getSettings(): Promise<UserSettings>;
  saveSettings(settings: UserSettings): Promise<void>;
}

export interface ISettingsServiceGql {
  getSettings(appUserId: number): Promise<GUserSettings>;
  saveSettings(payload: UpdateUserSettingsDto): Promise<void>;
}