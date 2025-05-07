import "reflect-metadata";
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class ColumnDefinitionDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsBoolean()
  @IsOptional()
  primary?: boolean;

  @IsBoolean()
  @IsOptional()
  unique?: boolean;

  @IsBoolean()
  @IsOptional()
  nullable?: boolean;

  @IsString()
  @IsOptional()
  default?: string;
}

export class TableDefinitionDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColumnDefinitionDto)
  columns!: ColumnDefinitionDto[];
}

export class TableCreationResultDto {
  success!: boolean;
  message?: string;
  error?: string;
}
