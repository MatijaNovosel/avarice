<template>
  <div class="flex flex-col h-screen">
    <div class="flex flex-col my-8 items-center text-white">
      <span class="text-5xl proxima-bold font-bold gradient-text">FinApp</span>
      <span class="text-sm">by Matija Novosel</span>
    </div>
    <div class="flex flex-col space-y-1 text-gray-100">
      <template v-for="(sidebarItem, i) in state.items" :key="i">
        <div v-if="sidebarItem.divider">
          <hr class="my-2 border-t block border-gray-700" />
        </div>
        <div
          v-else
          :class="{
            'bg-gray-700': state.currentRoute == sidebarItem.routeName,
            'bg-gray-600': state.currentRoute != sidebarItem.routeName
          }"
          class="flex text-lg items-center cursor-pointer rounded-lg hover:bg-gray-700 py-2 px-3 mx-3 p-ripple"
          @click="redirect(sidebarItem.routeName)"
          v-ripple
        >
          <mdi-icon
            class="mr-3 select-none"
            color="#ffffff"
            :name="sidebarItem.iconName"
          />
          <span class="select-none">{{ sidebarItem.text }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, reactive } from "vue";
import { useRouter, useRoute } from "vue-router";
import mdiIcon from "@/components/mdi-icon.vue";
import { SidebarItem } from "@/models/sidebar-item";

interface Props {
  items?: SidebarItem[];
}

interface State {
  currentRoute: string | symbol | null | undefined;
  items?: SidebarItem[];
}

export default defineComponent({
  name: "sidebar",
  components: {
    mdiIcon
  },
  props: {
    items: null
  },
  setup(props: Props) {
    const router = useRouter();
    const route = useRoute();

    const state: State = reactive({
      items: props.items,
      currentRoute: computed(() => {
        return route.name;
      })
    });

    function redirect(name: string) {
      if (state.currentRoute != name) {
        router.push({ name });
      }
    }

    return {
      state,
      redirect
    };
  }
});
</script>
