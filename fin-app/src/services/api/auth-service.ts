import firebase from "firebase";
import { User } from "@firebase/auth-types";
import axiosInstance from "axios";
import { IAuthService } from "../interfaces/auth-service";
import { formatGqlRequest } from "@/helpers/helpers";

interface UserDto {
  accessToken: string;
}

export class AuthService implements IAuthService {
  async register(email: string, password: string): Promise<number> {
    const query = formatGqlRequest({
      type: "mutation",
      name: "register",
      requestParams: [
        {
          name: "input",
          subFields: [
            {
              name: "email",
              quoted: true,
              value: email
            },
            {
              name: "password",
              quoted: true,
              value: password
            }
          ]
        }
      ]
    });

    const {
      data: {
        data: { register }
      }
    } = await axiosInstance.post("", {
      query
    });

    return register;
  }

  async signInGoogle(): Promise<UserDto> {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await firebase.auth().signInWithPopup(provider);

    const { uid, email, photoURL, displayName } = {
      ...(credential.user as User)
    };

    const query = formatGqlRequest({
      type: "mutation",
      name: "googleLogin",
      requestParams: [
        {
          name: "input",
          subFields: [
            {
              name: "email",
              quoted: true,
              value: email
            },
            {
              name: "uid",
              quoted: true,
              value: uid
            },
            {
              name: "photoURL",
              quoted: true,
              value: photoURL
            },
            {
              name: "displayName",
              quoted: true,
              value: displayName
            }
          ]
        }
      ],
      responseParams: ["accessToken"]
    });

    const {
      data: {
        data: { login }
      }
    } = await axiosInstance.post("", {
      query
    });

    return login;
  }

  async signInEmail(email: string, password: number): Promise<UserDto> {
    const query = formatGqlRequest({
      type: "mutation",
      name: "login",
      requestParams: [
        {
          name: "input",
          subFields: [
            {
              name: "email",
              quoted: true,
              value: email
            },
            {
              name: "password",
              quoted: true,
              value: password
            }
          ]
        }
      ],
      responseParams: ["accessToken"]
    });

    const {
      data: {
        data: { login }
      }
    } = await axiosInstance.post("", {
      query
    });

    return login;
  }

  async signOut(): Promise<void> {
    //
  }
}
