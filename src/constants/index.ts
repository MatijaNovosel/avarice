export default class Constants {
  static readonly API_BASE_URL =
    import.meta.env.VITE_SERVER_URL != null ? import.meta.env.VITE_SERVER_URL : "";
  static readonly API_VERSION = "1";
  static readonly VITE_API_KEY = import.meta.env.VITE_API_KEY;
  static readonly VITE_API_ID = import.meta.env.VITE_API_ID;
  static readonly MAX_FILE_SIZE = 104857600;
}

export class ApiUrlPrefixes {
  static readonly IDENTITY = "identity";
  static readonly NOTIFICATION = "notification";
  static readonly USER = "user";
  static readonly CUSTOMER = "customer";
  static readonly CODEBOOK = "codebook";
}

export const appName = "eTicketing";

export const confirmAccountPath = "confirm-account";
export const resetPasswordPath = "reset-password";
