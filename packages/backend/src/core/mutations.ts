import type { Mutation } from "shared";
import { HttpForge } from "ts-http-forge";

export function applyMutations(raw: string, mutations: Mutation[]): string {
  let forge = HttpForge.create(raw);

  for (const mutation of mutations) {
    forge = applyMutation(forge, mutation);
  }

  return forge.build();
}

function applyMutation(forge: HttpForge, mutation: Mutation): HttpForge {
  switch (mutation.kind) {
    case "HeaderAdd":
      return forge.addHeader(mutation.header, mutation.value);

    case "HeaderRemove":
      return forge.removeHeader(mutation.header);

    case "HeaderReplace":
      return forge.setHeader(mutation.header, mutation.value);

    case "CookieAdd":
      return forge.addCookie(mutation.cookie, mutation.value);

    case "CookieRemove":
      return forge.removeCookie(mutation.cookie);

    case "CookieReplace":
      return forge.setCookie(mutation.cookie, mutation.value);

    case "RawMatchAndReplace":
      return applyRawMatchAndReplace(forge, mutation);
  }
}

function applyRawMatchAndReplace(
  forge: HttpForge,
  mutation: Extract<Mutation, { kind: "RawMatchAndReplace" }>,
): HttpForge {
  const raw = forge.build();

  if (mutation.regex) {
    const regex = new RegExp(mutation.match, "g");
    const modified = raw.replace(regex, mutation.value);
    return HttpForge.create(modified);
  }

  const modified = raw.replaceAll(mutation.match, mutation.value);
  return HttpForge.create(modified);
}
