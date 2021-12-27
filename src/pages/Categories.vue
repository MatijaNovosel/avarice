<template>
  <div class="simple-page">
    <Container
      orientation="vertical"
      drag-class="card-ghost"
      drop-class="card-ghost-drop"
      :drop-placeholder="dropPlaceholderOptions"
      :get-ghost-parent="getGhostParent"
      @drop="onDrop"
    >
      <Draggable v-for="item in items" :key="item.id">
        <div class="draggable-item text-black">Draggable {{ item.data }}</div>
      </Draggable>
    </Container>
  </div>
</template>

<script lang="ts">
import { DropResult } from "src/models/common";
import { defineComponent, ref, Ref } from "vue";
import { Container, Draggable } from "vue3-smooth-dnd";

interface Item {
  id: number;
  data: number;
}

export default defineComponent({
  name: "Categories",
  components: { Container, Draggable },
  setup() {
    const items: Ref<Item[]> = ref([
      {
        id: 1,
        data: 1
      },
      {
        id: 2,
        data: 2
      },
      {
        id: 3,
        data: 3
      },
      {
        id: 4,
        data: 4
      },
      {
        id: 5,
        data: 5
      }
    ]);

    const applyDrag = (arr: Item[], dropResult: DropResult<Item>) => {
      const { removedIndex, addedIndex, payload } = dropResult;

      if (removedIndex === null && addedIndex === null) return arr;

      const result = [...arr];

      let itemToAdd = payload;

      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0];
      }

      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd);
      }

      return result;
    };

    const onDrop = (dropResult: DropResult<Item>) => {
      items.value = applyDrag(items.value, dropResult);
    };

    const dropPlaceholderOptions = {
      className: "drop-preview",
      animationDuration: "150",
      showOnTop: true
    };

    const getGhostParent = () => document.body;

    return {
      onDrop,
      items,
      getGhostParent,
      dropPlaceholderOptions
    };
  }
});
</script>
