<template>
  <div class="h-screen w-screen flex items-center">
    <div
      v-if="state.currentStep == StepEnum.Start"
      class="flex flex-col lg:flex-row items-center justify-center px-5 text-gray-700 w-full"
    >
      <div class="w-max">
        <div class="text-5xl text-gray-400 font-bold">Hold up</div>
        <p class="text-2xl md:text-3xl font-light leading-normal mt-2">
          To start using the application,
        </p>
        <p class="text-2xl md:text-3xl font-light leading-normal">
          you will need at least one financial account.
        </p>
        <button
          v-ripple
          @click="state.currentStep = StepEnum.AccountDetails"
          class="p-ripple px-4 mt-5 inline py-2 text-sm font-medium leading-5 shadow text-gray-400 transition-colors duration-150 border-0 rounded-lg focus:outline-none focus:shadow-outline-blue bg-gray-700 hover:bg-gray-800"
        >
          Next
        </button>
      </div>
      <div class="max-w-lg lg:ml-8">
        <img src="/notFoundCat.svg" alt="" />
      </div>
    </div>
    <div
      v-else-if="state.currentStep == StepEnum.AccountDetails"
      class="flex flex-col lg:flex-row items-center justify-center px-5 text-gray-700 w-full"
    >
      <div v-if="state.loading" class="text-center flex items-center flex-col">
        <progress-spinner strokeWidth="10" class="h-24 w-24" />
        <span class="text-gray-400 text-xl mt-10">Creating financial account...</span>
      </div>
      <template v-else>
        <div class="w-max">
          <div class="text-5xl text-gray-400 font-bold">Account details</div>
          <p class="text-2xl md:text-3xl font-light leading-normal mt-2">
            Enter the account details below
          </p>
          <div class="flex flex-col mt-3 space-y-3">
            <input
              type="text"
              placeholder="Account name"
              class="w-full px-4 py-2 text-base text-gray-400 transition duration-500 ease-in-out transform bg-gray-800 rounded-lg focus:outline-none"
            />
            <input
              type="text"
              placeholder="Currency"
              v-model="state.currency"
              class="w-full px-4 py-2 text-base text-gray-400 transition duration-500 ease-in-out transform bg-gray-800 rounded-lg focus:outline-none"
            />
            <input
              type="text"
              placeholder="Starting amount"
              :disabled="!state.currency"
              class="disabled:bg-gray-700 disabled:cursor-not-allowed w-full px-4 py-2 text-base text-gray-400 transition duration-500 ease-in-out transform bg-gray-800 rounded-lg focus:outline-none"
            />
          </div>
          <div class="flex space-x-3">
            <button
              v-ripple
              @click="state.currentStep = StepEnum.Start"
              class="p-ripple px-4 mt-5 inline py-2 text-sm font-medium leading-5 shadow text-gray-400 transition-colors duration-150 border-0 rounded-lg focus:outline-none focus:shadow-outline-blue bg-gray-600 hover:bg-gray-700"
            >
              Back
            </button>
            <button
              v-ripple
              @click="createAccount"
              class="disabled:cursor-not-allowed p-ripple px-4 mt-5 inline py-2 text-sm font-medium leading-5 shadow text-gray-400 transition-colors duration-150 border-0 rounded-lg focus:outline-none focus:shadow-outline-blue bg-gray-700 hover:bg-gray-800"
            >
              Create financial account
            </button>
          </div>
        </div>
        <div class="max-w-lg lg:ml-8">
          <img src="/notFoundCat.svg" alt="" />
        </div>
      </template>
    </div>
    <div
      v-else-if="state.currentStep == StepEnum.Done"
      class="flex flex-col lg:flex-row items-center justify-center px-5 text-gray-700 w-full"
    >
      <div class="w-max">
        <div class="text-5xl text-green-400 font-bold">All done</div>
        <p class="text-2xl md:text-3xl font-light leading-normal mt-2">
          You're free to use the application now
        </p>
        <button
          v-ripple
          @click="redirectToHomePage"
          class="disabled:cursor-not-allowed p-ripple px-4 mt-5 inline py-2 text-sm font-medium leading-5 shadow text-gray-400 transition-colors duration-150 border-0 rounded-lg focus:outline-none focus:shadow-outline-blue bg-gray-700 hover:bg-gray-800"
        >
          To the home page
        </button>
      </div>
      <div class="max-w-lg lg:ml-8">
        <img src="/notFoundCat.svg" alt="" />
      </div>
    </div>
    <div
      v-else-if="state.currentStep == StepEnum.Error"
      class="flex flex-col lg:flex-row items-center justify-center px-5 text-gray-700 w-full"
    >
      <div class="w-max">
        <div class="text-5xl text-red-500 font-bold">Error</div>
        <p class="text-2xl md:text-3xl font-light leading-normal mt-2">
          There was an error creating your account
        </p>
        <button
          v-ripple
          disabled
          class="disabled:cursor-not-allowed p-ripple px-4 mt-5 inline py-2 text-sm font-medium leading-5 shadow text-gray-400 transition-colors duration-150 border-0 rounded-lg focus:outline-none focus:shadow-outline-blue bg-gray-700 hover:bg-gray-800"
        >
          Start over
        </button>
      </div>
      <div class="max-w-lg lg:ml-8">
        <img src="/notFoundCat.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { RouteNames } from "@/constants/route-names";
import { defineComponent, reactive } from "vue";
import { useRouter } from "vue-router";

enum StepEnum {
  Start = 1,
  AccountDetails = 2,
  Done = 3,
  Error = 4
}

interface State {
  currentStep: StepEnum;
  currency: string | null;
  loading: boolean;
}

export default defineComponent({
  name: "Start",
  setup() {
    const router = useRouter();

    const state: State = reactive({
      currentStep: StepEnum.Start,
      currency: null,
      loading: false
    });

    async function createAccount() {
      state.loading = true;
      setTimeout(() => {
        state.currentStep = StepEnum.Done;
        state.loading = false;
      }, 3500);
    }

    function redirectToHomePage() {
      router.push({ name: RouteNames.HOME });
    }

    return {
      state,
      StepEnum,
      createAccount,
      redirectToHomePage
    };
  }
});
</script>
