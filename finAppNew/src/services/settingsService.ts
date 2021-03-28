import { UserSettings, UpdateUserSettingsDto } from "@/models/user-settings";
import { ISettingsService } from "../interfaces/settingsService";

export class SettingsService implements ISettingsService {
  async getSettings(appUserId: number): Promise<UserSettings> {
    return {};
  }

  async saveSettings(payload: UpdateUserSettingsDto): Promise<void> {
    //
  }
}
