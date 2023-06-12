export enum APIErrorCodes {
  INVALID_REQUEST_PATH = 1000,
  INVALID_REQUEST_BODY = 1001,
  INVALID_REQUEST_SLUG = 1002,
  INTERNAL_SERVER_ERROR = 2000,
}

export type ErrorResponse = { name: string; message: string; status: number };

export const ERROR_TYPES_KNOWN: { [key in APIErrorCodes]: ErrorResponse } = {
  [APIErrorCodes.INVALID_REQUEST_PATH]: {
    name: "RESOURCE_NOT_FOUND",
    message: "Invalid path.",
    status: 404,
  },
  [APIErrorCodes.INVALID_REQUEST_BODY]: {
    name: "INVALID_REQUEST_BODY",
    message: "Invalid body.",
    status: 400,
  },
  [APIErrorCodes.INVALID_REQUEST_SLUG]: {
    name: "INVALID_REQUEST_SLUG",
    message: "The requested slug is unavailable.",
    status: 400,
  },
  [APIErrorCodes.INTERNAL_SERVER_ERROR]: {
    name: "INTERNAL_SERVER_ERROR",
    message: "Unexpected internal error.",
    status: 500,
  },
};
