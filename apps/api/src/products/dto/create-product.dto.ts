import { IsString, IsNumber, IsBoolean, IsOptional, IsEnum, Min, IsUrl } from 'class-validator';
import { ProductType } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  genericName: string;

  @IsString()
  description: string;

  @IsString()
  manufacturer: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  categoryId: string;

  @IsBoolean()
  requiresPrescription: boolean;

  @IsEnum(ProductType)
  type: ProductType;

  @IsString()
  @IsOptional()
  dosageForm?: string;

  @IsString()
  @IsOptional()
  strength?: string;

  @IsString()
  @IsOptional()
  packSize?: string;

  @IsNumber()
  @Min(0)
  stockQuantity: number;

  @IsString()
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;
} 