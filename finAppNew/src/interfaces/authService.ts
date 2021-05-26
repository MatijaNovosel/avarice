import { AuthResultModel } from "@/apiClient/client";

export interface IAuthService {
  register(username: string, email: string, password: string): Promise<AuthResultModel>;
  login(email: string, password: string): Promise<AuthResultModel>;
  signOut(): Promise<void>;
}
