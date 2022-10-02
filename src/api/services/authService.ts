import { LoginResult, Client, RegisterResult } from "src/api/client";
import IAuthService from "../interfaces/authService";

class AuthService implements IAuthService {
  async register(username: string, email: string, password: string): Promise<RegisterResult> {
    const client = new Client();

    const data = await client.auth_Register({
      username,
      email,
      password
    });

    return data;
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const client = new Client();

    const data = await client.auth_Login({
      email,
      password
    });

    return data;
  }

  async signOut(): Promise<void> {
    //
  }
}

export default AuthService;
