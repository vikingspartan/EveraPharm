import { 
    IsString, 
    IsNumber, 
    IsOptional, 
    IsEnum, 
    IsBoolean, 
    IsArray,
    IsUUID,
    Min,
    Max,
    IsInt,
  } from 'class-validator'
  import { Type } from 'class-transformer'
  import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
  import { ProductDivision, ProductStatus } from '@everapharm/database'
  
  export class ProductQueryDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    search?: string
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    category?: string
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    subcategory?: string
  
    @ApiPropertyOptional({ enum: ProductDivision })
    @IsOptional()
    @IsEnum(ProductDivision)
    division?: ProductDivision
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    dosageForm?: string
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    manufacturer?: string
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    certifications?: string[]
  
    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minPrice?: number
  
    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maxPrice?: number
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    inStock?: boolean
  
    @ApiPropertyOptional({ enum: ProductStatus })
    @IsOptional()
    @IsEnum(ProductStatus)
    status?: ProductStatus
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    featured?: boolean
  
    @ApiPropertyOptional({ default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number
  
    @ApiPropertyOptional({ default: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number
  
    @ApiPropertyOptional({ enum: ['name', 'price', 'newest', 'popular'] })
    @IsOptional()
    @IsString()
    sortBy?: 'name' | 'price' | 'newest' | 'popular'
  
    @ApiPropertyOptional({ enum: ['asc', 'desc'] })
    @IsOptional()
    @IsString()
    sortOrder?: 'asc' | 'desc'
  }
  
  export class ProductPricingDto {
    @ApiProperty()
    @IsUUID()
    companyId: string
  
    @ApiProperty({ minimum: 1 })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    quantity: number
  
    @ApiPropertyOptional({ default: 'USD' })
    @IsOptional()
    @IsString()
    currency?: string
  }
  
  export class CreateProductDto {
    @ApiProperty()
    @IsString()
    sku: string
  
    @ApiProperty()
    @IsString()
    name: string
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    genericName?: string
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    brandName?: string
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    shortDescription?: string
  
    @ApiProperty()
    @IsUUID()
    categoryId: string
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    subcategoryId?: string
  
    @ApiProperty({ enum: ProductDivision })
    @IsEnum(ProductDivision)
    division: ProductDivision
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    dosageForm?: string
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    strength?: string
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    packSize?: string
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    packType?: string
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    indications?: string[]
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    contraindications?: string[]
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    sideEffects?: string[]
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    storageConditions?: string
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    manufacturer?: string
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    certifications?: string[]
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsArray()
    standards?: string[]
  
    @ApiProperty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    basePrice: number
  
    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    costPrice?: number
  
    @ApiPropertyOptional({ default: 0 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    stock?: number
  
    @ApiPropertyOptional({ default: 0 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(0)
    reorderLevel?: number
  
    @ApiPropertyOptional({ default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    moq?: number
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    leadTime?: string
  
    @ApiPropertyOptional({ enum: ProductStatus, default: ProductStatus.DRAFT })
    @IsOptional()
    @IsEnum(ProductStatus)
    status?: ProductStatus
  }
  
  export class UpdateProductDto extends CreateProductDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    sku?: string
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    name?: string
  
    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    categoryId?: string
  
    @ApiPropertyOptional({ enum: ProductDivision })
    @IsOptional()
    @IsEnum(ProductDivision)
    division?: ProductDivision
  
    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    basePrice?: number
  }