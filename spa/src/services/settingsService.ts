import { UserSettings, UpdateUserSettingsDto } from "@/models/user-settings";
import { ISettingsService } from "../interfaces/settingsService";

export class SettingsService implements ISettingsService {
  getSettings(userId: string): Promise<UserSettings> {
    throw new Error("Method not implemented.");
  }

  saveSettings(payload: UpdateUserSettingsDto): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
