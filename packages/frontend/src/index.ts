import { Classic } from "@caido/primevue";
import { createPinia } from "pinia";
import PrimeVue from "primevue/config";
import Tooltip from "primevue/tooltip";
import { createApp } from "vue";

import { SDKPlugin } from "./plugins/sdk";
import { useProfilesStore } from "./stores/profiles";
import "./styles/index.css";
import type { FrontendSDK } from "./types";
import App from "./views/App.vue";

export const init = (sdk: FrontendSDK) => {
  const app = createApp(App);

  const pinia = createPinia();
  app.use(pinia);

  app.use(PrimeVue, {
    unstyled: true,
    pt: Classic,
  });

  app.directive("tooltip", Tooltip);

  app.use(SDKPlugin, sdk);

  const root = document.createElement("div");
  Object.assign(root.style, {
    height: "100%",
    width: "100%",
  });

  root.id = `plugin--authswap`;

  app.mount(root);

  sdk.navigation.addPage("/authswap", {
    body: root,
  });

  sdk.sidebar.registerItem("Authswap", "/authswap", {
    icon: "fas fa-user-lock",
  });

  const shouldRedirect = localStorage.getItem("authswap-reload-redirect");
  if (shouldRedirect === "true") {
    localStorage.removeItem("authswap-reload-redirect");
    sdk.navigation.goTo("/authswap");
  }

  const profilesStore = useProfilesStore();

  profilesStore.fetch().then(() => {
    for (const profile of profilesStore.data) {
      sdk.replay.addToSlot("session-toolbar-primary", {
        type: "Button",
        label: profile.name,
        icon: "fas fa-user",
        onClick: async () => {
          const view = sdk.window.getActiveEditor()?.getEditorView();
          if (view === undefined) {
            sdk.window.showToast("No active editor", { variant: "error" });
            return;
          }

          const currentRequest = view.state.doc.toString();

          const result = await sdk.backend.applyProfileMutations(
            profile.id,
            currentRequest,
          );

          if (result.kind === "Error") {
            sdk.window.showToast(result.error, { variant: "error" });
            return;
          }

          view.dispatch({
            changes: {
              from: 0,
              to: view.state.doc.length,
              insert: result.value,
            },
          });
          view.focus();

          sdk.window.showToast(`Applied ${profile.name} profile`, {
            variant: "success",
            duration: 1000  ,
          });
        },
      });
    }
  });
};
