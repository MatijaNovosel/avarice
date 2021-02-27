import { UserDto } from "@/models/user";

export interface IAuthService {
  register(email: string, password: string): Promise<number>;
  signInGoogle(): Promise<UserDto>;
  signInEmail(email: string, password: string): Promise<UserDto>;
  signOut(): Promise<void>;
}
