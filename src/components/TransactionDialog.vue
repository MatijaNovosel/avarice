<template>
  <q-dialog v-model="state.open" persistent>
    <q-card style="width: 700px">
      <q-card-section class="row justify-between items-center">
        <span class="text-h6">New transaction</span>
        <q-btn size="xs" @click="closeDialog" flat dense class="q-mr-md bg-grey-2 rounded">
          <q-icon class="q-pa-xs" name="mdi-close" color="grey-9" size="xs" />
        </q-btn>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form class="q-gutter-md">
          <q-input
            :error-message="amountErrors"
            :error="!!amountErrors"
            dense
            square
            filled
            hide-bottom-space
            clearable
            label="Amount"
            v-model="amount"
            suffix="HRK"
          />
          <q-input
            :error-message="descriptionErrors"
            :error="!!descriptionErrors"
            dense
            square
            filled
            hide-bottom-space
            clearable
            label="Description"
            v-model="description"
          />
          <q-select
            hide-bottom-space
            options-dense
            filled
            dense
            v-model="category"
            :options="state.categories"
            label="Category"
            :error-message="categoryErrors"
            :error="!!categoryErrors"
            option-value="id"
            option-label="name"
          />
        </q-form>
      </q-card-section>
      <q-card-actions class="q-px-md justify-center">
        <q-btn
          unelevated
          color="light-green-7"
          size="md"
          label="Create"
          @click="createTransaction"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, watch, computed } from "vue";
import { useForm, useField } from "vee-validate";
import { number, object, string } from "yup";
import { useQuasar } from "quasar";
import { useStore } from "src/store";
import { CategoryModel } from "src/api/client";

interface State {
  open: boolean;
  categories: CategoryModel[];
}

interface CreateTransactionSchema {
  amount: number;
  category: CategoryModel | null;
  description: string | null;
}

export default defineComponent({
  name: "transaction-dialog",
  emits: ["update:open"],
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const $q = useQuasar();
    const store = useStore();

    const schema = object({
      amount: number().required().moreThan(0).label("Amount"),
      description: string().required().min(4).label("Description"),
      category: object()
        .shape({
          name: string(),
          id: number(),
          icon: string(),
          color: string()
        })
        .nullable()
        .required()
        .label("Category")
    });

    const { handleSubmit, resetForm } = useForm<CreateTransactionSchema>({
      validationSchema: schema,
      initialValues: {
        amount: 0,
        category: null,
        description: ""
      }
    });

    const { value: amount, errorMessage: amountErrors } = useField<number>("amount");
    const { value: description, errorMessage: descriptionErrors } = useField<string>("description");
    const { value: category, errorMessage: categoryErrors } = useField<CategoryModel | null>(
      "category"
    );

    const state: State = reactive({
      open: props.open,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      categories: computed(() => store.getters["user/categories"] as CategoryModel[])
    });

    const createTransaction = handleSubmit(async () => {
      //
    });

    watch(
      () => props.open,
      (val) => {
        state.open = val;
      }
    );

    function closeDialog() {
      resetForm({
        values: {
          amount: 0,
          description: "",
          category: null
        }
      });
      emit("update:open", false);
    }

    return {
      state,
      closeDialog,
      amount,
      description,
      amountErrors,
      descriptionErrors,
      createTransaction,
      category,
      categoryErrors
    };
  }
});
</script>
