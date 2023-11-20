export interface AppUser {
  id: string;
  email: string;
  userName: string;
  emailConfirmed: boolean;
  token: string;
  iat: number;
  exp: number;
}
