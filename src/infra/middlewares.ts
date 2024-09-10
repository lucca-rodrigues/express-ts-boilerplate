import { Request, Response } from "express";
import { plainToClass } from "class-transformer";
import { validate, ValidatorOptions } from "class-validator";

export function validator(dto: any) {
  return async (req: Request, res: Response, next: any) => {
    try {
      const data = plainToClass(dto, req.body);
      const errors = await validate(data, {
        validationError: { target: false, value: true },
      } as ValidatorOptions);

      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      req.body = data;
      next();
    } catch (error) {
      next(error);
    }
  };
}
