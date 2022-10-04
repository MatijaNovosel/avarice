<template>
  <q-page>
    <div class="bg-grey-10 rounded">
      <div class="text-grey-6 q-py-md q-mx-lg flex justify-between items-center">
        <span> Categories </span>
        <q-btn class="bg-accent text-white rounded" @click="newCategoryDialogOpen = true">
          New category
        </q-btn>
      </div>
      <q-tree
        :nodes="categoriesMapped"
        node-key="id"
        label-key="name"
        v-model:expanded="expanded"
        dark
        class="bg-dark-2 q-pa-lg rounded-b"
      />
    </div>
  </q-page>
  <new-category-dialog v-model:open="newCategoryDialogOpen" />
</template>

<script lang="ts" setup>
import { CategoryModel } from "src/api/client";
import { useUserStore } from "src/stores/user";
import { onMounted, ref } from "vue";
import NewCategoryDialog from "src/components/NewCategoryDialog.vue";

interface CategoryModelWithChildren extends CategoryModel {
  children: CategoryModelWithChildren[];
}

const arrayToTree = (list: CategoryModelWithChildren[]) => {
  const map = new Map();
  const roots = [];
  let node, i;

  for (i = 0; i < list.length; i++) {
    map.set(list[i].id, i);
    list[i].children = [];
  }

  for (i = 0; i < list.length; i++) {
    node = list[i];
    if (node.parent) {
      list[map.get(node.parent.id)].children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
};

const categoriesMapped = ref<CategoryModelWithChildren[]>([]);
const expanded = ref([]);
const newCategoryDialogOpen = ref(false);
const userStore = useUserStore();

onMounted(() => {
  const c = [...userStore.categories];
  categoriesMapped.value = arrayToTree(c.map((c) => ({ ...c, children: [] })));
});
</script>
