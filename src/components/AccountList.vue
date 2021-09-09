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
            <q-skeleton type="text" />
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
            <q-skeleton type="text" />
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
            <q-skeleton type="text" />
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-else>
      <template v-if="selectedAccount && accounts.length !== 0">
        <q-item
          class="rounded q-mb-sm q-py-md"
          :class="{
            'bg-grey-3': selectedAccount.id != account.id,
            'bg-blue-2': selectedAccount.id == account.id
          }"
          clickable
          v-for="account in accounts"
          :key="account.id"
          @click="updateSelectedAccount(account)"
        >
          <q-item-section avatar>
            <q-avatar
              :color="selectedAccount.id == account.id ? 'primary' : 'grey'"
              text-color="white"
              size="sm"
            >
              {{ account.name && account.name[0] }}
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium"> {{ account.name }} </q-item-label>
            <q-item-label caption>
              Balance: {{ formatBalance(account.balance, account.currency) }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <q-item v-else>
        <q-item>
          <q-item-section>
            <q-item-label class="text-weight-medium"> No accounts found, create one! </q-item-label>
          </q-item-section>
        </q-item>
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
import { AccountModel } from "src/api/client";
import { formatBalance } from "src/utils/helpers";
import { defineComponent, PropType } from "vue";

export default defineComponent({
  name: "account-list",
  emits: ["update:selected-account"],
  props: {
    accounts: {
      type: Array as PropType<AccountModel[]>,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    selectedAccount: {
      type: Object as PropType<AccountModel | null>
    }
  },
  setup(props, { emit }) {
    function updateSelectedAccount(account: AccountModel) {
      emit("update:selected-account", account);
    }

    return {
      updateSelectedAccount,
      formatBalance
    };
  }
});
</script>
