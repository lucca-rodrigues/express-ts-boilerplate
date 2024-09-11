import { ErrorHandler } from "./errorHandlers";

describe("ErrorHandler", () => {
  it("should return a 401 Unauthorized error", () => {
    const error = ErrorHandler.Unauthorized("Unauthorized access");
    expect(error.status).toBe(401);
    expect(error.message).toBe("Unauthorized access");
  });

  it("should return a 404 Not Found error", () => {
    const error = ErrorHandler.NotFound("Resource not found");
    expect(error.status).toBe(404);
    expect(error.message).toBe("Resource not found");
  });

  it("should return a 400 Bad Request error", () => {
    const error = ErrorHandler.BadRequest("Invalid request");
    expect(error.status).toBe(400);
    expect(error.message).toBe("Invalid request");
  });

  it("should return a 500 Internal Server Error", () => {
    const error = ErrorHandler.InternalServerError(
      new Error("Something went wrong")
    );
    expect(error.status).toBe(500);
    expect(error.message).toBe("Something went wrong");
  });

  it("should return a generic 500 Internal Server Error", () => {
    const error = ErrorHandler.InternalServerError("Internal Server Error");
    expect(error.status).toBe(500);
    expect(error.message).toBe("Internal Server Error");
  });

  it("should create an Unauthorized error", () => {
    const error = ErrorHandler.Unauthorized("Custom unauthorized message");
    expect(error.status).toBe(401);
    expect(error.message).toBe("Custom unauthorized message");
  });

  it("should create a NotFound error", () => {
    const error = ErrorHandler.NotFound("Custom not found message");
    expect(error.status).toBe(404);
    expect(error.message).toBe("Custom not found message");
  });

  it("should create a BadRequest error", () => {
    const error = ErrorHandler.BadRequest("Custom bad request message");
    expect(error.status).toBe(400);
    expect(error.message).toBe("Custom bad request message");
  });

  it("should create an InternalServerError with custom message", () => {
    const error = ErrorHandler.InternalServerError(new Error("Custom error"));
    expect(error.status).toBe(500);
    expect(error.message).toBe("Custom error");
  });

  it("should create an InternalServerError with default message", () => {
    const error = ErrorHandler.InternalServerError("Unknown error");
    expect(error.status).toBe(500);
    expect(error.message).toBe("Internal Server Error");
  });
});
