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
      <template v-if="selectedAccount && accountsList.length !== 0">
        <Container
          orientation="vertical"
          group-name="accounts"
          @drop="onDrop"
          drag-class="card-ghost"
          drop-class="card-ghost-drop"
          :drop-placeholder="dropPlaceholderOptions"
        >
          <Draggable v-for="account in accountsList" :key="account.id">
            <q-item
              class="rounded q-mb-sm q-py-sm"
              :class="{
                'bg-grey-9': selectedAccount.id != account.id,
                'bg-accent': selectedAccount.id == account.id
              }"
              clickable
              @click="updateSelectedAccount(account)"
            >
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
          </Draggable>
        </Container>
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
        <q-btn dense class="q-mr-md bg-accent rounded q-mt-sm">
          <q-icon class="q-pa-xs" name="mdi-plus" color="black" size="sm" />
        </q-btn>
      </q-item>
    </template>
  </q-list>
</template>

<script lang="ts" setup>
import { AccountModel } from "src/api/client";
import { DropResult } from "src/models/common";
import { formatBalance } from "src/utils/helpers";
import { PropType, computed, ref } from "vue";
import { Container, Draggable } from "vue3-smooth-dnd";

const emit = defineEmits(["update:selected-account"]);

const props = defineProps({
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
});

function updateSelectedAccount(account: AccountModel) {
  emit("update:selected-account", account);
}

const accountsList = ref(props.accounts);

const applyDrag = (arr: AccountModel[], dropResult: DropResult<AccountModel>) => {
  const { removedIndex, addedIndex, payload } = dropResult;

  if (removedIndex === null && addedIndex === null) return arr;

  const result = [...arr];

  let itemToAdd = payload;

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }

  return result;
};

const onDrop = (dropResult: DropResult<AccountModel>) => {
  accountsList.value = applyDrag(accountsList.value, dropResult);
};

const dropPlaceholderOptions = {
  className: "drop-preview",
  animationDuration: "150",
  showOnTop: true
};

const totalBalance = computed(() => {
  if (props.accounts) {
    return props.accounts.map((a) => a.balance).reduce((prev, curr) => prev + curr, 0);
  }
  return 0;
});
</script>
