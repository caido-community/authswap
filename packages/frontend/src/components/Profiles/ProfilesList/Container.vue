<script setup lang="ts">
import Button from "primevue/button";
import Card from "primevue/card";
import Column from "primevue/column";
import DataTable from "primevue/datatable";

import { useProfilesStore } from "@/stores/profiles";

const store = useProfilesStore();
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
      <DataTable :value="store.data" striped-rows class="h-full">
        <Column
          field="name"
          header="Name"
          style="width: 60%"
          :pt="{
            headercell: {
              style: {
                borderTop: 'none',
              },
            },
          }"
        ></Column>
        <Column
          header="Mutations"
          style="width: 20%"
          :pt="{
            headercell: {
              style: {
                borderTop: 'none',
              },
            },
          }"
        >
          <template #body="{ data }">
            {{ data.mutations.length }}
          </template>
        </Column>
        <Column
          header="Actions"
          style="width: 20%"
          :pt="{
            headercell: {
              style: {
                borderTop: 'none',
              },
            },
          }"
        >
          <template #body="{ data }">
            <Button
              icon="fas fa-pencil"
              text
              severity="info"
              size="small"
              @click="store.selectProfile(data)"
            />
            <Button
              icon="fas fa-trash"
              text
              severity="danger"
              size="small"
              @click="store.deleteProfile(data.id)"
            />
          </template>
        </Column>
        <template #empty>
          <div class="text-center py-4 text-surface-400">
            No profiles configured
          </div>
        </template>
      </DataTable>
    </template>
  </Card>
</template>
