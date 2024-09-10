import createError from "http-errors";

export const ErrorHandler = {
  Unauthorized: (message: string = "Unauthorized") => createError(401, message),
  NotFound: (message: string = "Not Found") => createError(404, message),
  BadRequest: (message: string = "Bad Request") => createError(400, message),
  InternalServerError: (error: unknown) => {
    const message =
      error instanceof Error ? error.message : "Internal Server Error";
    return createError(500, message);
  },
};
