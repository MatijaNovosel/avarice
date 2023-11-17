import { api } from "src/boot/axios";
import { LoginResult } from "src/models/auth";
import IAuthService from "../interfaces/authService";

class AuthService implements IAuthService {
  async register(username: string, email: string, password: string): Promise<any> {
    const data = null;
    // Register here
    return data;
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const {
      data: {
        data: { signIn }
      }
    } = await api.post("http://localhost:3000/graphql", {
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
