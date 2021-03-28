export interface IAppService {
  logoutUser(): Promise<void>;
  getUserData(): Promise<void>;
}
