<template>
  <div class="row">
    <div class="col-6 col-md-4">
      <q-card class="my-card" rounded>
        <q-card-section class="row items-center justify-between">
          <span> Total balance </span>
          <div>
            <q-chip
              dense
              color="pink-1"
              class="q-pa-md"
              text-color="red"
              icon="mdi-arrow-top-right"
            >
              <b> 1,500.00 HRK </b>
            </q-chip>
            <q-chip
              dense
              color="green-1"
              class="q-pa-md"
              text-color="green"
              icon="mdi-arrow-bottom-left"
            >
              <b> 2,500.00 HRK </b>
            </q-chip>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="text-h4 text-center">5,400.00 HRK</div>
        </q-card-section>
        <q-card-actions>
          <q-btn flat color="dark" label="Deposit" />
          <q-btn flat color="primary" label="Withdraw" />
          <q-space />
          <q-btn color="grey" round flat dense />
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Todo, Meta } from "components/models";
import ExampleComponent from "components/CompositionComponent.vue";
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "PageIndex",
  components: { ExampleComponent },
  setup() {
    const todos = ref<Todo[]>([
      {
        id: 1,
        content: "ct1"
      },
      {
        id: 2,
        content: "ct2"
      },
      {
        id: 3,
        content: "ct3"
      },
      {
        id: 4,
        content: "ct4"
      },
      {
        id: 5,
        content: "ct5"
      }
    ]);
    const meta = ref<Meta>({
      totalCount: 1200
    });
    return { todos, meta };
  }
});
</script>
