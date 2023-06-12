import mongoose from "mongoose";
import { IStorage } from "./index";
import { IEntry } from "../interfaces";

export class MongoDbStorage implements IStorage {
  private connection;
  private entrySchema = new mongoose.Schema({ url: String, slug: String });
  private Slug = mongoose.model("Slugs", this.entrySchema);
  constructor() {
    const url = `mongodb://${process.env.MONGO_HOST}:27017/${process.env.MONGO_DB}`;
    console.log(url);
    this.connection = mongoose.connect(url);
  }

  async addEntry(url: string, slug: string): Promise<IEntry | undefined> {
    const entry = new this.Slug({ url: url, slug: slug });
    try {
      await entry.save();
      return Promise.resolve(this.getEntry(slug));
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  }

  async getEntry(slug: string): Promise<IEntry | undefined> {
    const doc = await this.Slug.findOne({ slug: slug });
    if (doc) {
      return Promise.resolve(<IEntry>{
        url: doc.url,
        slug: doc.slug,
      });
    } else {
      return Promise.resolve(undefined);
    }
  }
  catch(e: Error) {
    console.error(e);
    return Promise.reject(e);
  }
}
