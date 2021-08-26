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
      <q-item
        class="rounded q-mb-sm q-py-md"
        :class="{
          'bg-grey-3': selectedAccountId != account.id,
          'bg-blue-2': selectedAccountId == account.id
        }"
        clickable
        v-for="account in accounts"
        :key="account.id"
        @click="updateSelectedAccountId(account.id)"
      >
        <q-item-section avatar>
          <q-avatar
            :color="selectedAccountId == account.id ? 'primary' : 'grey'"
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
      <q-item class="q-pa-none row justify-center" style="margin-bottom: -36px">
        <q-btn dense class="q-mr-md bg-grey-2 rounded q-mt-sm">
          <q-icon class="q-pa-xs" name="mdi-plus" color="grey-9" size="sm" />
          <q-menu touch-position>
            <q-virtual-scroll style="max-height: 300px; width: 260px" :items="heavyList" separator>
              <template v-slot="{ item, index }">
                <q-item :key="index" dense>
                  <q-item-section avatar>
                    <q-btn flat dense class="q-mx-md bg-white rounded">
                      <q-icon class="q-pa-xs" :name="item.name" color="grey-9" size="sm" />
                    </q-btn>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label> {{ item.name }} </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-virtual-scroll>
          </q-menu>
        </q-btn>
      </q-item>
    </template>
  </q-list>
</template>

<script lang="ts">
import { AccountModel } from "src/api/client";
import { formatBalance } from "src/utils/helpers";
import { defineComponent, PropType } from "vue";
import icons from "../utils/icons.json";

export default defineComponent({
  name: "account-list",
  emits: ["update:selectedAccountId"],
  props: {
    accounts: {
      type: Array as PropType<AccountModel[]>,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    selectedAccountId: {
      type: null
    }
  },
  setup(props, { emit }) {
    function updateSelectedAccountId(id: number) {
      emit("update:selectedAccountId", id);
    }

    const heavyList = [];

    for (let i = 0; i < icons.length; i++) {
      heavyList.push({
        name: `mdi-${icons[i].icon}`
      });
    }

    return {
      updateSelectedAccountId,
      formatBalance,
      heavyList
    };
  }
});
</script>
