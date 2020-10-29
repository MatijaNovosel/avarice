<template>
  <sidebar
    :dismissable="true"
    :modal="false"
    :showCloseIcon="false"
    :autoZIndex="false"
    v-model:visible="state.visible"
    style="z-index: 1"
    class="navbar-offset"
  >
    <panel-menu :model="state.menuItems" />
  </sidebar>
  <p-dialog
    :maximizable="true"
    :modal="true"
    v-model:visible="state.dialog"
    :style="{ width: '50vw' }"
  >
    <template #header>
      <h3>Unos novog troška</h3>
    </template>
    <vee-form>
      <div class="p-fluid p-grid p-formgrid p-my-5">
        <div class="p-field p-col-12">
          <span class="p-float-label">
            <input-number
              locale="hr-HR"
              mode="currency"
              currency="HRK"
              id="newEntry"
              v-model="state.newEntry"
            />
            <label for="newEntry">Iznos troška</label>
          </span>
        </div>
        <div class="p-field p-col-12">
          <h4 class="p-text-left">Kategorija</h4>
          <list-box
            :multiple="true"
            :filter="true"
            v-model="state.selectedCategories"
            :options="state.categories"
            dataKey="value"
            listStyle="max-height:250px"
            optionValue="value"
            optionLabel="text"
          >
            <template #option="slotProps">
              <div>
                <i
                  v-if="
                    state.selectedCategories.includes(slotProps.option.value)
                  "
                  class="pi pi-check p-mr-2"
                  style="fontsize: 1rem"
                />{{ slotProps.option.text }}
              </div>
            </template>
          </list-box>
        </div>
      </div>
    </vee-form>
    <template #footer>
      <btn
        @click="addExpense"
        label="Spremi"
        icon="pi pi-check"
        class="p-button-raised p-button-success"
      />
    </template>
  </p-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, watch } from "vue";
import MenuItem from "@/models/menu-item";

interface SelectItem {
  text: string;
  value: string | number;
}

interface Props {
  visible: boolean;
}

interface State {
  menuItems: Array<MenuItem>;
  visible: boolean;
  dialog: boolean;
  newEntry?: string | null;
  categories: Array<SelectItem>;
  selectedCategories?: Array<SelectItem> | null;
}

export default defineComponent({
  name: "drawer",
  props: {
    visible: Boolean
  },
  setup(props: Props) {
    const state: State = reactive({
      visible: props.visible,
      dialog: false,
      newEntry: null,
      selectedCategories: [],
      categories: [
        {
          text: "Text",
          value: 1
        },
        {
          text: "Text",
          value: 2
        },
        {
          text: "Text",
          value: 3
        },
        {
          text: "Text",
          value: 4
        },
        {
          text: "Text",
          value: 5
        },
        {
          text: "Text",
          value: 6
        },
        {
          text: "Text",
          value: 7
        },
        {
          text: "Text",
          value: 8
        },
        {
          text: "Text",
          value: 9
        }
      ],
      menuItems: [
        {
          label: "Financijske akcije",
          items: [
            {
              label: "Novi unos",
              icon: "pi pi-plus",
              command: () => {
                state.dialog = true;
              }
            },
            {
              label: "Stanje kroz vrijeme",
              icon: "pi pi-dollar",
              command: () => {
                console.log("Click!");
              }
            }
          ]
        },
        {
          label: "Postavke",
          items: [
            {
              label: "Aplikacijske postavke",
              icon: "pi pi-cog",
              command: () => {
                console.log("Click!");
              }
            },
            {
              label: "Korisničke postavke",
              icon: "pi pi-user",
              command: () => {
                console.log("Click!");
              }
            }
          ]
        }
      ]
    });

    watch(
      () => props.visible,
      (val) => (state.visible = val)
    );

    function addExpense() {
      state.dialog = false;
    }

    return {
      state,
      addExpense
    };
  }
});
</script>

<style scoped>
.navbar-height {
  height: var(--navbar-height);
}
</style>
