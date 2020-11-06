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
              id="amount"
              v-model="state.input.amount"
            />
            <label for="amount">Iznos troška</label>
          </span>
        </div>
        <div class="p-field p-col-12">
          <span class="p-float-label">
            <text-area v-model="state.input.description" id="text-area" />
            <label for="text-area">Opis</label>
          </span>
        </div>
        <div class="p-field p-col-12 p-mb-5 p-mt-3">
          <group-box title="Izvor plaćanja" background-color="#262626">
            <select-button
              v-model="state.input.PaymentSourceEnum"
              :options="PaymentSourceEnums"
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
                      state.input.categories.some(
                        (x) => x == slotProps.option.val
                      )
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
import { CategoryEnum } from "@/constants/category-enum";
import { PaymentSourceEnum } from "@/constants/payment-source-enum";
import { SelectItem } from "@/constants/select-item";

interface Input {
  PaymentSourceEnum?: PaymentSourceEnum | null;
  categories: Array<number>;
  description: string | null;
  amount: string | null;
}

interface Props {
  visible: boolean;
}

interface State {
  menuItems: Array<MenuItem>;
  visible: boolean;
  dialog: boolean;
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
        PaymentSourceEnum: PaymentSourceEnum.GyroAccount,
        categories: [],
        description: null,
        amount: null
      },
      visible: props.visible,
      dialog: false,
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

    const PaymentSourceEnums: Array<SelectItem<PaymentSourceEnum>> = [
      {
        text: "Žiro račun",
        val: PaymentSourceEnum.GyroAccount
      },
      {
        text: "Tekući račun",
        val: PaymentSourceEnum.CheckingAccount
      },
      {
        text: "Džep (novčanik)",
        val: PaymentSourceEnum.Pocket
      }
    ];

    const categories: Array<SelectItem<CategoryEnum>> = [
      {
        text: "Hrana",
        val: CategoryEnum.Food
      },
      {
        text: "Darovi",
        val: CategoryEnum.Gifts
      },
      {
        text: "Igre",
        val: CategoryEnum.Games
      },
      {
        text: "Javni prijevoz",
        val: CategoryEnum.PublicTransport
      }
    ];

    function addExpense() {
      state.dialog = false;
    }

    return {
      state,
      addExpense,
      PaymentSourceEnums,
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
