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
          </table>
          <progress-bar v-if="state.loading" mode="indeterminate" class="h-2" />
          <div
            v-if="!state.loading && state.totalItems == 0"
            class="py-5 text-center w-full bg-white border-t border-b border-gray-200"
          >
            {{ $t("noItemsFound") }}
          </div>
        </div>
      </div>
    </div>
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
