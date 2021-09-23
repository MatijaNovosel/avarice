<template>
  <q-list class="bg-dark q-pa-md rounded">
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
      <span class="q-mb-md text-grey row"> Accounts </span>
      <template v-if="selectedAccount && accounts.length !== 0">
        <q-item
          class="rounded q-mb-sm q-py-sm"
          :class="{
            'bg-grey-9': selectedAccount.id != account.id,
            'bg-red-6': selectedAccount.id == account.id
          }"
          clickable
          v-for="account in accounts"
          :key="account.id"
          @click="updateSelectedAccount(account)"
        >
          <q-item-section avatar>
            <q-avatar
              rounded
              :color="selectedAccount.id == account.id ? 'red-9' : 'grey'"
              text-color="white"
              size="md"
            >
              {{ account.name && account.name[0] }}
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-medium"> {{ account.name }} </q-item-label>
            <q-item-label
              class="text-caption"
              :class="{
                'text-grey-6': selectedAccount.id != account.id
              }"
            >
              {{ formatBalance(account.balance, account.currency) }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
      <q-item v-else>
        <q-item class="text-black">
          <q-item-section>
            <q-item-label class="text-weight-medium"> No accounts found, create one! </q-item-label>
          </q-item-section>
        </q-item>
      </q-item>
      <q-item class="rounded q-mb-sm q-py-sm bg-grey-9">
        <q-item-section avatar>
          <q-avatar rounded color="grey-8" text-color="white" size="md"> T </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium"> Total </q-item-label>
          <q-item-label class="text-caption">
            {{ formatBalance(totalBalance, "HRK") }}
          </q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-icon name="mdi-lock" color="grey-6" />
        </q-item-section>
      </q-item>
      <q-item class="q-pa-none row justify-center" style="margin-bottom: -36px">
        <q-btn dense class="q-mr-md bg-dark-red rounded q-mt-sm">
          <q-icon class="q-pa-xs" name="mdi-plus" color="black" size="sm" />
        </q-btn>
      </q-item>
    </template>
  </q-list>
</template>

<script lang="ts">
import { AccountModel } from "src/api/client";
import { formatBalance } from "src/utils/helpers";
import { defineComponent, PropType, computed } from "vue";

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
      formatBalance,
      totalBalance: computed(() => {
        if (props.accounts) {
          return props.accounts.map((a) => a.balance).reduce((prev, curr) => prev + curr, 0);
        }
        return 0;
      })
    };
  }
});
</script>
