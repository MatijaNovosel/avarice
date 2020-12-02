<template>
  <div class="login-container">
    <div class="login-form p-shadow-6 expand" @click="login">
      <div class="login-icon p-mr-4">
        <mdi-icon color="#fc9219" name="google" />
      </div>
      <div class="login-content">
        <span class="login-content-title">Google OAuth</span>
        <span class="login-content-subtitle p-pt-2">Sign in with Google</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MdiIcon from "@/components/mdi-icon.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { getService, Types } from "@/di-container";
import { IAuthService } from "@/services/interfaces/auth-service";

export default defineComponent({
  name: "login",
  components: {
    MdiIcon
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();
    async function login() {
      const userData = await getService<IAuthService>(
        Types.AuthService
      ).signIn();
      store.dispatch("setUser", userData);
      toast.add({
        severity: "success",
        summary: "Login successful!",
        detail: "You have been successfully authenticated!",
        life: 3000
      });
      router.push({ name: "home" });
    }

    return {
      login
    };
  }
});
</script>

<style lang="sass">
.login-form:hover
  cursor: pointer

.login-container
  min-height: 100vh
  display: flex
  align-items: center
  justify-content: space-around

.login-icon
  align-self: center

.login-form
  padding: 2rem 1.8rem
  background-color: #1e1e1e
  border-radius: 12px
  display: flex
  flex-direction: row

.login-content
  display: flex
  flex-direction: column

  &-title
    user-select: none
    font-size: 1.3em
    color: white

  &-subtitle
    user-select: none
    color: rgb(170, 170, 170)
</style>
