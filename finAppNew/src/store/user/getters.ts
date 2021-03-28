import IUser from "@/models/user";

export default {
  data: state => state.data as IUser,
  isAuthenticated: state => state.isAuthenticated
};
