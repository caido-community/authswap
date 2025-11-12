import type { Profile } from "shared";

import { ProjectScopedStore } from "./project-store";

export class ProfilesStore extends ProjectScopedStore<Profile[]> {
  constructor() {
    super("authswap-profiles");
  }

  protected getDefaultData(): Profile[] {
    return [];
  }

  getProfiles(): Profile[] {
    return this.data;
  }

  getProfile(id: string): Profile | undefined {
    return this.data.find((profile) => profile.id === id);
  }

  async createProfile(profile: Profile): Promise<void> {
    this.data.push(profile);
    await this.saveToFile();
    this.notify();
  }

  async updateProfile(
    id: string,
    updates: Partial<Omit<Profile, "id">>,
  ): Promise<boolean> {
    const index = this.data.findIndex((profile) => profile.id === id);
    if (index === -1) {
      return false;
    }
    const current = this.data[index];
    if (current === undefined) {
      return false;
    }
    this.data[index] = {
      id: current.id,
      name: updates.name ?? current.name,
      mutations: updates.mutations ?? current.mutations,
    };
    await this.saveToFile();
    this.notify();
    return true;
  }

  async deleteProfile(id: string): Promise<boolean> {
    const index = this.data.findIndex((profile) => profile.id === id);
    if (index === -1) {
      return false;
    }
    this.data.splice(index, 1);
    await this.saveToFile();
    this.notify();
    return true;
  }
}

export const profilesStore = new ProfilesStore();
