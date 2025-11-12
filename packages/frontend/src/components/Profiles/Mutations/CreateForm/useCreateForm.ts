import type { Mutation } from "shared";
import { computed, ref } from "vue";

type MutationInput = {
  kind: Mutation["kind"];
  header: string;
  cookie: string;
  match: string;
  value: string;
  regex: boolean;
};

export const useCreateForm = (onAdd: (mutation: Mutation) => void) => {
  const form = ref<MutationInput>({
    kind: "HeaderReplace",
    header: "",
    cookie: "",
    match: "",
    value: "",
    regex: false,
  });

  const canAdd = computed(() => {
    const mutation = form.value;

    if (mutation.kind === "RawMatchAndReplace") {
      return mutation.match !== "" && mutation.value !== "";
    }

    if (mutation.kind === "HeaderRemove") {
      return mutation.header !== "";
    }

    if (mutation.kind === "CookieRemove") {
      return mutation.cookie !== "";
    }

    if (mutation.kind === "CookieAdd" || mutation.kind === "CookieReplace") {
      return mutation.cookie !== "" && mutation.value !== "";
    }

    return mutation.header !== "" && mutation.value !== "";
  });

  const add = () => {
    if (!canAdd.value) return;

    const mutation = form.value;

    if (mutation.kind === "HeaderRemove") {
      onAdd({
        kind: "HeaderRemove",
        header: mutation.header,
      });
    } else if (mutation.kind === "CookieRemove") {
      onAdd({
        kind: "CookieRemove",
        cookie: mutation.cookie,
      });
    } else if (mutation.kind === "RawMatchAndReplace") {
      onAdd({
        kind: "RawMatchAndReplace",
        match: mutation.match,
        value: mutation.value,
        regex: mutation.regex,
      });
    } else if (
      mutation.kind === "CookieAdd" ||
      mutation.kind === "CookieReplace"
    ) {
      onAdd({
        kind: mutation.kind,
        cookie: mutation.cookie,
        value: mutation.value,
      });
    } else {
      onAdd({
        kind: mutation.kind,
        header: mutation.header,
        value: mutation.value,
      });
    }

    form.value = {
      kind: "HeaderReplace",
      header: "",
      cookie: "",
      match: "",
      value: "",
      regex: false,
    };
  };

  return {
    form,
    canAdd,
    add,
  };
};
