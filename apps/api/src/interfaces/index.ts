export type RequestCreate = {
  readonly url: string;
  readonly length?: number;
  readonly customSlug?: string;
};

export type ErrorResponse = {
  readonly errorCode: number;
  readonly message: string;
  readonly name: string;
  readonly statusCode: number;
};

export type IEntry = {
  readonly id?: number;
  readonly url: string;
  readonly slug: string;
};
