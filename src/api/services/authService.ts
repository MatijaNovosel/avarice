import IAuthService from "../interfaces/authService";

class AuthService implements IAuthService {
  async register(username: string, email: string, password: string): Promise<any> {
    const data = null;
    // Register here
    return data;
  }

  async login(email: string, password: string): Promise<any> {
    const data = null;
    // Login here
    return data;
  }

  async signOut(): Promise<void> {
    //
  }
}

export default AuthService;
