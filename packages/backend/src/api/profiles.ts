import type { SDK } from "caido:plugin";
import type { Profile, ProfileInput, Result } from "shared";

import { profilesStore } from "../stores/profiles";

export function getProfiles(_: SDK): Result<Profile[]> {
  const profiles = profilesStore.getProfiles();
  return { kind: "Ok", value: profiles };
}

export function getProfile(_: SDK, id: string): Result<Profile> {
  const profile = profilesStore.getProfile(id);

  if (profile === undefined) {
    return { kind: "Error", error: "Profile not found" };
  }

  return { kind: "Ok", value: profile };
}

export async function createProfile(
  _: SDK,
  input: ProfileInput,
): Promise<Result<string>> {
  const id = crypto.randomUUID();
  const profile: Profile = {
    id,
    name: input.name,
    mutations: input.mutations,
  };

  await profilesStore.createProfile(profile);
  return { kind: "Ok", value: id };
}

export async function updateProfile(
  _: SDK,
  id: string,
  updates: Partial<Omit<Profile, "id">>,
): Promise<Result<void>> {
  const success = await profilesStore.updateProfile(id, updates);

  if (!success) {
    return { kind: "Error", error: "Profile not found" };
  }

  return { kind: "Ok", value: undefined };
}

export async function deleteProfile(_: SDK, id: string): Promise<Result<void>> {
  const success = await profilesStore.deleteProfile(id);

  if (!success) {
    return { kind: "Error", error: "Profile not found" };
  }

  return { kind: "Ok", value: undefined };
}
