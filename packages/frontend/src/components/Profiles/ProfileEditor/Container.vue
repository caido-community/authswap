<script setup lang="ts">
import Button from "primevue/button";
import Card from "primevue/card";
import InputText from "primevue/inputtext";

import { MutationsCreateForm } from "../Mutations/CreateForm";
import { MutationsTable } from "../Mutations/Table";

import { useProfileEditor } from "./useProfileEditor";

const {
  isEditing,
  name,
  mutations,
  canSave,
  addMutation,
  updateMutations,
  save,
  cancel,
} = useProfileEditor();
</script>

<template>
  <div class="h-full flex flex-col gap-1">
    <Card class="h-fit" :pt="{ body: { class: 'p-4' } }">
      <template #content>
        <div class="flex justify-between items-start">
          <div class="flex flex-col">
            <h2 class="text-lg font-semibold">
              {{ isEditing ? "Edit Profile" : "Create Profile" }}
            </h2>
            <p class="text-xs text-surface-400">
              {{
                isEditing
                  ? "Modify authentication profile"
                  : "Create a new authentication profile"
              }}
            </p>
          </div>
          <div class="flex gap-2">
            <Button
              label="Cancel"
              severity="info"
              size="small"
              @click="cancel"
            />
            <Button
              label="Save"
              :disabled="!canSave"
              icon="fas fa-save"
              size="small"
              @click="save"
            />
          </div>
        </div>

        <div class="flex flex-col gap-2 mt-6">
          <div class="flex flex-col">
            <label class="text-sm font-bold">Profile Name</label>
            <p class="text-xs text-surface-400">Enter a name for the profile</p>
          </div>
          <InputText v-model="name" placeholder="User B" fluid />
        </div>
      </template>
    </Card>

    <Card
      class="flex-1 min-h-0"
      :pt="{
        body: { class: 'h-full p-0' },
        content: { class: 'h-full flex flex-col' },
      }"
    >
      <template #content>
        <div class="flex flex-col gap-1 p-4">
          <label class="text-sm font-bold">Mutations</label>
          <p class="text-xs text-surface-400">
            Define how requests should be modified for this profile
          </p>
        </div>

        <div class="flex-1 min-h-0">
          <MutationsTable :mutations="mutations" :on-update="updateMutations" />
        </div>

        <MutationsCreateForm :on-add="addMutation" class="p-4" />
      </template>
    </Card>
  </div>
</template>
