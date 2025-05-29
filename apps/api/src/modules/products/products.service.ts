import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../database/prisma.service'
import { CacheService } from '../cache/cache.service'
import { SearchService } from '../search/search.service'
import {
  Product,
  ProductWithRelations,
  ProductSearchParams,
  ProductSearchResult,
  getPaginationParams,
  getPaginationMeta,
  buildSearchConditions,
  calculatePrice,
  generateSlug,
  generateUniqueSlug,
  isLowStock,
  isOutOfStock,
  DB_CONSTANTS,
} from '@everapharm/database'
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
  ProductPricingDto,
} from './dto'

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private cacheService: CacheService,
    private searchService: SearchService,
    private configService: ConfigService,
  ) {}

  async findAll(query: ProductQueryDto): Promise<ProductSearchResult> {
    const cacheKey = `products:${JSON.stringify(query)}`
    const cached = await this.cacheService.get<ProductSearchResult>(cacheKey)
    
    if (cached) {
      return cached
    }

    const { skip, take, page, limit } = getPaginationParams({
      page: query.page,
      limit: query.limit,
    })

    // Build where conditions
    const where: Prisma.ProductWhereInput = {
      status: query.status || 'ACTIVE',
      ...(query.category && { category: { slug: query.category } }),
      ...(query.subcategory && { subcategory: { slug: query.subcategory } }),
      ...(query.division && { division: query.division }),
      ...(query.dosageForm && { dosageForm: query.dosageForm }),
      ...(query.manufacturer && { manufacturer: query.manufacturer }),
      ...(query.featured !== undefined && { featured: query.featured }),
      ...(query.inStock !== undefined && { stock: query.inStock ? { gt: 0 } : 0 }),
      ...(query.minPrice && { basePrice: { gte: query.minPrice } }),
      ...(query.maxPrice && { basePrice: { lte: query.maxPrice } }),
    }

    // Add search conditions if query provided
    if (query.search) {
      const searchConditions = buildSearchConditions(query.search, [
        'name',
        'genericName',
        'brandName',
        'description',
      ])
      where.AND = [searchConditions]
    }

    // Add certifications filter
    if (query.certifications?.length) {
      where.certifications = {
        hasSome: query.certifications,
      }
    }

    // Determine sort order
    const orderBy: Prisma.ProductOrderByWithRelationInput = 
      query.sortBy === 'name' ? { name: query.sortOrder || 'asc' } :
      query.sortBy === 'price' ? { basePrice: query.sortOrder || 'asc' } :
      query.sortBy === 'newest' ? { createdAt: 'desc' } :
      query.sortBy === 'popular' ? { orderCount: 'desc' } :
      { createdAt: 'desc' }

    // Execute queries
    const [products, totalCount] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          category: {
            select: { id: true, name: true, slug: true },
          },
          subcategory: {
            select: { id: true, name: true, slug: true },
          },
          images: {
            orderBy: { displayOrder: 'asc' },
            take: 1,
          },
          documents: {
            select: { id: true, name: true, type: true, url: true },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ])

    // Get facets for filtering
    const facets = await this.getFacets(where)

    const result: ProductSearchResult = {
      products: products as ProductWithRelations[],
      totalCount,
      ...getPaginationMeta(totalCount, { page, limit, skip, take }),
      facets,
    }

    // Cache the result
    await this.cacheService.set(
      cacheKey,
      result,
      this.configService.get('cache.ttl.products'),
    )

    return result
  }

  async findOne(id: string): Promise<ProductWithRelations> {
    const cacheKey = `product:${id}`
    const cached = await this.cacheService.get<ProductWithRelations>(cacheKey)
    
    if (cached) {
      return cached
    }

    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        subcategory: {
          select: { id: true, name: true, slug: true },
        },
        images: {
          orderBy: { displayOrder: 'asc' },
        },
        documents: true,
        relatedProducts: {
          take: 5,
          include: {
            images: {
              take: 1,
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
        reviews: {
          where: { isApproved: true },
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: {
            company: {
              select: { name: true },
            },
          },
        },
      },
    })

    if (!product) {
      throw new NotFoundException('Product not found')
    }

    // Increment view count
    await this.prisma.product.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    })

    // Cache the result
    await this.cacheService.set(
      cacheKey,
      product,
      this.configService.get('cache.ttl.products'),
    )

    return product as ProductWithRelations
  }

  async findBySlug(slug: string): Promise<ProductWithRelations> {
    const cacheKey = `product:slug:${slug}`
    const cached = await this.cacheService.get<ProductWithRelations>(cacheKey)
    
    if (cached) {
      return cached
    }

    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: {
          select: { id: true, name: true, slug: true },
        },
        subcategory: {
          select: { id: true, name: true, slug: true },
        },
        images: {
          orderBy: { displayOrder: 'asc' },
        },
        documents: true,
        relatedProducts: {
          take: 5,
          include: {
            images: {
              take: 1,
              orderBy: { displayOrder: 'asc' },
            },
          },
        },
      },
    })

    if (!product) {
      throw new NotFoundException('Product not found')
    }

    // Increment view count
    await this.prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    })

    // Cache the result
    await this.cacheService.set(
      cacheKey,
      product,
      this.configService.get('cache.ttl.products'),
    )

    return product as ProductWithRelations
  }

  async calculatePricing(productId: string, dto: ProductPricingDto) {
    const { companyId, quantity, currency } = dto

    const [product, company] = await Promise.all([
      this.prisma.product.findUnique({ where: { id: productId } }),
      this.prisma.company.findUnique({ 
        where: { id: companyId },
        include: {
          pricingRules: {
            where: { isActive: true },
          },
          specialDiscounts: {
            where: { 
              isActive: true,
              validFrom: { lte: new Date() },
              validUntil: { gte: new Date() },
            },
          },
        },
      }),
    ])

    if (!product) {
      throw new NotFoundException('Product not found')
    }

    if (!company) {
      throw new NotFoundException('Company not found')
    }

    const pricing = calculatePrice({
      product,
      company,
      quantity,
      currency,
    })

    return pricing
  }

  async getFeatured(limit: number = 10): Promise<Product[]> {
    const cacheKey = `products:featured:${limit}`
    const cached = await this.cacheService.get<Product[]>(cacheKey)
    
    if (cached) {
      return cached
    }

    const products = await this.prisma.product.findMany({
      where: {
        featured: true,
        status: 'ACTIVE',
      },
      take: limit,
      orderBy: { orderCount: 'desc' },
      include: {
        images: {
          take: 1,
          orderBy: { displayOrder: 'asc' },
        },
      },
    })

    await this.cacheService.set(
      cacheKey,
      products,
      this.configService.get('cache.ttl.products'),
    )

    return products
  }

  async getNewProducts(limit: number = 10): Promise<Product[]> {
    const cacheKey = `products:new:${limit}`
    const cached = await this.cacheService.get<Product[]>(cacheKey)
    
    if (cached) {
      return cached
    }

    const products = await this.prisma.product.findMany({
      where: {
        isNew: true,
        status: 'ACTIVE',
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        images: {
          take: 1,
          orderBy: { displayOrder: 'asc' },
        },
      },
    })

    await this.cacheService.set(
      cacheKey,
      products,
      this.configService.get('cache.ttl.products'),
    )

    return products
  }

  async getBestSellers(limit: number = 10): Promise<Product[]> {
    const cacheKey = `products:bestsellers:${limit}`
    const cached = await this.cacheService.get<Product[]>(cacheKey)
    
    if (cached) {
      return cached
    }

    const products = await this.prisma.product.findMany({
      where: {
        bestSeller: true,
        status: 'ACTIVE',
      },
      take: limit,
      orderBy: { orderCount: 'desc' },
      include: {
        images: {
          take: 1,
          orderBy: { displayOrder: 'asc' },
        },
      },
    })

    await this.cacheService.set(
      cacheKey,
      products,
      this.configService.get('cache.ttl.products'),
    )

    return products
  }

  private async getFacets(where: Prisma.ProductWhereInput) {
    const [
      categories,
      dosageForms,
      manufacturers,
      certifications,
      priceStats,
    ] = await Promise.all([
      // Categories facet
      this.prisma.product.groupBy({
        by: ['categoryId'],
        where,
        _count: true,
      }),
      // Dosage forms facet
      this.prisma.product.groupBy({
        by: ['dosageForm'],
        where: { ...where, dosageForm: { not: null } },
        _count: true,
      }),
      // Manufacturers facet
      this.prisma.product.groupBy({
        by: ['manufacturer'],
        where: { ...where, manufacturer: { not: null } },
        _count: true,
      }),
      // Certifications (this is tricky with array fields)
      this.prisma.$queryRaw<Array<{ certification: string; count: number }>>`
        SELECT UNNEST(certifications) as certification, COUNT(*) as count
        FROM "Product"
        WHERE status = 'ACTIVE'
        GROUP BY certification
        ORDER BY count DESC
      `,
      // Price ranges
      this.prisma.product.aggregate({
        where,
        _min: { basePrice: true },
        _max: { basePrice: true },
      }),
    ])

    // Get category names
    const categoryIds = categories.map(c => c.categoryId)
    const categoryData = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true },
    })
    const categoryMap = new Map(categoryData.map(c => [c.id, c.name]))

    // Build price ranges
    const minPrice = Number(priceStats._min.basePrice) || 0
    const maxPrice = Number(priceStats._max.basePrice) || 1000
    const priceRange = maxPrice - minPrice
    const priceRanges = [
      { min: 0, max: 50, count: 0 },
      { min: 50, max: 100, count: 0 },
      { min: 100, max: 250, count: 0 },
      { min: 250, max: 500, count: 0 },
      { min: 500, max: 1000, count: 0 },
      { min: 1000, max: maxPrice, count: 0 },
    ]

    return {
      categories: categories.map(c => ({
        value: categoryMap.get(c.categoryId) || c.categoryId,
        count: c._count,
      })),
      dosageForms: dosageForms
        .filter(d => d.dosageForm)
        .map(d => ({
          value: d.dosageForm!,
          count: d._count,
        })),
      manufacturers: manufacturers
        .filter(m => m.manufacturer)
        .map(m => ({
          value: m.manufacturer!,
          count: m._count,
        })),
      certifications: certifications.map(c => ({
        value: c.certification,
        count: Number(c.count),
      })),
      priceRanges,
    }
  }

  // Admin methods would go here (create, update, delete)
  // These would be in a separate admin products service in production
}