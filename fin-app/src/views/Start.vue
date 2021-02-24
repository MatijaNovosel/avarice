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
            disabled
            class="disabled:cursor-not-allowed p-ripple px-4 mt-5 inline py-2 text-sm font-medium leading-5 shadow text-gray-400 transition-colors duration-150 border-0 rounded-lg focus:outline-none focus:shadow-outline-blue bg-gray-700 hover:bg-gray-800"
          >
            Create financial account
          </button>
        </div>
      </div>
      <div class="max-w-lg lg:ml-8">
        <img src="/notFoundCat.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

enum StepEnum {
  Start = 1,
  AccountDetails = 2,
  Done = 3
}

interface State {
  currentStep: StepEnum;
  currency: string | null;
}

export default defineComponent({
  name: "Start",
  setup() {
    const state: State = reactive({
      currentStep: StepEnum.Start,
      currency: null
    });

    return {
      state,
      StepEnum
    };
  }
});
</script>
