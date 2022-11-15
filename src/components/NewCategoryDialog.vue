<template>
  <q-dialog v-model="state.open" persistent>
    <q-card style="min-width: 700px">
      <q-card-section class="row justify-between items-center">
        <span class="text-h6"> New category </span>
        <q-btn size="xs" @click="closeDialog" flat dense class="q-mr-md bg-grey-9 rounded">
          <q-icon class="q-pa-xs" name="mdi-close" size="xs" />
        </q-btn>
      </q-card-section>
      <q-separator />
      <q-card-section class="text-center">
        <q-form class="q-gutter-md">
          <q-input
            v-model="state.data.name"
            dense
            square
            filled
            label=""
            clearable
            :error="$v.name.$error"
            :error-message="collectErrors($v.name.$errors)"
            :hide-bottom-space="!$v.name.$error"
          >
            <template #label> <required-icon /> Category name </template>
            <template #after>
              <q-icon
                class="rounded bg-black q-pa-sm"
                :style="{ color: state.selectedColor }"
                :name="state.selectedIcon"
              >
                <q-tooltip>
                  {{ state.selectedIcon.split("mdi-")[1] }}
                </q-tooltip>
              </q-icon>
              <q-btn flat dense size="lg">
                <q-icon class="rounded" :style="{ backgroundColor: state.selectedColor }" />
                <q-menu touch-position>
                  <q-color
                    v-model="state.selectedColor"
                    no-header
                    no-footer
                    default-view="palette"
                  />
                </q-menu>
              </q-btn>
            </template>
          </q-input>
          <q-select
            hide-bottom-space
            options-dense
            filled
            dense
            v-model="state.newCategoryParent"
            :options="categories"
            option-value="id"
            option-label="name"
            label="Parent category"
            clearable
            emit-value
            map-options
          >
            <template #selected-item="scope">
              <q-item class="q-px-none q-pb-sm q-pt-md">
                <q-item-section avatar>
                  <q-icon :style="{ color: scope.opt.color }" :name="scope.opt.icon" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ scope.opt.name }}
                  </q-item-label>
                  <q-item-label caption class="text-grey-7">
                    {{ (scope.opt.parent && scope.opt.parent.name) || "No parent category" }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template #option="scope">
              <q-item class="q-py-sm" v-bind="scope.itemProps">
                <q-item-section avatar>
                  <q-icon
                    :style="{ color: scope.opt.color }"
                    :name="scope.opt.icon"
                    :color="scope.opt.color"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>
                    {{ scope.opt.name }}
                  </q-item-label>
                  <q-item-label caption class="text-grey-7">
                    {{ (scope.opt.parent && scope.opt.parent.name) || "No parent category" }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-input
            placeholder="Search icons"
            dense
            filled
            clearable
            @update:model-value="searchIcons"
            v-model="state.iconSearchText"
          >
            <template #append>
              <q-icon size="xs" name="mdi-magnify" />
            </template>
          </q-input>
          <q-list
            ref="scrollTargetRef"
            class="scroll bg-icon-list q-pt-md rounded"
            style="max-height: 250px"
            :class="{
              'q-pb-md': categoryInfiniteLoadDisabled
            }"
          >
            <q-infinite-scroll
              @load="onIconLoad"
              :disable="categoryInfiniteLoadDisabled"
              :offset="50"
              v-if="state.icons.length !== 0"
            >
              <div v-for="(icons, i) in state.icons" :key="i" class="row justify-center">
                <q-btn
                  v-for="(icon, j) in icons"
                  :key="j"
                  class="bg-black q-pa-sm q-mr-xs q-mb-xs rounded"
                  flat
                  dense
                  @click="setCategoryIcon(`mdi-${icon}`)"
                >
                  <q-icon
                    :style="{
                      color: state.selectedColor
                    }"
                    :name="`mdi-${icon}`"
                  >
                    <q-tooltip>
                      {{ icon }}
                    </q-tooltip>
                  </q-icon>
                </q-btn>
              </div>
              <template #loading>
                <div class="row justify-center q-my-md">
                  <q-spinner-dots :style="{ color: state.selectedColor }" size="40px" />
                </div>
              </template>
            </q-infinite-scroll>
            <q-item v-else>
              <q-item-section>
                <q-item-label> No icons found. </q-item-label>
                <q-item-label caption class="text-grey-7">
                  Try searching with other parameters.
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-form>
      </q-card-section>
      <q-card-actions class="q-px-md q-pb-md justify-end">
        <q-btn
          :loading="state.loading"
          @click="createAccount"
          unelevated
          color="accent"
          label="Create category"
          :disable="$v.$invalid"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { computed, reactive, watch } from "vue";
import { required, minLength } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { chunkArray, collectErrors } from "src/utils/helpers";
import { debounce, useQuasar } from "quasar";
import { getService, Types } from "src/di-container";
import { useUserStore } from "src/stores/user";
import iconList from "src/utils/icons";
import RequiredIcon from "src/components/RequiredIcon.vue";
import ICategoryService from "src/api/interfaces/categoryService";
import { storeToRefs } from "pinia";

interface State {
  open: boolean;
  loading: boolean;
  selectedColor: string;
  selectedIcon: string;
  iconSearchText: string | null;
  icons: string[][];
  filteredIcons: string[][];
  tempIcons: string[][];
  newCategoryParent: number | null;
  data: {
    name: string;
  };
}

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
});

const chunkedIconList = chunkArray<string>(iconList, 10);
const emit = defineEmits(["update:open"]);
const $q = useQuasar();
const userStore = useUserStore();
const { categories } = storeToRefs(userStore);

const categoryInfiniteLoadDisabled = computed(
  () => state.iconSearchText !== "" && state.iconSearchText !== null
);

const rules = {
  name: { required, minLength: minLength(3), $autoDirty: true }
};

const state: State = reactive({
  open: false,
  loading: false,
  selectedColor: "#ff00ff",
  selectedIcon: "mdi-plus",
  iconSearchText: null,
  tempIcons: [],
  icons: [],
  filteredIcons: [],
  newCategoryParent: null,
  data: {
    name: ""
  }
});

for (let i = 0; i < 5; i++) {
  state.icons.push(chunkedIconList[i]);
}

const $v = useVuelidate(rules, state.data);

const setCategoryIcon = (name: string) => {
  state.selectedIcon = name;
};

const searchIcons = debounce(() => {
  if (state.iconSearchText !== "" && state.iconSearchText !== null) {
    // TODO: Memorize initial icons before first actual search
    state.tempIcons = [...state.icons];
    state.icons = chunkArray<string>(
      iconList.filter((icon) =>
        icon.toLowerCase().includes(state.iconSearchText?.toLowerCase() as string)
      ),
      10
    );
  } else {
    state.icons = [...state.tempIcons];
  }
}, 750);

const closeDialog = () => {
  state.newCategoryParent = null;
  state.iconSearchText = null;
  state.selectedColor = "#ff00ff";
  state.selectedIcon = "mdi-plus";
  state.data = {
    name: ""
  };
  $v.value.$reset();
  emit("update:open", false);
};

const createAccount = async () => {
  state.loading = true;

  try {
    // Call create category here

    $q.notify({
      message: "Successfully created an account!",
      color: "dark",
      textColor: "green",
      position: "bottom"
    });

    const categories = await getService<ICategoryService>(
      Types.CategoryService
    ).getUserCategories();
    userStore.setCategories(categories);

    state.loading = false;
    closeDialog();
  } catch (e) {
    $q.notify({
      message: (e as Error).message,
      color: "dark",
      textColor: "red",
      position: "bottom"
    });
    state.loading = false;
  }
};

const onIconLoad = (index: number, done: () => void) => {
  setTimeout(() => {
    state.icons.push(chunkedIconList[index + 4]);
    done();
  }, 600);
};

watch(
  () => props.open,
  (val) => (state.open = val)
);
</script>
