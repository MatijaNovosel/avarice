import { AuthResultModel, Client, LoginModel, RegistrationModel } from "@/apiClient/client";
import { IAuthService } from "../interfaces/authService";

export class AuthService implements IAuthService {
  async register(username: string, email: string, password: string): Promise<AuthResultModel> {
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

  async login(email: string, password: string): Promise<AuthResultModel> {
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
