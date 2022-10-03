<template>
  <q-page>
    <div class="bg-grey-10 rounded-t-md">
      <div class="text-grey-6 q-py-md q-mx-lg flex justify-between items-center">
        <span> Categories </span>
        <q-btn class="bg-accent text-white rounded"> New category </q-btn>
      </div>
      <q-tree
        :nodes="simple"
        node-key="label"
        v-model:expanded="expanded"
        dark
        class="bg-dark-2 q-pa-lg rounded-b-md"
      />
    </div>
  </q-page>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const expanded = ref(["Satisfied customers (with avatar)", "Good food (with icon)"]);

const simple = [
  {
    label: "Satisfied customers (with avatar)",
    avatar: "https://cdn.quasar.dev/img/boy-avatar.png",
    children: [
      {
        label: "Good food (with icon)",
        icon: "restaurant_menu",
        children: [{ label: "Quality ingredients" }, { label: "Good recipe" }]
      },
      {
        label: "Good service (disabled node with icon)",
        icon: "room_service",
        disabled: true,
        children: [{ label: "Prompt attention" }, { label: "Professional waiter" }]
      },
      {
        label: "Pleasant surroundings (with icon)",
        icon: "photo",
        children: [
          {
            label: "Happy atmosphere (with image)",
            img: "https://cdn.quasar.dev/img/logo_calendar_128px.png"
          },
          { label: "Good table presentation" },
          { label: "Pleasing decor" }
        ]
      }
    ]
  }
];
</script>
