import {
  UpdateUserSettingsDto,
  UserSettings
} from "@/models/user-settings";

export interface ISettingsService {
  getSettings(appUserId: number): Promise<UserSettings>;
  saveSettings(payload: UpdateUserSettingsDto): Promise<void>;
}
