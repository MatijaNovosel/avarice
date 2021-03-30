import axios from "axios";
import { IAuthService } from "../interfaces/authService";
import { formatGqlRequest } from "@/helpers";
import { UserDto } from "@/models/user";

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
    } = await axios.post("", {
      query
    });

    return register;
  }

  async signInEmail(email: string, password: string): Promise<UserDto> {
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
      responseParams: [
        "accessToken",
        "id",
        "uid",
        "email",
        "emailConfirmed",
        "photoUrl",
        "accessToken",
        "displayName"
      ]
    });
    
    const {
      data: {
        data: { login }
      }
    } = await axios.post("", {
      query
    });

    return login;
  }

  async signOut(): Promise<void> {
    //
  }
}
