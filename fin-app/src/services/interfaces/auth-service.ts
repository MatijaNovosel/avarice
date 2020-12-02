import { AppUser } from "@/models/user";

export interface IAuthService {
  signIn(): Promise<AppUser>;
  signOut(): Promise<void>;
}
