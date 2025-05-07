import "reflect-metadata";
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, ValidateNested } from "class-validator";

export class UserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
