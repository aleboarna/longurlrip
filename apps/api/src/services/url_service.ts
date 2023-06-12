import { PlatformException } from "../exceptions/PlatformException";
import { ErrorTypes } from "../exceptions";
import { StorageService } from "../storage";
import { IEntry } from "../interfaces";

export class UrlService {
  private storageService: StorageService;
  constructor() {
    this.storageService = new StorageService();
  }

  async addEntry(
    url: string,
    lengthUID = 5,
    customSlug?: string
  ): Promise<string | undefined> {
    if (customSlug !== undefined) {
      if ((await this.getEntry(customSlug)) === undefined) {
        return (await this.storageService.addEntry(url, customSlug))?.slug;
      } else
        throw new PlatformException(
          ErrorTypes.APIErrorCodes.INVALID_REQUEST_SLUG
        );
    }
    let slug = this.generateID(lengthUID);
    while ((await this.getEntry(slug)) !== undefined) {
      slug = this.generateID(lengthUID);
    }
    return (await this.storageService.addEntry(url, slug))?.slug;
  }

  async getEntry(slug: string): Promise<IEntry | undefined> {
    return await this.storageService.getEntry(slug);
  }

  private generateID = (length: number) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
}
