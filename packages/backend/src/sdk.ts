import type { SDK } from "caido:plugin";

let sdk: SDK | undefined;

export function setSDK(instance: SDK): void {
  sdk = instance;
}

export function requireSDK(): SDK {
  if (sdk === undefined) {
    throw new Error("SDK not initialized");
  }
  return sdk;
}
