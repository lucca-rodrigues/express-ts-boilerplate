import "reflect-metadata";
import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

enum CustomerType {
  INDIVIDUAL = "individual",
  COMPANY = "company",
}

enum DocumentType {
  CPF = "CPF",
  CNPJ = "CNPJ",
}

enum Gender {
  MALE = "male",
  FEMALE = "female",
}

export class UserDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  code!: string;

  @IsString()
  @IsNotEmpty()
  document!: string;

  @IsEnum(CustomerType)
  @IsNotEmpty()
  type!: CustomerType;

  @IsEnum(DocumentType)
  @IsNotEmpty()
  document_type!: DocumentType;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender!: Gender;
}
