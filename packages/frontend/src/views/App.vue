<script setup lang="ts">
import { onMounted } from "vue";

import Profiles from "@/components/Profiles/Container.vue";
import { useProfilesStore } from "@/stores/profiles";

const profilesStore = useProfilesStore();

onMounted(() => {
  profilesStore.initialize();
});
</script>

<template>
  <Profiles />
</template>
