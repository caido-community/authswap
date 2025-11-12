import type { DefineAPI, SDK } from "caido:plugin";

import { applyProfileMutations } from "./api/mutations";
import {
  createProfile,
  deleteProfile,
  getProfile,
  getProfiles,
  updateProfile,
} from "./api/profiles";
import { setSDK } from "./sdk";
import { profilesStore } from "./stores/profiles";

export type API = DefineAPI<{
  getProfiles: typeof getProfiles;
  getProfile: typeof getProfile;
  createProfile: typeof createProfile;
  updateProfile: typeof updateProfile;
  deleteProfile: typeof deleteProfile;
  applyProfileMutations: typeof applyProfileMutations;
}>;

export async function init(sdk: SDK<API>): Promise<void> {
  setSDK(sdk);

  await profilesStore.initialize();

  sdk.events.onProjectChange(async () => {
    const project = await sdk.projects.getCurrent();
    await profilesStore.switchProject(project?.getId());
  });

  sdk.api.register("getProfiles", getProfiles);
  sdk.api.register("getProfile", getProfile);
  sdk.api.register("createProfile", createProfile);
  sdk.api.register("updateProfile", updateProfile);
  sdk.api.register("deleteProfile", deleteProfile);
  sdk.api.register("applyProfileMutations", applyProfileMutations);
}
