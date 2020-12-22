interface UserDto {
  accessToken: string;
}

export interface IAuthService {
  register(email: string, password: string): Promise<number>;
  signInGoogle(): Promise<UserDto>;
  signInEmail(email: string, password: number): Promise<UserDto>;
  signOut(): Promise<void>;
}
