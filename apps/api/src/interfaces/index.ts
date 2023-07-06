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
