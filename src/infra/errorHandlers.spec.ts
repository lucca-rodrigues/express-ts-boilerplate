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
});
