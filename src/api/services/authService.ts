import { Client, LoginModel, LoginResult, RegisterResult, RegistrationModel } from "src/api/client";
import IAuthService from "../interfaces/authService";

class AuthService implements IAuthService {
  async register(username: string, email: string, password: string): Promise<RegisterResult> {
    const client = new Client();

    const data = await client.auth_Register(
      new RegistrationModel({
        username,
        email,
        password
      })
    );

    return data;
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const client = new Client();

    const data = await client.auth_Login(
      new LoginModel({
        email,
        password
      })
    );

    return data;
  }

  async signOut(): Promise<void> {
    //
  }
}

export default AuthService;
