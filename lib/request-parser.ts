/** A generic interface for a request. */
interface Request {
    body: string;
}

/** Key of the operation in the request's JSON. */
const requestOperationKey = "op";

/** Encapsulates functionality for parsing requests. */
class RequestParser {
  /** Please do not instantiate this static utility class. */
  private constructor() {}

  /**
   * Parse the operation to sign from the input event.
   */
  static parseOperationFromRequest(request: Request): string {
    const requestJSON = JSON.parse(request.body);
    const operationHex = requestJSON[requestOperationKey];
    if (operationHex === undefined) {
      throw new Error("Request did not contain an operation");
    }
  
    return operationHex;
  }
}

export default RequestParser;