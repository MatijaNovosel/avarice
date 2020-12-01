<template>
  <div class="login-container">
    <div class="login-form p-shadow-6 expand" @click="login">
      <div class="login-icon p-mr-4">
        <mdi-icon color="#fc9219" name="google" />
      </div>
      <div class="login-content">
        <span class="login-content-title">Sign in with Google</span>
        <span class="login-content-subtitle p-pt-2">Sign in with Google</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import MdiIcon from "@/components/mdi-icon.vue";
import { AuthService } from "@/services/api/auth-service";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

interface State {
  authService: AuthService;
}

export default defineComponent({
  name: "login",
  components: {
    MdiIcon
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const state: State = reactive({
      authService: new AuthService()
    });

    async function login() {
      const userData = await state.authService.signIn();
      store.dispatch("setUser", userData);
      router.push({ name: "home" });
    }

    return {
      state,
      login
    };
  }
});
</script>

<style>
.login-form:hover {
  cursor: pointer;
}
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.login-icon {
  align-self: center;
}
.login-form {
  padding: 2rem 1.8rem;
  background-color: #1e1e1e;
  border-radius: 12px;
  display: flex;
  flex-direction: row;
}
.login-content {
  display: flex;
  flex-direction: column;
}
.login-content-title {
  user-select: none;
  font-size: 1.3em;
  color: white;
}
.login-content-subtitle {
  user-select: none;
  color: rgb(170, 170, 170);
}
</style>
