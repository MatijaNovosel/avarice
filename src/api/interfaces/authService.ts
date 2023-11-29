import { AuthResult } from "src/models/auth";

export default interface IAuthService {
  register(username: string, email: string, password: string): Promise<AuthResult>;
  login(email: string, password: string): Promise<AuthResult>;
  signOut(): Promise<void>;
}
