export interface User {
  id: string;
  email: string;
  userName: string;
  emailConfirmed: boolean;
  token?: string;
}
