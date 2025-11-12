import type { Mutation } from "shared";
import { computed, ref, watch } from "vue";

import { useProfilesStore } from "@/stores/profiles";

export const useProfileEditor = () => {
  const store = useProfilesStore();

  const isEditing = computed(() => store.selectedProfile !== undefined);

  const name = ref("");
  const mutations = ref<Mutation[]>([]);

  watch(
    () => store.selectedProfile,
    (profile) => {
      if (profile !== undefined) {
        name.value = profile.name;
        mutations.value = [...profile.mutations];
      } else {
        name.value = "";
        mutations.value = [];
      }
    },
    { immediate: true },
  );

  const canSave = computed(() => {
    return name.value.trim() !== "";
  });

  const addMutation = (mutation: Mutation) => {
    mutations.value = [...mutations.value, mutation];
  };

  const updateMutations = (updated: Mutation[]) => {
    mutations.value = updated;
  };

  const save = async () => {
    if (!canSave.value) return;

    if (isEditing.value && store.selectedProfile !== undefined) {
      const success = await store.updateProfile(store.selectedProfile.id, {
        name: name.value.trim(),
        mutations: mutations.value,
      });
      if (success === true) {
        localStorage.setItem("authswap-reload-redirect", "true");
        window.location.reload();
      }
    } else {
      const success = await store.createProfile(
        name.value.trim(),
        mutations.value,
      );
      if (success === true) {
        localStorage.setItem("authswap-reload-redirect", "true");
        window.location.reload();
      }
    }
  };

  const cancel = () => {
    store.closeEditor();
  };

  return {
    isEditing,
    name,
    mutations,
    canSave,
    addMutation,
    updateMutations,
    save,
    cancel,
  };
};
