import { UserSettings, UpdateUserSettingsDto } from "@/models/user-settings";
import axios from "axios";
import environmentVariables from "@/constants/environment-variables.json";
import { ISettingsService } from "../interfaces/settings-service";

export class SettingsService implements ISettingsService {
  async getSettings(appUserId: number): Promise<UserSettings> {
    const { data: { data: { appSettings } } } = await axios.post(environmentVariables.apiUrl, {
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
    return appSettings;
  }
  async saveSettings(payload: UpdateUserSettingsDto): Promise<void> {
    const {
      appUserId,
      checkingGraphColor,
      gyroGraphColor,
      pocketGraphColor,
      totalGraphColor,
      gyroGraphVisible,
      checkingGraphVisible,
      pocketGraphVisible,
      totalGraphVisible
    } = payload;

    await axios.post(environmentVariables.apiUrl, {
      query: `
        mutation {
          updateUserAppSetting(appSetting: {
            checkingGraphColor: "${checkingGraphColor}"
            gyroGraphColor: "${gyroGraphColor}"
            pocketGraphColor: "${pocketGraphColor}"
            totalGraphColor: "${totalGraphColor}"
            gyroGraphVisible: ${gyroGraphVisible}
            checkingGraphVisible: ${checkingGraphVisible}
            pocketGraphVisible: ${pocketGraphVisible}
            totalGraphVisible: ${totalGraphVisible}
            appUserId: ${appUserId}
          })
        }
      `
    });
  }
}
