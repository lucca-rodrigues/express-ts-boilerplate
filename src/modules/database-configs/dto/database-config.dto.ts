import "reflect-metadata";
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  IsUUID,
} from "class-validator";
import { DatabaseType } from "modules/database-configs/entity/DatabaseConfig.entity";

export class DatabaseConfigDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEnum(DatabaseType)
  @IsNotEmpty()
  databaseType!: DatabaseType;

  @IsString()
  @IsNotEmpty()
  host!: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  port!: number;

  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsString()
  @IsNotEmpty()
  database!: string;

  @IsString()
  @IsOptional()
  connectionString?: string;
}

export class DatabaseConfigResponseDto extends DatabaseConfigDto {
  @IsUUID()
  id!: string;

  @IsUUID()
  workspaceId!: string;

  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}
