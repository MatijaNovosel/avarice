import { api } from "@/configurations/axios";
import { AuthResult } from "src/models/auth";
import IAuthService from "../interfaces/authService";

class AuthService implements IAuthService {
  async register(username: string, email: string, password: string): Promise<AuthResult> {
    const {
      data: {
        data: { signUp }
      }
    } = await api.post("", {
      query: `mutation {
        signUp(data: {
          username: "${username}",
          email: "${email}",
          password: "${password}"
        }) {
          accessToken,
          refreshToken
        }
      }`
    });
    return {
      accessToken: signUp.accessToken,
      refreshToken: signUp.refreshToken
    };
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const {
      data: {
        data: { signIn }
      }
    } = await api.post("", {
      query: `mutation {
        signIn(data: {
          email: "lisa@simpson.com",
          password: "secret42"
        }) {
          accessToken,
          refreshToken
        }
      }`
    });
    return {
      accessToken: signIn.accessToken,
      refreshToken: signIn.refreshToken
    };
  }

  async signOut(): Promise<void> {
    //
  }
}

export default AuthService;
