<template>
  <q-list class="bg-dark q-pa-md rounded">
    <span class="q-mb-md text-grey row"> Accounts </span>
    <template v-if="userStore.selectedAccount && accountList.length !== 0">
      <Container
        orientation="vertical"
        group-name="accounts"
        @drop="onDrop"
        drag-class="card-ghost"
        drop-class="card-ghost-drop"
        :drop-placeholder="dropPlaceholderOptions"
      >
        <Draggable v-for="account in accountList" :key="account.id">
          <q-item
            class="rounded q-mb-sm q-py-sm"
            :class="{
              'bg-grey-9': userStore.selectedAccount.id !== account.id,
              'bg-accent': userStore.selectedAccount.id === account.id
            }"
            clickable
            @click="updateSelectedAccount(account)"
          >
            <q-item-section avatar>
              <q-avatar
                rounded
                :style="{
                  backgroundColor:
                    userStore.selectedAccount.id === account.id
                      ? shadedAccountListItemColor
                      : 'grey'
                }"
                text-color="white"
                size="md"
              >
                {{ account.name && account.name[0].toUpperCase() }}
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium"> {{ account.name }} </q-item-label>
              <q-item-label
                class="text-caption"
                :class="{
                  'text-grey-6': userStore.selectedAccount.id != account.id
                }"
              >
                {{ formatBalance(account.balance, account.currency) }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </Draggable>
      </Container>
      <q-item class="rounded q-mb-sm q-py-sm bg-grey-9">
        <q-item-section avatar>
          <q-avatar rounded color="grey-8" text-color="white" size="md"> T </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-weight-medium"> Total </q-item-label>
          <q-item-label class="text-caption">
            {{ formatBalance(userStore.totalBalance, "HRK") }}
          </q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-icon name="mdi-lock" color="grey-6" />
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
    <q-item class="q-pa-none row justify-center" :style="{ marginBottom: '-36px' }">
      <q-btn
        @click="appStore.toggleAccountDialog()"
        dense
        class="q-mr-md bg-accent rounded q-mt-sm"
      >
        <q-icon class="q-pa-xs" name="mdi-plus" color="black" size="sm" />
      </q-btn>
    </q-item>
  </q-list>
</template>

<script lang="ts" setup>
import { AccountModel } from "src/api/client";
import { DropResult } from "src/models/common";
import { useAppStore } from "src/stores/app";
import { useUserStore } from "src/stores/user";
import { formatBalance, shadeColor } from "src/utils/helpers";
import { computed, ref, watch } from "vue";
import { Container, Draggable } from "vue3-smooth-dnd";

const appStore = useAppStore();
const userStore = useUserStore();

const shadedAccountListItemColor = computed(() => shadeColor(appStore.accentColor, -30));
const accountList = ref<AccountModel[]>(userStore.accounts);

function updateSelectedAccount(account: AccountModel) {
  userStore.setSelectedAccount(account);
}

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
  accountList.value = applyDrag(accountList.value, dropResult);
};

const dropPlaceholderOptions = {
  className: "drop-preview",
  animationDuration: "150",
  showOnTop: true
};

watch(
  () => userStore.accounts,
  (val) => (accountList.value = val)
);
</script>
