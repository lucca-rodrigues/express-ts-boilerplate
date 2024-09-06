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

class AddressDto {
  @IsString()
  @IsNotEmpty()
  line_1!: string;

  @IsString()
  @IsOptional()
  line_2?: string;

  @IsString()
  @IsNotEmpty()
  zip_code!: string;

  @IsString()
  @IsNotEmpty()
  city!: string;

  @IsString()
  @IsNotEmpty()
  state!: string;

  @IsString()
  @IsNotEmpty()
  country!: string;
}

class PhoneDto {
  @IsString()
  @IsNotEmpty()
  country_code!: string;

  @IsString()
  @IsNotEmpty()
  area_code!: string;

  @IsString()
  @IsNotEmpty()
  number!: string;
}

class PhonesDto {
  @ValidateNested()
  @Type(() => PhoneDto)
  @IsOptional()
  home_phone?: PhoneDto;

  @ValidateNested()
  @Type(() => PhoneDto)
  @IsOptional()
  mobile_phone?: PhoneDto;
}

class MetadataDto {
  @IsString()
  @IsOptional()
  company?: string;
}

export class CreateCustomerDto {
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

  @ValidateNested()
  @Type(() => AddressDto)
  @IsNotEmpty()
  address!: AddressDto;

  @IsDateString()
  @IsNotEmpty()
  birthdate!: string;

  @ValidateNested()
  @Type(() => PhonesDto)
  @IsNotEmpty()
  phones!: PhonesDto;

  @ValidateNested()
  @Type(() => MetadataDto)
  @IsOptional()
  metadata?: MetadataDto;
}
