<script setup lang="ts">
import Button from "primevue/button";
import Card from "primevue/card";

import { ProfileEditor } from "./ProfileEditor";
import { ProfilesList } from "./ProfilesList";

import { useProfilesStore } from "@/stores/profiles";

const store = useProfilesStore();
</script>

<template>
  <div class="h-full flex flex-col gap-1">
    <Card class="h-fit" :pt="{ body: { class: 'h-fit p-4' } }">
      <template #content>
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <h2 class="text-lg font-bold">Authswap</h2>
            <p class="text-sm text-surface-400">
              Create and manage authentication profiles for quick switching on the Replay page
            </p>
          </div>

          <Button
            size="small"
            label="Create Profile"
            icon="fas fa-plus"
            @click="store.startCreating"
          />
        </div>
      </template>
    </Card>

    <div
      v-if="store.isCreating || store.selectedProfile !== undefined"
      class="flex-1"
    >
      <ProfileEditor />
    </div>

    <div v-else class="flex-1">
      <ProfilesList />
    </div>
  </div>
</template>
