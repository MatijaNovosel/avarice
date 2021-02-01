<template>
  <div class="flex flex-col sm:px-6 lg:px-8 mb-5">
    <div class="overflow-x-auto">
      <div class="min-w-full">
        <div class="shadow overflow-hidden rounded-t-lg border-gray-300 border">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  v-for="(header, i) in headers"
                  :key="i"
                  scope="col"
                  :class="{
                    'text-left': header.align == 'left',
                    'text-center': header.align == 'center',
                    'text-right': header.align == 'right'
                  }"
                  class="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {{ header.text }}
                </th>
              </tr>
            </thead>
            <tbody
              v-if="!state.loading"
              class="bg-white divide-y divide-gray-200"
            >
              <tr v-for="item in state.items" :key="item.id">
                <td class="pl-6 py-5 whitespace-nowrap">
                  {{ item.description }}
                </td>
                <td class="px-6 whitespace-nowrap text-sm text-gray-500">
                  {{ item.amount }} HRK
                </td>
                <td class="px-6 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    {{ item.createdAt }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{
                      formatDistance(
                        parse(item.createdAt, "dd.MM.yyyy. HH:mm", new Date()),
                        new Date(),
                        {
                          addSuffix: true
                        }
                      )
                    }}
                  </div>
                </td>
                <td class="whitespace-nowrap space-x-2 text-center">
                  <tag
                    v-for="(tag, i) in item.tagIds"
                    :key="i"
                    :text-color="item.expense ? '#c52626' : '#428733'"
                    :color="item.expense ? '#ff9494' : '#bedeb7'"
                    >{{ $t(`tags.${TagEnum[tag]}`) }}</tag
                  >
                </td>
                <td
                  class="px-6 whitespace-nowrap text-center text-sm font-medium"
                >
                  <a href="#" class="text-indigo-600 hover:text-indigo-900"
                    >Edit</a
                  >
                </td>
              </tr>
            </tbody>
          </table>
          <progress-bar v-if="state.loading" mode="indeterminate" class="h-2" />
          <div
            v-if="!state.loading && state.totalItems == 0"
            class="py-5 text-center w-full bg-white border-t border-b border-gray-200"
          >
            <span>No items found!</span>
          </div>
        </div>
      </div>
    </div>
    <paginator
      v-model:first="state.offset"
      v-model:rowsPerPage="state.rowsPerPage"
      :totalItems="state.totalItems"
      :rowsPerPageOptions="state.pageOptions"
      :pageLinkSize="state.pages"
      @page="pageChanged"
      class="pb-2 bg-gray-200 rounded-b-lg border-gray-300 border-b border-l border-r"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import { formatDistance, parse } from "date-fns";
import { TableHeaderItem } from "@/models/table";
import { Pagination } from "@/models/pagination";
import { TagEnum } from "@/constants/tag-enum";

interface Props {
  headers?: TableHeaderItem[];
  items?: unknown[];
  totalItems?: number;
  rowsPerPage?: number;
  pageOptions?: number[];
  pages?: number;
}

interface State {
  headers?: TableHeaderItem[];
  items?: unknown[];
  totalItems?: number;
  rowsPerPage?: number;
  pageOptions?: number[];
  pages?: number;
  loading: boolean;
  offset: number;
  currentPage: number;
}

export default defineComponent({
  name: "data-table",
  props: {
    items: null,
    pageOptions: null,
    headers: null,
    pages: {
      type: Number,
      default: 0
    },
    totalItems: {
      type: Number,
      default: 0
    },
    rowsPerPage: {
      type: Number,
      default: 0
    }
  },
  setup(props: Props) {
    const state: State = reactive({
      items: props.items,
      pageOptions: props.pageOptions,
      headers: props.headers,
      pages: props.pages,
      totalItems: props.totalItems,
      rowsPerPage: props.rowsPerPage,
      loading: false,
      currentPage: 0,
      offset: 0
    });

    const pageChanged: (...payload: unknown[]) => unknown = payload => {
      const { page } = { ...(payload as Pagination) };
      state.currentPage = page;
    };

    return {
      state,
      formatDistance,
      parse,
      pageChanged,
      TagEnum
    };
  }
});
</script>
