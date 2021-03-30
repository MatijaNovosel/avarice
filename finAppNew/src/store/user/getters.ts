import { AppUser } from "@/models/user";

export default {
  data: state => state.data as AppUser,
  isAuthenticated: state => state.data != null
};
