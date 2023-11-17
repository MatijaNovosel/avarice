import { RegisterResult } from "src/api/client";
import { LoginResult } from "src/models/auth";

export default interface IAuthService {
  register(username: string, email: string, password: string): Promise<RegisterResult>;
  login(email: string, password: string): Promise<LoginResult>;
  signOut(): Promise<void>;
}
