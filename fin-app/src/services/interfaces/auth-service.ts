import { AppUser } from "@/models/user";

interface UserDto {
  accessToken: string;
}

export interface IAuthService {
  signIn(): Promise<AppUser>;
  signOut(): Promise<void>;
}

export interface IAuthServiceGql {
  register(email: string, password: string): Promise<number>;
  signInGoogle(): Promise<UserDto>;
  signInEmail(email: string, password: number): Promise<UserDto>;
  signOut(): Promise<void>;
}
