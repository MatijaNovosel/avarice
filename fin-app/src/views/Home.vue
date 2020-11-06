<template>
  <div class="p-grid p-mt-5 p-nogutter p-justify-center">
    <div class="p-col">
      Trenutačno stanje:
      <chip text-color="white" color="#f44336" class="p-ml-2">
        {{ state.currentAmount }}
      </chip>
    </div>
  </div>
  <div class="p-grid p-mt-5 p-nogutter">
    <div class="p-col p-px-5">
      <group-box title="Graf 1">
        <chart type="bar" :data="state.basicData" />
      </group-box>
    </div>
    <div class="p-col p-px-5">
      <group-box title="Graf 2">
        <chart type="bar" :data="state.basicData" />
      </group-box>
    </div>
    <div class="p-col p-px-5">
      <group-box title="Graf 3">
        <chart type="bar" :data="state.basicData" />
      </group-box>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted } from "vue";
import { db } from "@/services/firebase";

interface State {
  currentAmount: string;
}

export default defineComponent({
  name: "Home",
  setup() {
    const state = reactive({
      currentAmount: null,
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

    onMounted(() => {
      db.collection("current-amount").onSnapshot((snapshotChange) => {
        const data = snapshotChange.docs[0].data();
        state.currentAmount = data.val;
      });
      /*
      db.collection("history").onSnapshot((snapshotChange) => {
        snapshotChange.forEach(x => {
          console.log(x.data());
        });
      })
      */
    });

    return { state };
  }
});
</script>
