<template>
  <header-dialog
    :open="state.open"
    @close="closeDialog"
    max-width="400px"
    icon="mdi-help-circle"
    :title="state.title"
  >
    <div class="confirmation-dialog-content">
      <v-btn @click="yes" class="mr-5" color="success"> {{ $t("yes") }} </v-btn>
      <v-btn @click="no" color="error"> {{ $t("no") }} </v-btn>
    </div>
  </header-dialog>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  watch,
  SetupContext
} from "@vue/composition-api";
import HeaderDialog from "@/components/HeaderDialog.vue";

interface Props {
  title?: string | null;
  open?: boolean | null;
}

interface State {
  title?: string | null;
  open?: boolean | null;
}

export default defineComponent({
  name: "confirmation-dialog",
  components: {
    HeaderDialog
  },
  props: {
    title: {
      type: String,
      default: "Title"
    },
    open: {
      type: Boolean,
      default: false
    }
  },
  setup(props: Props, context: SetupContext) {
    const state: State = reactive({
      title: props.title,
      open: props.open
    });

    watch(
      () => props.open,
      (val) => (state.open = val)
    );

    function yes() {
      context.emit("yes");
    }

    function no() {
      context.emit("no");
    }

    function closeDialog() {
      state.open = false;
      context.emit("update:open", state.open);
    }

    return {
      state,
      yes,
      no,
      closeDialog
    };
  }
});
</script>

<style>
.confirmation-dialog-content {
  padding: 1.4em;
  display: flex;
  justify-content: center;
}
</style>
