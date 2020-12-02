import { ISettingsService } from "./../interfaces/settings-service";
import { UserSettings } from "@/models/user-settings";
import { db } from "../firebase";

export class SettingsService implements ISettingsService {
  async getSettings(): Promise<UserSettings> {
    const data = await db
      .collection("settings")
      .limit(1)
      .get();
    return data.docs[0].data() as UserSettings;
  }
  async saveSettings(settings: UserSettings): Promise<void> {
    await db
      .collection("settings")
      .doc("settings")
      .update(settings);
  }
}
