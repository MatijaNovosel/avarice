import { UserSettingsDto } from "@/models/user-settings";
import { db } from "../firebase";

export class UserSettingsService {
  async getSettings(): Promise<UserSettingsDto> {
    const data = await db
      .collection("settings")
      .limit(1)
      .get();
    return data.docs[0].data() as UserSettingsDto;
  }
}
