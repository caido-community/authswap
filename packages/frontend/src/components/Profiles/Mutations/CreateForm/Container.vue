<script setup lang="ts">
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import type { Mutation } from "shared";

import { MUTATION_TYPES } from "../constants";

import { useCreateForm } from "./useCreateForm";

const props = defineProps<{
  onAdd: (mutation: Mutation) => void;
}>();

const { form, canAdd, add } = useCreateForm(props.onAdd);
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex gap-3 items-start">
      <div class="flex flex-col gap-2" style="min-width: 180px">
        <Select
          v-model="form.kind"
          :options="MUTATION_TYPES"
          option-label="label"
          option-value="value"
          placeholder="Select type"
        >
          <template #option="{ option }">
            <span v-tooltip.top="option.tooltip">{{ option.label }}</span>
          </template>
        </Select>
      </div>

      <div
        v-if="form.kind === 'RawMatchAndReplace'"
        class="flex flex-col gap-2 flex-1"
      >
        <InputText v-model="form.match" placeholder="Pattern to match" />
      </div>
      <div
        v-else-if="
          form.kind === 'CookieAdd' ||
          form.kind === 'CookieRemove' ||
          form.kind === 'CookieReplace'
        "
        class="flex flex-col gap-2 flex-1"
      >
        <InputText v-model="form.cookie" placeholder="Cookie name" />
      </div>
      <div v-else class="flex flex-col gap-2 flex-1">
        <InputText v-model="form.header" placeholder="Header name" />
      </div>

      <div class="flex flex-col gap-2 flex-1">
        <div class="flex items-center justify-between">
          <InputText
            v-model="form.value"
            placeholder="Value"
            :disabled="
              form.kind === 'HeaderRemove' || form.kind === 'CookieRemove'
            "
            class="flex-1"
          />
          <div
            v-if="form.kind === 'RawMatchAndReplace'"
            class="flex items-center gap-2 ml-3"
          >
            <Checkbox
              v-model="form.regex"
              v-tooltip.top="'Use regex'"
              input-id="regex-checkbox"
              binary
            />
            <label
              for="regex-checkbox"
              class="text-xs text-surface-400 select-none cursor-pointer"
            >
              Regex
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center gap-3 justify-end">
      <Button
        label="Add Mutation"
        icon="fas fa-plus"
        :disabled="!canAdd"
        size="small"
        @click="add"
      />
    </div>
  </div>
</template>
