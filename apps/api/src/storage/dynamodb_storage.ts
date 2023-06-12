import { IStorage } from './index';
import { IEntry } from '../interfaces';
import { DynamoDB, Endpoint, config } from 'aws-sdk';

export class DynamoDbStorage implements IStorage {
  private connection;
  private tableName = 'SLUGS';
  private params = {
    AttributeDefinitions: [
      {
        AttributeName: 'slug',
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'slug',
        KeyType: 'HASH',
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
    TableName: this.tableName,
    StreamSpecification: {
      StreamEnabled: false,
    },
  };
  constructor() {
    config.update({ region: 'us-east-1' });
    this.connection = new DynamoDB({
      credentials:
        process.env.ENV === 'local'
          ? { accessKeyId: 'bla', secretAccessKey: 'bla' }
          : undefined,
      endpoint:
        process.env.ENV === 'local'
          ? new Endpoint('http://dynamodb:8000')
          : undefined,
    });

    this.connection.describeTable(
      { TableName: this.tableName },

      (err: Error, data: any) => {
        if (err) {
          {
            if (err.name === 'ResourceNotFoundException') {
              this.connection.createTable(
                this.params,
                function (err: Error, data: any) {
                  if (err) {
                    console.log('Error', err);
                  } else {
                    console.log('Table Created', data);
                  }
                }
              );
            }
          }
        }
      }
    );
  }

  addEntry(url: string, slug: string): Promise<IEntry | undefined> {
    return new Promise<IEntry | undefined>((resolve, reject) => {
      this.connection.putItem(
        {
          TableName: this.tableName,
          Item: { url: { S: url }, slug: { S: slug } },
        },
        (err: Error, data: any) => {
          if (err) {
            console.log(err);
            return reject(Promise.reject(err));
          } else {
            console.log('Entry added', data);
            return resolve(Promise.resolve(this.getEntry(slug)));
          }
        }
      );
    });
  }

  getEntry(slug: string): Promise<IEntry | undefined> {
    return new Promise<IEntry | undefined>((resolve, reject) => {
      try {
        this.connection.getItem(
          { TableName: this.tableName, Key: { slug: { S: slug } } },
          function (err: Error, data: any) {
            if (err) {
              console.log('Error', err, slug);
            } else {
              if (!data.Item) {
                return resolve(undefined);
              }
              return resolve({ slug: data.Item.slug.S, url: data.Item.url.S });
            }
          }
        );
      } catch (e) {
        console.log(e);
        return reject(Promise.reject(e));
      }
    });
  }
}
