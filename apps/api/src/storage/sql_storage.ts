import { IStorage } from "./index";
import mysql, {
  FieldPacket,
  OkPacket,
  QueryError,
  RowDataPacket,
} from "mysql2";
import { IEntry } from "../interfaces";
import { PlatformException } from "../exceptions/PlatformException";
import { ErrorTypes } from "../exceptions";

export class SqlStorage implements IStorage {
  private connection: mysql.Connection;
  constructor() {
    this.connection = mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      database: process.env.MYSQL_DATABASE,
      password: process.env.MYSQL_PASSWORD,
    });
  }
  async addEntry(url: string, slug: string): Promise<IEntry | undefined> {
    const query = "INSERT INTO slugs(`url`,`slug`) VALUES (?,?)";
    return new Promise((resolve, reject) => {
      this.connection.query<OkPacket>(
        query,
        [url, slug],
        (err: QueryError | null, result: OkPacket, fields: FieldPacket[]) => {
          if (err) {
            console.error(err);
            reject(
              new PlatformException(
                ErrorTypes.APIErrorCodes.INTERNAL_SERVER_ERROR
              )
            );
          } else resolve(this.getEntry(slug));
        }
      );
    });
  }

  async getEntry(slug: string): Promise<IEntry | undefined> {
    const query = "SELECT * from slugs WHERE slug = ?";
    return new Promise((resolve, reject) => {
      this.connection.query<IMySQLEntry[]>(
        query,
        [slug],
        (err: QueryError | null, result: IMySQLEntry[]) => {
          if (err)
            reject(
              new PlatformException(
                ErrorTypes.APIErrorCodes.INTERNAL_SERVER_ERROR
              )
            );
          else {
            if (result.length > 0) {
              resolve(result?.[0]);
            } else resolve(undefined);
          }
        }
      );
    });
  }
}

interface IMySQLEntry extends RowDataPacket {
  id: number;
  url: string;
  slug: string;
}
