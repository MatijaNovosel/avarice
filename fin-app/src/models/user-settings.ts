export interface UserSettings {
  checkingGraphColor: string;
  gyroGraphColor: string;
  pocketGraphColor: string;
  totalGraphColor: string;
  gyroGraphVisible: boolean;
  checkingGraphVisible: boolean;
  pocketGraphVisible: boolean;
  totalGraphVisible: boolean;
}

export interface UpdateUserSettingsDto {
  checkingGraphColor: string;
  gyroGraphColor: string;
  pocketGraphColor: string;
  totalGraphColor: string;
  gyroGraphVisible: boolean;
  checkingGraphVisible: boolean;
  pocketGraphVisible: boolean;
  totalGraphVisible: boolean;
  appUserId: number;
}