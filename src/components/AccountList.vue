<template>
  <q-list class="bg-white q-pa-md rounded">
    <template v-if="loading">
      <q-item>
        <q-item-section avatar>
          <q-skeleton type="QAvatar" />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" width="65%" />
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section avatar>
          <q-skeleton type="QAvatar" />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" width="90%" />
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section avatar>
          <q-skeleton type="QAvatar" />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            <q-skeleton type="text" width="35%" />
          </q-item-label>
          <q-item-label caption>
            <q-skeleton type="text" />
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-else>
      <q-item
        class="rounded q-mb-sm q-py-md"
        :class="{
          'bg-grey-3': state.selectedAccountId != account.id,
          'bg-blue-2': state.selectedAccountId == account.id
        }"
        clickable
        v-for="account in accounts"
        :key="account.id"
        @click="state.selectedAccountId = account.id"
      >
        <q-item-section avatar>
          <q-avatar
            :color="state.selectedAccountId == account.id ? 'primary' : 'grey'"
            text-color="white"
            size="sm"
          >
            {{ account.name && account.name[0] }}
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium"> {{ account.name }} </q-item-label>
          <q-item-label caption>
            Balance: {{ `${account.balance} ${account.currency}` }}
          </q-item-label>
        </q-item-section>
      </q-item>
      <q-item class="q-pa-none row justify-center" style="margin-bottom: -36px">
        <q-btn dense class="q-mr-md bg-grey-2 rounded q-mt-sm">
          <q-icon class="q-pa-xs" name="mdi-plus" color="grey-9" size="sm" />
        </q-btn>
      </q-item>
    </template>
  </q-list>
</template>

<script lang="ts">
import { Account } from "src/api/client";
import { defineComponent, PropType, reactive } from "vue";

interface State {
  selectedAccountId: number | null;
}

export default defineComponent({
  name: "account-list",
  props: {
    accounts: {
      type: Array as PropType<Account[]>,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const state: State = reactive({
      selectedAccountId: null
    });

    return {
      state
    };
  }
});
</script>
