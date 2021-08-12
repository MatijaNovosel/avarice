import { AppUser } from "src/models/user";

export interface UserStateInterface {
  data: AppUser | null;
}

function state(): UserStateInterface {
  return {
    data: null
  };
}

export default state;
