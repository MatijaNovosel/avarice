import firebase from "firebase";
import { User } from "@firebase/auth-types";
import axios from "axios";
import environmentVariables from "@/constants/environment-variables.json";
import { IAuthService } from "../interfaces/auth-service";

interface UserDto {
  accessToken: string;
}

export class AuthService implements IAuthService {
  async register(email: string, password: string): Promise<number> {
    const { data: { data: { register } } } = await axios.post(environmentVariables.apiUrl, {
      query: `
        mutation {
          register(input: {
            email: ${email}
            password: ${password}
          })
        }
      `
    });
    return register;
  }

  async signInGoogle(): Promise<UserDto> {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await firebase.auth().signInWithPopup(provider);

    const { uid, email, photoURL, displayName } = {
      ...(credential.user as User)
    };

    const { data: { data: { login } } } = await axios.post(environmentVariables.apiUrl, {
      query: `
        mutation {
          googleLogin(input: {
            uid: ${uid}
            email: ${email}
            photoURL: ${photoURL}
            displayName: ${displayName}
          }) {
            accessToken
          }
        }
      `
    });
    return login;
  }

  async signInEmail(email: string, password: number): Promise<UserDto> {
    const { data: { data: { login } } } = await axios.post(environmentVariables.apiUrl, {
      query: `
        mutation {
          login(input: {
            email: ${email}
            password: ${password}
          }) {
            accessToken
          }
        }
      `
    });
    return login;
  }

  async signOut(): Promise<void> {
    //
  }
}
