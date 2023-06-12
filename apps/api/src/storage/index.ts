import { InMemoryStorage } from "./in_memory_storage";
import { SqlStorage } from "./sql_storage";
import { IEntry } from "../interfaces";
import { MongoDbStorage } from "./mongodb_storage";
import { DynamoDbStorage } from "./dynamodb_storage";

export interface IStorage {
  addEntry(url: string, slug: string): Promise<IEntry | undefined>;
  getEntry(slug: string): Promise<IEntry | undefined>;
}

export class StorageService implements IStorage {
  private storage: IStorage;
  constructor() {
    if (process.env.APP_MEMORY_CLASS === "local") {
      this.storage = new InMemoryStorage();
    } else if (process.env.APP_MEMORY_CLASS === "mysql") {
      this.storage = new SqlStorage();
    } else if (process.env.APP_MEMORY_CLASS === "mongodb") {
      this.storage = new MongoDbStorage();
    } else {
      this.storage = new DynamoDbStorage();
    }
  }
  async addEntry(url: string, slug: string): Promise<IEntry | undefined> {
    return await this.storage.addEntry(url, slug);
  }

  async getEntry(slug: string): Promise<IEntry | undefined> {
    return await this.storage.getEntry(slug);
  }
}
