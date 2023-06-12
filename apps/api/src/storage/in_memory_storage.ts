import { IStorage } from "./index";
import { IEntry } from "../interfaces";

export class InMemoryStorage implements IStorage {
  storage: Record<string, string> = {};
  addEntry = async (url: string, slug: string): Promise<IEntry | undefined> => {
    this.storage[slug] = url;
    return await this.getEntry(slug);
  };
  getEntry = async (slug: string): Promise<IEntry> =>
    Promise.resolve({ url: this.storage[slug], slug: slug });
}
