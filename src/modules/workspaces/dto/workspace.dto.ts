import "reflect-metadata";
import { IsString, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class WorkspaceDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class WorkspaceResponseDto extends WorkspaceDto {
  @IsUUID()
  id!: string;

  @IsUUID()
  ownerId!: string;

  isActive!: boolean;
  createdAt!: Date;
  updatedAt!: Date;
}
