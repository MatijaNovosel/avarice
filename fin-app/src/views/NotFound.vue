<template>
  <div class="h-screen w-screen flex items-center">
    <div
      class="flex flex-col md:flex-row items-center justify-center px-5 text-gray-700 w-full"
    >
      <div class="w-max">
        <div class="text-5xl dark:text-gray-400 font-bold">404</div>
        <p class="text-2xl md:text-3xl font-light leading-normal">
          Sorry, we couldn't find this page.
        </p>
        <button
          @click="backToHomePage"
          class="px-4 mt-5 inline py-2 text-sm font-medium leading-5 shadow text-white dark:text-gray-400 transition-colors duration-150 dark:border-0 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue bg-blue-600 dark:bg-gray-700 active:bg-blue-600 hover:bg-blue-700 dark:hover:bg-gray-800"
        >
          Back to homepage
        </button>
      </div>
      <div class="max-w-lg ml-5">
        <img src="/notFoundCat.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { RouteNames } from "@/constants/route-names";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "NotFound",
  setup() {
    const router = useRouter();

    function backToHomePage() {
      // No need for additional authentication checks since the user gets redirected anyway
      router.push({ name: RouteNames.HOME });
    }

    return { backToHomePage };
  }
});
</script>
