import { User } from '@/models/user';

export default {
  login: async (context, data: User) => {
    context.commit("login", data);
  },
  logout: async context => {
    context.commit("logout");
  }
};
