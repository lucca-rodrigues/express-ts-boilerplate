import "reflect-metadata";
import { IsString, IsNotEmpty, IsIn } from "class-validator";

export class SqlQueryDto {
  @IsString()
  @IsNotEmpty()
  @IsIn(["postgres", "mysql"])
  databaseType!: string;

  @IsString()
  @IsNotEmpty()
  query!: string;
}

export class SqlQueryResultDto {
  success!: boolean;
  data?: Record<string, unknown>;
  message?: string;
  rowCount?: number;
  error?: string;
}
