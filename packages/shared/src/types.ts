export type HeaderAddMutation = {
  kind: "HeaderAdd";
  header: string;
  value: string;
};

export type HeaderRemoveMutation = {
  kind: "HeaderRemove";
  header: string;
};

export type HeaderReplaceMutation = {
  kind: "HeaderReplace";
  header: string;
  value: string;
};

export type CookieAddMutation = {
  kind: "CookieAdd";
  cookie: string;
  value: string;
};

export type CookieRemoveMutation = {
  kind: "CookieRemove";
  cookie: string;
};

export type CookieReplaceMutation = {
  kind: "CookieReplace";
  cookie: string;
  value: string;
};

export type RawMatchAndReplaceMutation = {
  kind: "RawMatchAndReplace";
  match: string;
  value: string;
  regex: boolean;
};

export type Mutation =
  | HeaderAddMutation
  | HeaderRemoveMutation
  | HeaderReplaceMutation
  | CookieAddMutation
  | CookieRemoveMutation
  | CookieReplaceMutation
  | RawMatchAndReplaceMutation;

export type Profile = {
  id: string;
  name: string;
  mutations: Mutation[];
};

export type ProfileInput = Omit<Profile, "id">;

export type Result<T> =
  | { kind: "Error"; error: string }
  | { kind: "Ok"; value: T };
