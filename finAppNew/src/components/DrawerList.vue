<template>
  <v-list class="pt-0" dense v-if="state.items">
    <div v-for="(item, i) in state.items" :key="i">
      <v-list-group
        color="grey darken-2"
        v-model="state.selected"
        v-if="item.sublinks.length"
        :prepend-icon="item.icon"
      >
        <template #activator>
          <v-list-item-content>
            <v-list-item-title v-text="item.text" />
          </v-list-item-content>
        </template>
        <v-divider />
        <v-list-item
          color="primary"
          v-for="subItem in item.sublinks"
          :key="subItem.title"
          :to="subItem.route"
        >
          <v-list-item-icon>
            <v-icon>{{ subItem.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="subItem.text" />
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <v-list-item
        color="primary"
        v-else
        :to="item.route"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title v-text="item.text" />
        </v-list-item-content>
      </v-list-item>
      <v-divider />
    </div>
  </v-list>
</template>

<script lang="ts">
import {
  defineComponent,
  SetupContext,
  reactive,
  computed
} from "@vue/composition-api";

interface Props {
  items: any;
}

export default defineComponent({
  name: "drawer-list",
  props: {
    items: null
  },
  setup(props: Props, context: SetupContext) {
    const state = reactive({
      selected: null,
      items: props.items,
      routeName: computed(() => context.root.$route.name)
    });

    return {
      state
    };
  }
});
</script>

<style>
.group-box-text {
  position: absolute;
  top: -12px;
  left: 0xp;
  background-color: white;
  padding-left: 5px;
  padding-right: 5px;
  color: 1px solid rgba(0, 0, 0, 0.3);
}
.border-box {
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 15px;
}
</style>