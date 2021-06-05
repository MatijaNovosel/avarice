import {
  UpdateUserSettingsDto,
  UserSettings
} from "@/models/user-settings";

export interface ISettingsService {
  getSettings(userId: string): Promise<UserSettings>;
  saveSettings(payload: UpdateUserSettingsDto): Promise<void>;
}
