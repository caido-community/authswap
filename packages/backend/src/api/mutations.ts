import type { SDK } from "caido:plugin";
import type { Result } from "shared";

import { applyMutations } from "../core/mutations";
import { profilesStore } from "../stores/profiles";

export function applyProfileMutations(
  _: SDK,
  profileId: string,
  rawRequest: string,
): Result<string> {
  const profile = profilesStore.getProfile(profileId);

  if (profile === undefined) {
    return { kind: "Error", error: "Profile not found" };
  }

  const modified = applyMutations(rawRequest, profile.mutations);
  return { kind: "Ok", value: modified };
}
