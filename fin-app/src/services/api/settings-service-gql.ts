import { GUserSettings } from "@/models/user-settings";
import axios from "axios";
import environmentVariables from "@/constants/environment-variables.json";
import { ISettingsServiceGql } from "../interfaces/settings-service";

export class SettingsService implements ISettingsServiceGql {
  async getSettings(appUserId: number): Promise<GUserSettings> {
    const { data } = await axios.post(environmentVariables.apiUrl, {
      query: `
        query {
          appSettings(userId: ${appUserId}) {
            checkingGraphColor
            gyroGraphColor
            pocketGraphColor
            totalGraphColor
            gyroGraphVisible
            checkingGraphVisible
            pocketGraphVisible
            totalGraphVisible
          }
        }
      `
    });
    return data.data.appSettings;
  }
  async saveSettings(): Promise<void> {
    //
  }
}
