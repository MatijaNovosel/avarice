<template>
  <div class="h-screen w-screen flex items-center">
    <div
      class="flex flex-col md:flex-row items-center justify-center px-5 text-gray-700 w-full"
    >
      <div class="w-max">
        <div class="text-5xl dark:text-gray-400 font-bold">Welcome</div>
        <p class="text-2xl md:text-3xl font-light leading-normal mt-2">
          To start using the application,
        </p>
        <p class="text-2xl md:text-3xl font-light leading-normal">
          you will need at least one financial account.
        </p>
        <button
          v-ripple
          class="p-ripple px-4 mt-5 inline py-2 text-sm font-medium leading-5 shadow text-white dark:text-gray-400 transition-colors duration-150 dark:border-0 border border-transparent rounded-lg focus:outline-none focus:shadow-outline-blue bg-blue-600 dark:bg-gray-700 active:bg-blue-600 hover:bg-blue-700 dark:hover:bg-gray-800"
        >
          Create financial account
        </button>
      </div>
      <div class="max-w-lg ml-7">
        <img src="/notFoundCat.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Start",
  setup() {
    return {};
  }
});
</script>

<style>
.cls-1 {
  fill: #d6b49a;
}
.cls-1,
.cls-10,
.cls-11,
.cls-13,
.cls-14,
.cls-15,
.cls-17,
.cls-2,
.cls-4,
.cls-5,
.cls-6 {
  stroke: #000;
}
.cls-1,
.cls-11,
.cls-13,
.cls-14,
.cls-16,
.cls-8 {
  stroke-linecap: round;
  stroke-linejoin: round;
}
.cls-1,
.cls-10,
.cls-11,
.cls-12,
.cls-13,
.cls-14,
.cls-15,
.cls-16,
.cls-17,
.cls-2,
.cls-3,
.cls-4,
.cls-5,
.cls-6,
.cls-7,
.cls-8,
.cls-9 {
  stroke-width: 3px;
}
.cls-2 {
  fill: #020202;
}
.cls-10,
.cls-12,
.cls-15,
.cls-17,
.cls-2,
.cls-3,
.cls-4,
.cls-5,
.cls-6,
.cls-7,
.cls-9 {
  stroke-miterlimit: 10;
}
.cls-3 {
  fill: #818181;
}
.cls-12,
.cls-16,
.cls-3,
.cls-7,
.cls-8,
.cls-9 {
  stroke: #191818;
}
.cls-4 {
  fill: #dcdbda;
}
.cls-5 {
  fill: #4ea7f1;
}
.cls-14,
.cls-6 {
  fill: #f8f3ed;
}
.cls-16,
.cls-7 {
  fill: #333;
}
.cls-13,
.cls-8 {
  fill: none;
}
.cls-9 {
  fill: #f8f59c;
}
.cls-10,
.cls-11 {
  fill: #f3d2c9;
}
.cls-15 {
  fill: #8bb174;
}
.cls-17 {
  fill: #da4e22;
}
</style>
