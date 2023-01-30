export class ResponseError extends Error {
  public response: Response;

  public message: string;

  constructor(response: Response, message: string) {
    super(response.statusText);
    this.response = response;
    this.message = message;
    Object.setPrototypeOf(this, ResponseError.prototype);
  }
}
