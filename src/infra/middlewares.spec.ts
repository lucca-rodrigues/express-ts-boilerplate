import { Request, Response } from "express";
import { validator } from "./middlewares";
import { IsString, IsNotEmpty } from "class-validator";
import * as classTransformer from "class-transformer";

class TestDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}

describe("validator middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it("should pass validation with valid data", async () => {
    mockRequest.body = { name: "Test Name" };

    await validator(TestDto)(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it("should return 400 with validation errors for invalid data", async () => {
    mockRequest.body = { name: "" };

    await validator(TestDto)(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            property: "name",
            constraints: expect.objectContaining({
              isNotEmpty: expect.any(String),
            }),
          }),
        ]),
      })
    );
  });

  it("should handle unexpected errors", async () => {
    const error = new Error("Unexpected error");
    jest.spyOn(classTransformer, "plainToClass").mockImplementation(() => {
      throw error;
    });

    await validator(TestDto)(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(error);
  });
});
