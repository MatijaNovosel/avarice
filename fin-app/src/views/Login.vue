<template>
  <div class="login-container">
    <div class="loading-screen" v-if="state.loading">
      <progress-spinner strokeWidth="10" style="height: 100px; width: 100px" />
      <span class="loading-title p-mt-5 gradient-text">Signing you in ...</span>
    </div>
    <div class="login-screen" v-else>
      <div class="app-title p-pb-3">
        <span
          ><span class="app-title-text gradient-text p-pr-2">FinApp</span>
          <span class="author-text">by Matija Novosel</span></span
        >
      </div>
      <div class="login-form cursor-pointer p-shadow-6 expand" @click="login">
        <div class="login-icon p-mr-4">
          <mdi-icon color="#fc9219" name="google" />
        </div>
        <div class="login-content">
          <span class="login-content-title">Google OAuth</span>
          <span class="login-content-subtitle p-pt-2">Sign in with Google</span>
        </div>
      </div>
      <div class="login-form cursor-pointer p-shadow-6 expand p-mt-3">
        <div class="login-icon p-mr-4">
          <mdi-icon color="#4267b2" name="facebook" />
        </div>
        <div class="login-content">
          <span class="login-content-title">Facebook</span>
          <span class="login-content-subtitle p-pt-2"
            >Sign in with Facebook</span
          >
        </div>
      </div>
      <div class="login-form-standard p-shadow-6 p-mt-3">
        <span class="login-title p-mb-4">Sign in with email</span>
        <span class="p-float-label">
          <input-text
            v-model="model.email.$model"
            class="login-input"
            name="email"
            :class="{
              'p-invalid': model.email.$invalid
            }"
            id="email"
          />
          <label for="email">Email</label>
        </span>
        <span class="p-invalid p-pt-2 p-pl-2" v-if="model.email.$invalid">{{
          model.email.$errors.map((x) => x.$message).join(" • ")
        }}</span>
        <span class="p-float-label p-mt-3">
          <input-text
            v-model="model.password.$model"
            class="login-input"
            name="password"
            :class="{
              'p-invalid': model.password.$invalid
            }"
            id="password"
          />
          <label for="password">Password</label>
        </span>
        <span class="p-invalid p-pt-2 p-pl-2" v-if="model.password.$invalid">{{
          model.password.$errors.map((x) => x.$message).join(" • ")
        }}</span>
        <btn class="p-mb-2 login-btn p-mt-4" label="Sign in" />
        <btn class="p-my-2 login-btn" label="Register" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import MdiIcon from "@/components/mdi-icon.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { getService, Types } from "@/di-container";
import { IAuthService } from "@/services/interfaces/auth-service";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";

interface Input {
  email: string;
  password: string;
}

interface State {
  loading: boolean;
}

export default defineComponent({
  name: "login",
  components: {
    MdiIcon
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();

    const entry = reactive({
      email: "",
      password: ""
    } as Input);

    const rules = {
      email: { required, email },
      password: { required, minLength: minLength(8) }
    };

    const model = useVuelidate(rules, entry);

    const state: State = reactive({
      loading: false
    });

    async function login() {
      state.loading = true;
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
      state.loading = false;
      router.push({ name: "home" });
    }

    return {
      login,
      state,
      model
    };
  }
});
</script>

<style scoped lang="sass">
@import "../assets/css/helpers"

.author-text
  color: white

.loading-screen
  display: flex
  flex-direction: column

.loading-title
  font-size: 1.6rem
  text-align: center
  color: white
  font-family: "ProximaNovaBold" !important

.app-title-text
  font-size: 3.2rem
  font-family: "ProximaNovaBold" !important

.login-screen
  display: flex
  flex-direction: column
  align-content: center
  width: 50em

.login-container
  min-height: 100vh
  display: flex
  flex-direction: column
  align-items: center
  justify-content: space-around

.login-icon
  align-self: center

.login-form
  padding: 1.4rem 1.8rem
  background-color: #1e1e1e
  border-radius: 12px
  display: flex

.login-input
  width: 100%

.login-title
  font-size: 1.2rem
  text-align: center
  color: white
  font-family: "ProximaNovaBold" !important

.login-form-standard
  padding: 1.4rem 1.8rem
  background-color: #1e1e1e
  border-radius: 12px
  display: flex
  flex-direction: column

.login-btn
  background: linear-gradient(90deg, #ff8a00, #e52e71)
  &:hover
    background: linear-gradient(90deg, #ff8a00, #e52e71) !important
  &:active
    background: linear-gradient(90deg, #ff8a00, #e52e71) !important
  &:focus
    background: linear-gradient(90deg, #ff8a00, #e52e71) !important

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
