<template>
  <section class="flex flex-col items-center h-screen md:flex-row ">
    <div
      class="flex items-center justify-center w-full h-screen px-6 bg-white md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 lg:px-16 xl:px-12"
    >
      <div class="w-full h-100">
        <span class="text-5xl proxima-bold font-bold gradient-text">
          FinApp
        </span>
        <div class="mt-3">
          <label
            class="block text-sm font-medium leading-relaxed tracking-tighter text-gray-700"
          >
            Email Address
          </label>
          <input
            type="email"
            placeholder="Your Email "
            class="w-full px-4 py-2 mt-2 text-base text-black transition duration-500 ease-in-out transform bg-gray-100 border-transparent rounded-lg focus:border-gray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-1"
            autofocus
          />
        </div>
        <div class="mt-4">
          <label
            class="block text-sm font-medium leading-relaxed tracking-tighter text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            placeholder="Your Password"
            :minlength="6"
            class="w-full px-4 py-2 text-base text-black transition duration-500 ease-in-out transform bg-gray-100 border-transparent rounded-lg focus:border-gray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-1 ring-offset-current ring-offset-1"
          />
        </div>
        <div class="mt-2 text-right">
          <a
            href="#"
            class="text-sm font-semibold leading-relaxed text-gray-700 hover:text-black focus:text-blue-700"
          >
            Forgot Password?
          </a>
        </div>
        <button
          @click="login"
          v-ripple
          class="p-ripple block w-full px-4 py-3 mt-6 font-semibold text-white transition duration-500 ease-in-out transform bg-gray-800 rounded-lg hover:bg-gray-600 hover:to-black focus:shadow-outline focus:outline-none focus:ring-2 ring-offset-current ring-offset-2 "
        >
          Log In
        </button>
        <hr class="w-full my-6 border-gray-300" />
        <div class="flex justify-enter">
          <button
            type="button"
            v-ripple
            class="p-ripple inline-flex w-full px-4 py-3 font-semibold text-black transition duration-500 ease-in-out transform bg-white border border-gray-300 rounded-lg hover:bg-black hover:text-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 "
          >
            <div class="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                class="w-6 h-6"
                viewBox="0 0 48 48"
              >
                <defs>
                  <path
                    id="a"
                    d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                  />
                </defs>
                <clipPath id="b">
                  <use xlink:href="#a" overflow="visible" />
                </clipPath>
                <path clip-path="url(#b)" fill="#FBBC05" d="M0 37V11l17 13z" />
                <path
                  clip-path="url(#b)"
                  fill="#EA4335"
                  d="M0 11l17 13 7-6.1L48 14V0H0z"
                />
                <path
                  clip-path="url(#b)"
                  fill="#34A853"
                  d="M0 37l30-23 7.9 1L48 0v48H0z"
                />
                <path
                  clip-path="url(#b)"
                  fill="#4285F4"
                  d="M48 48L17 24l-4-3 35-10z"
                />
              </svg>
              <span class="ml-4">
                Log in with Google
              </span>
            </div>
          </button>
          <button
            type="button"
            v-ripple
            class="p-ripple inline-flex px-4 py-3 ml-8 font-semibold text-black transition duration-500 ease-in-out transform bg-white border border-gray-300 rounded-lg focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 hover:bg-black focus:bg-gray-100 hover:text-blue-500"
          >
            <div class="flex items-center justify-center">
              <svg
                fill="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                class="w-5 h-5"
                viewBox="0 0 24 24"
              >
                <path
                  d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
                ></path>
              </svg>
            </div>
          </button>
        </div>
        <p class="mt-8 text-center">
          Need an account?
          <a href="#" class="font-semibold text-blue-500 hover:text-blue-700">
            Sign Up
          </a>
        </p>
      </div>
    </div>
    <div class="hidden w-full h-screen bg-white lg:block md:w-1/3 lg:w-2/3">
      <img
        src="https://www.thebalance.com/thmb/JyaUrq-ucrDj1ZQmz_lMZj5V0jY=/3870x2575/filters:fill(auto,1)/Financial-Ratio-Categories-56a091f03df78cafdaa2d0d5.jpg"
        alt=""
        class="object-cover w-full h-full"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
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
