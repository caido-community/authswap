import type { Mutation } from "shared";
import { ref } from "vue";

import { MUTATION_TYPES } from "../constants";

export const useMutationsTable = (
  mutations: Mutation[],
  onUpdate: (mutations: Mutation[]) => void,
) => {
  const editingRows = ref<Set<number>>(new Set());

  const toggleEdit = (index: number) => {
    const newEditingRows = new Set(editingRows.value);
    if (newEditingRows.has(index)) {
      newEditingRows.delete(index);
    } else {
      newEditingRows.add(index);
    }
    editingRows.value = newEditingRows;
  };

  const isEditing = (index: number) => {
    return editingRows.value.has(index);
  };

  const updateField = (index: number, value: string) => {
    const mutation = mutations[index];
    if (mutation === undefined) return;

    if (mutation.kind === "RawMatchAndReplace") {
      mutation.match = value;
    } else if (
      mutation.kind === "CookieAdd" ||
      mutation.kind === "CookieRemove" ||
      mutation.kind === "CookieReplace"
    ) {
      mutation.cookie = value;
    } else {
      mutation.header = value;
    }

    onUpdate([...mutations]);
  };

  const updateValue = (index: number, value: string) => {
    const mutation = mutations[index];
    if (mutation === undefined) return;

    if (mutation.kind !== "HeaderRemove" && mutation.kind !== "CookieRemove") {
      mutation.value = value;
    }

    onUpdate([...mutations]);
  };

  const updateRegex = (index: number, value: boolean) => {
    const mutation = mutations[index];
    if (mutation === undefined) return;

    if (mutation.kind === "RawMatchAndReplace") {
      mutation.regex = value;
    }

    onUpdate([...mutations]);
  };

  const remove = (index: number) => {
    const updated = [...mutations];
    updated.splice(index, 1);
    onUpdate(updated);
  };

  const getField = (mutation: Mutation): string => {
    if (mutation.kind === "RawMatchAndReplace") {
      return mutation.match;
    }
    if (
      mutation.kind === "CookieAdd" ||
      mutation.kind === "CookieRemove" ||
      mutation.kind === "CookieReplace"
    ) {
      return mutation.cookie;
    }
    return mutation.header;
  };

  const getValue = (mutation: Mutation): string => {
    if (mutation.kind === "HeaderRemove" || mutation.kind === "CookieRemove") {
      return "-";
    }
    return mutation.value;
  };

  const getTypeLabel = (kind: string) => {
    const type = MUTATION_TYPES.find((t) => t.value === kind);
    return type?.label ?? kind;
  };

  return {
    editingRows,
    toggleEdit,
    isEditing,
    updateField,
    updateValue,
    updateRegex,
    remove,
    getField,
    getValue,
    getTypeLabel,
  };
};
