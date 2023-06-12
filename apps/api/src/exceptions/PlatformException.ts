import { APIErrorCodes } from "./errors";
import { ErrorTypes } from "./index";

export class PlatformException extends Error {
  public status: number;
  public name: string;
  public message: string;

  constructor(errorCode: APIErrorCodes) {
    super(ErrorTypes.ERROR_TYPES_KNOWN[errorCode].message);
    this.status = ErrorTypes.ERROR_TYPES_KNOWN[errorCode].status;
    this.name = ErrorTypes.ERROR_TYPES_KNOWN[errorCode].name;
    this.message = ErrorTypes.ERROR_TYPES_KNOWN[errorCode].message;
  }
}
