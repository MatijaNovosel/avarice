<template>
  <div class="flex flex-col items-center justify-around min-h-screen">
    <div class="flex flex-col" v-if="state.loading">
      <progress-spinner strokeWidth="10" style="height: 100px; width: 100px" />
      <span class="text-center text-5xl font-bold gradient-text">
        Signing you in ...
      </span>
    </div>
    <div class="flex flex-col w-2/4 space-y-4" v-else>
      <div>
        <span class="text-5xl font-bold gradient-text mr-2">FinApp</span>
        <span>by Matija Novosel</span>
      </div>
      <div
        class="flex rounded-lg p-3 shadow bg-white cursor-pointer expand"
        @click="login"
      >
        <div class="self-center ml-3 mr-4">
          <mdi-icon color="#fc9219" name="google" />
        </div>
        <div class="flex flex-col">
          <span class="login-content-title">Google OAuth</span>
          <span class="login-content-subtitle">Sign in with Google</span>
        </div>
      </div>
      <div class="flex rounded-lg p-3 shadow bg-white cursor-pointer expand">
        <div class="self-center ml-3 mr-4">
          <mdi-icon color="#4267b2" name="facebook" />
        </div>
        <div class="flex flex-col">
          <span class="login-content-title">Facebook</span>
          <span class="login-content-subtitle">Sign in with Facebook</span>
        </div>
      </div>
      <div class="flex flex-col px-3 pb-3 rounded-lg shadow bg-white space-y-3">
        <span class="text-center pt-5">Sign in with email</span>
        <span class="p-float-label">
          <input-text
            v-model="model.email.$model"
            class="w-full"
            name="email"
            :class="{
              'p-invalid': model.email.$invalid
            }"
            id="email"
          />
          <label for="email">Email</label>
        </span>
        <span class="p-invalid" v-if="model.email.$invalid">{{
          model.email.$errors.map(x => x.$message).join(" • ")
        }}</span>
        <span class="p-float-label">
          <input-text
            v-model="model.password.$model"
            class="w-full"
            name="password"
            :class="{
              'p-invalid': model.password.$invalid
            }"
            id="password"
          />
          <label for="password">Password</label>
        </span>
        <span class="p-invalid" v-if="model.password.$invalid">{{
          model.password.$errors.map(x => x.$message).join(" • ")
        }}</span>
        <button class="bg-gray-600 rounded-lg shadow p-2 text-white">
          Sign in
        </button>
        <button class="bg-gray-700 rounded-lg shadow p-2 text-white">
          Register
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import MdiIcon from "../components/mdi-icon.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength } from "@vuelidate/validators";
import { AppUser } from "@/models/user";
import { LanguageEnum } from "@/constants/language";

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
      let userData: AppUser;

      try {
        /*
        userData = await getService<IAuthService>(
          Types.AuthService
        ).signInGoogle();
        */
        userData = {
          uid: "xyz",
          email: "mnovosel5@gmail.com",
          photoURL:
            "https://avatars.githubusercontent.com/u/36193643?s=460&u=476cacf3518a2a0914c512b60ea1b046413900cf&v=4",
          displayName: "Matija Novosel",
          language: LanguageEnum.English,
          dateFormat: "dd.MM.yyyy. HH:mm",
          preferredCurrency: "HRK"
        };
        store.dispatch("setUser", userData);
        toast.add({
          severity: "success",
          summary: "Login successful!",
          detail: "You have been successfully authenticated!",
          life: 3000
        });
        router.push({ name: "home" });
      } catch (e) {
        toast.add({
          severity: "error",
          summary: "Login failed!",
          detail: "Something went wrong!",
          life: 3000
        });
      } finally {
        state.loading = false;
      }
    }

    return {
      login,
      state,
      model
    };
  }
});
</script>
