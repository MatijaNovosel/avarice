export default class Constants {
  static readonly API_BASE_URL =
    process.env.VUE_APP_SERVER_URL != null
      ? process.env.VUE_APP_SERVER_URL
      : "";
}
