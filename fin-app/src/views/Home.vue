<template>
  <div class="p-grid p-mt-5 p-nogutter">
    <div class="p-col p-px-5">
      <btn
        @click="openDialog"
        class="p-button-raised"
        style="background-color: #488a48"
        label="Novi unos"
      ></btn>
    </div>
    <div class="p-col p-px-5">2</div>
    <div class="p-col p-px-5">3</div>
  </div>
  <div class="p-grid p-mt-5 p-nogutter">
    <div class="p-col p-px-5">
      <chart type="bar" :data="state.basicData" />
    </div>
    <div class="p-col p-px-5">
      <chart type="bar" :data="state.basicData" />
    </div>
    <div class="p-col p-px-5">
      <chart type="bar" :data="state.basicData" />
    </div>
  </div>
  <p-dialog
    :maximizable="true"
    :modal="true"
    v-model:visible="state.dialog"
    :style="{ width: '50vw' }"
  >
    <template #header>
      <h3>Unos novog troška</h3>
    </template>
    <div class="p-fluid p-grid p-formgrid p-my-5">
      <div class="p-field p-col-12">
        <label for="integeronly">Integer Only</label>
        <input-number id="integeronly" v-model="state.newEntry" />
      </div>
    </div>
    <template #footer>
      <btn label="Save" icon="pi pi-check" class="p-button-raised" />
    </template>
  </p-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

interface State {
  dialog: boolean;
  newEntry?: string | null;
}

export default defineComponent({
  name: "Home",
  setup() {
    const state: State = reactive({
      dialog: false,
      newEntry: null,
      basicData: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July"
        ],
        datasets: [
          {
            label: "My First dataset",
            backgroundColor: "#42A5F5",
            data: [65, 59, 80, 81, 56, 55, 40]
          },
          {
            label: "My Second dataset",
            backgroundColor: "#9CCC65",
            data: [28, 48, 40, 19, 86, 27, 90]
          }
        ]
      }
    });

    function openDialog() {
      state.dialog = true;
    }

    return { state, openDialog };
  }
});
</script>
