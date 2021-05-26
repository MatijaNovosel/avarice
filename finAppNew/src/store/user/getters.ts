import { User } from "@/models/user";

export default {
  data: state => state.data as User,
  isAuthenticated: state => state.data != null
};
