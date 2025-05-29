import { 
    Controller, 
    Get, 
    Post,
    Param, 
    Query,
    Body,
    UseGuards,
  } from '@nestjs/common'
  import { 
    ApiTags, 
    ApiOperation, 
    ApiResponse,
    ApiBearerAuth,
  } from '@nestjs/swagger'
  import { ProductsService } from './products.service'
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
  import { Public } from '../auth/decorators'
  import { ProductQueryDto, ProductPricingDto } from './dto'
  
  @ApiTags('products')
  @Controller('products')
  export class ProductsController {
    constructor(private productsService: ProductsService) {}
  
    @Get()
    @Public()
    @ApiOperation({ summary: 'Get all products with filtering and pagination' })
    @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
    async findAll(@Query() query: ProductQueryDto) {
      return this.productsService.findAll(query)
    }
  
    @Get('featured')
    @Public()
    @ApiOperation({ summary: 'Get featured products' })
    @ApiResponse({ status: 200, description: 'Featured products retrieved' })
    async getFeatured(@Query('limit') limit?: number) {
      return this.productsService.getFeatured(limit)
    }
  
    @Get('new')
    @Public()
    @ApiOperation({ summary: 'Get new products' })
    @ApiResponse({ status: 200, description: 'New products retrieved' })
    async getNewProducts(@Query('limit') limit?: number) {
      return this.productsService.getNewProducts(limit)
    }
  
    @Get('best-sellers')
    @Public()
    @ApiOperation({ summary: 'Get best selling products' })
    @ApiResponse({ status: 200, description: 'Best sellers retrieved' })
    async getBestSellers(@Query('limit') limit?: number) {
      return this.productsService.getBestSellers(limit)
    }
  
    @Get(':id')
    @Public()
    @ApiOperation({ summary: 'Get product by ID' })
    @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async findOne(@Param('id') id: string) {
      return this.productsService.findOne(id)
    }
  
    @Get('slug/:slug')
    @Public()
    @ApiOperation({ summary: 'Get product by slug' })
    @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Product not found' })
    async findBySlug(@Param('slug') slug: string) {
      return this.productsService.findBySlug(slug)
    }
  
    @Post(':id/pricing')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Calculate product pricing for a company' })
    @ApiResponse({ status: 200, description: 'Pricing calculated successfully' })
    async calculatePricing(
      @Param('id') id: string,
      @Body() dto: ProductPricingDto,
    ) {
      return this.productsService.calculatePricing(id, dto)
    }
  }