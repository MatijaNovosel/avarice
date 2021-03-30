import { AppUser } from '@/models/user';
export default {
  login: async (context, data: AppUser) => {
    context.commit("login", data);
  },
  logout: async context => {
    context.commit("logout");
  }
};
