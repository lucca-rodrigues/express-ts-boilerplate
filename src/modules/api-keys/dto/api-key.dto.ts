import "reflect-metadata";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsDateString,
  IsBoolean,
} from "class-validator";

export class ApiKeyDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: Date;
}

export class ApiKeyResponseDto extends ApiKeyDto {
  @IsUUID()
  id!: string;

  @IsString()
  @IsNotEmpty()
  apiKey!: string;

  @IsBoolean()
  isActive!: boolean;

  @IsUUID()
  workspaceId!: string;

  createdAt!: Date;
  updatedAt!: Date;
}
