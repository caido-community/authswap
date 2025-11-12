<script setup lang="ts">
import Button from "primevue/button";
import Card from "primevue/card";
import Checkbox from "primevue/checkbox";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import InputText from "primevue/inputtext";
import type { Mutation } from "shared";

import { useMutationsTable } from "./useMutationsTable";

const props = defineProps<{
  mutations: Mutation[];
  onUpdate: (mutations: Mutation[]) => void;
}>();

const {
  isEditing,
  toggleEdit,
  updateField,
  updateValue,
  updateRegex,
  remove,
  getField,
  getValue,
  getTypeLabel,
} = useMutationsTable(props.mutations, props.onUpdate);
</script>

<template>
  <Card
    class="h-full"
    :pt="{
      body: { class: 'h-full p-0' },
      content: { class: 'h-full' },
    }"
  >
    <template #content>
      <DataTable
        :value="mutations"
        striped-rows
        class="h-full"
        :pt="{
          root: { class: 'h-full' },
        }"
      >
        <Column field="kind" header="Type" style="width: 15%">
          <template #body="{ data }">
            {{ getTypeLabel(data.kind) }}
          </template>
        </Column>
        <Column header="Field" style="width: 30%">
          <template #body="{ data, index }">
            <InputText
              v-if="isEditing(index)"
              :model-value="getField(data)"
              autofocus
              fluid
              @blur="updateField(index, $event.target.value)"
              @keyup.enter="updateField(index, $event.target.value)"
            />
            <div
              v-else
              class="block text-ellipsis whitespace-nowrap overflow-hidden"
            >
              {{ getField(data) }}
            </div>
          </template>
        </Column>
        <Column header="Value" style="width: 35%">
          <template #body="{ data, index }">
            <InputText
              v-if="
                isEditing(index) &&
                data.kind !== 'HeaderRemove' &&
                data.kind !== 'CookieRemove'
              "
              :model-value="getValue(data)"
              autofocus
              fluid
              @blur="updateValue(index, $event.target.value)"
              @keyup.enter="updateValue(index, $event.target.value)"
            />
            <div
              v-else
              class="block text-ellipsis whitespace-nowrap overflow-hidden"
            >
              {{ getValue(data) }}
            </div>
          </template>
        </Column>
        <Column style="width: 8%">
          <template #header>
            <span v-tooltip.top="'Use regex for pattern matching'">
              Regex
            </span>
          </template>
          <template #body="{ data, index }">
            <Checkbox
              v-if="data.kind === 'RawMatchAndReplace'"
              :model-value="data.regex"
              binary
              @update:model-value="updateRegex(index, $event)"
            />
          </template>
        </Column>
        <Column header="Actions" style="width: 12%">
          <template #body="{ index }">
            <Button
              :icon="isEditing(index) ? 'fas fa-check' : 'fas fa-pencil'"
              text
              :severity="isEditing(index) ? 'success' : 'info'"
              size="small"
              @click="toggleEdit(index)"
            />
            <Button
              icon="fas fa-trash"
              text
              severity="danger"
              size="small"
              @click="remove(index)"
            />
          </template>
        </Column>
        <template #empty>
          <div class="text-center py-4 text-surface-400">
            No mutations configured
          </div>
        </template>
      </DataTable>
    </template>
  </Card>
</template>
