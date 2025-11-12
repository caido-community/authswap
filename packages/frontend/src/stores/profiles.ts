import { create } from "mutative";
import { defineStore } from "pinia";
import type { Profile } from "shared";
import { ref } from "vue";

import { useSDK } from "../plugins/sdk";

export const useProfilesStore = defineStore("profiles", () => {
  const sdk = useSDK();
  const data = ref<Profile[]>([]);
  const selectedProfile = ref<Profile | undefined>();
  const isCreating = ref(false);

  const initialize = async () => {
    await fetch();

    sdk.projects.onCurrentProjectChange(async () => {
      await fetch();
    });
  };

  const fetch = async () => {
    const result = await sdk.backend.getProfiles();
    switch (result.kind) {
      case "Ok":
        data.value = result.value;
        break;
      case "Error":
        console.error(result.error);
        sdk.window.showToast(
          "[Authswap] Failed to fetch profiles: " + result.error,
          {
            variant: "error",
          },
        );
        break;
    }
  };

  const createProfile = async (
    name: string,
    mutations: Profile["mutations"],
  ) => {
    const result = await sdk.backend.createProfile({ name, mutations });
    switch (result.kind) {
      case "Ok": {
        const newProfile: Profile = {
          id: result.value,
          name,
          mutations,
        };
        data.value = [...data.value, newProfile];
        sdk.window.showToast("Profile created", { variant: "success" });
        return true;
      }
      case "Error":
        sdk.window.showToast(result.error, { variant: "error" });
        return false;
    }
  };

  const updateProfile = async (
    id: string,
    updates: Partial<Omit<Profile, "id">>,
  ) => {
    const result = await sdk.backend.updateProfile(id, updates);
    switch (result.kind) {
      case "Ok": {
        const index = data.value.findIndex((p) => p.id === id);
        if (index !== -1) {
          const current = data.value[index];
          if (current !== undefined) {
            data.value = create(data.value, (draft) => {
              draft[index] = {
                id: current.id,
                name: updates.name ?? current.name,
                mutations: updates.mutations ?? current.mutations,
              };
            });
          }
        }
        sdk.window.showToast("Profile updated", { variant: "success" });
        return true;
      }
      case "Error":
        sdk.window.showToast(result.error, { variant: "error" });
        return false;
    }
  };

  const deleteProfile = async (id: string) => {
    const result = await sdk.backend.deleteProfile(id);
    switch (result.kind) {
      case "Ok":
        localStorage.setItem("authswap-reload-redirect", "true");
        window.location.reload();
        return true;
      case "Error":
        sdk.window.showToast(result.error, { variant: "error" });
        return false;
    }
  };

  const selectProfile = (profile: Profile) => {
    selectedProfile.value = profile;
    isCreating.value = false;
  };

  const startCreating = () => {
    selectedProfile.value = undefined;
    isCreating.value = true;
  };

  const closeEditor = () => {
    selectedProfile.value = undefined;
    isCreating.value = false;
  };

  return {
    data,
    selectedProfile,
    isCreating,
    fetch,
    createProfile,
    updateProfile,
    deleteProfile,
    selectProfile,
    startCreating,
    closeEditor,
    initialize,
  };
});
