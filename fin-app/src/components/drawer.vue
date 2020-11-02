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
      <div class="p-fluid p-grid p-formgrid p-my-5 p-px-3">
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
        <div class="p-field p-col-12 p-mb-5 p-mt-3">
          <group-box title="Izvor plaćanja" background-color="#262626">
            <select-button
              v-model="state.input.paymentSource"
              :options="paymentSources"
              optionLabel="text"
              optionValue="val"
            />
          </group-box>
        </div>
        <div class="p-field p-col-12">
          <group-box title="Kategorija" background-color="#262626">
            <list-box
              :multiple="true"
              :filter="true"
              v-model="state.input.categories"
              :options="categories"
              dataKey="val"
              listStyle="max-height: 250px"
              optionValue="val"
              optionLabel="text"
            >
              <template #option="slotProps">
                <div>
                  <i
                    v-if="
                      state.input.categories.includes(slotProps.option.value)
                    "
                    class="pi pi-check p-mr-2"
                    style="fontsize: 1rem"
                  />{{ slotProps.option.text }}
                </div>
              </template>
            </list-box>
          </group-box>
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

interface SelectItem<T> {
  text: string;
  val: T | number;
}

interface Props {
  visible: boolean;
}

enum PaymentSource {
  GyroAccount = 1,
  CheckingAccount = 2,
  Pocket = 3
}

interface Input {
  paymentSource?: PaymentSource | null;
  categories: Array<number>;
}

interface State {
  menuItems: Array<MenuItem>;
  visible: boolean;
  dialog: boolean;
  newEntry?: string | null;
  input: Input;
}

export default defineComponent({
  name: "drawer",
  props: {
    visible: Boolean
  },
  setup(props: Props) {
    const state: State = reactive({
      input: {
        paymentSource: PaymentSource.GyroAccount,
        categories: []
      },
      visible: props.visible,
      dialog: false,
      newEntry: null,
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

    const paymentSources: Array<SelectItem<PaymentSource>> = [
      {
        text: "Žiro račun",
        val: PaymentSource.GyroAccount
      },
      {
        text: "Tekući račun",
        val: PaymentSource.CheckingAccount
      },
      {
        text: "Džep (novčanik)",
        val: PaymentSource.Pocket
      }
    ];

    const categories: Array<SelectItem<number>> = [
      {
        text: "Text",
        val: 1
      },
      {
        text: "Text",
        val: 2
      },
      {
        text: "Text",
        val: 3
      },
      {
        text: "Text",
        val: 4
      },
      {
        text: "Text",
        val: 5
      },
      {
        text: "Text",
        val: 6
      },
      {
        text: "Text",
        val: 7
      },
      {
        text: "Text",
        val: 8
      },
      {
        text: "Text",
        val: 9
      }
    ];

    function addExpense() {
      state.dialog = false;
    }

    return {
      state,
      addExpense,
      paymentSources,
      categories
    };
  }
});
</script>

<style scoped>
.navbar-height {
  height: var(--navbar-height);
}
</style>
