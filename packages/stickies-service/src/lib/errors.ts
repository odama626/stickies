export class BadRequestError extends Error {
  statusCode = 400;

  constructor(message = "Bad Request") {
    super(message);
    this.name = this.constructor.name;
  }
}


export class UnauthorizedError extends Error {
  statusCode = 401;

  constructor(message = "Unauthorized") {
    super(message);
    this.name = this.constructor.name;
  }
}
