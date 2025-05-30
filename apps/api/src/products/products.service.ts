import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryProductsDto) {
    const {
      page = 1,
      limit = 20,
      search,
      category,
      requiresPrescription,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minPrice,
      maxPrice,
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { genericName: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(category && { category: { name: category } }),
      ...(requiresPrescription !== undefined && { requiresPrescription }),
      ...(minPrice !== undefined && { price: { gte: minPrice } }),
      ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          category: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        batches: {
          where: {
            expiryDate: { gt: new Date() },
            remainingQuantity: { gt: 0 },
          },
          orderBy: { expiryDate: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Get inventory info
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId: id },
    });

    return {
      ...product,
      inventory,
    };
  }

  async create(createProductDto: CreateProductDto) {
    const { stockQuantity, ...productData } = createProductDto;

    // Generate SKU if not provided
    const sku = await this.generateSku(productData.name);

    const product = await this.prisma.product.create({
      data: {
        ...productData,
        sku,
        costPrice: productData.price * 0.7, // Default cost price to 70% of selling price
        activeIngredients: [],
        images: productData.imageUrl ? [productData.imageUrl] : [],
      },
      include: {
        category: true,
      },
    });

    // Create initial inventory record
    await this.prisma.inventory.create({
      data: {
        productId: product.id,
        totalQuantity: stockQuantity,
        availableQuantity: stockQuantity,
        reservedQuantity: 0,
        reorderLevel: Math.floor(stockQuantity * 0.2), // 20% of initial stock
        reorderQuantity: stockQuantity,
      },
    });

    return this.findOne(product.id);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    const { stockQuantity, imageUrl, ...productData } = updateProductDto;

    const updateData: any = { ...productData };
    
    // Handle imageUrl update
    if (imageUrl !== undefined) {
      const existingProduct = await this.prisma.product.findUnique({
        where: { id },
        select: { images: true },
      });
      
      updateData.images = imageUrl ? [imageUrl] : existingProduct?.images || [];
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    // Update inventory if stockQuantity is provided
    if (stockQuantity !== undefined) {
      const inventory = await this.prisma.inventory.findUnique({
        where: { productId: id },
      });

      if (inventory) {
        await this.prisma.inventory.update({
          where: { id: inventory.id },
          data: { 
            totalQuantity: stockQuantity,
            availableQuantity: stockQuantity - inventory.reservedQuantity,
          },
        });
      }
    }

    return this.findOne(updatedProduct.id);
  }

  async search(query: string) {
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { genericName: { contains: query, mode: 'insensitive' } },
          { manufacturer: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 10,
      include: {
        category: true,
      },
    });

    return products;
  }

  async remove(id: string) {
    await this.findOne(id);

    // Soft delete by setting isActive to false
    return this.prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  private async generateSku(productName: string): Promise<string> {
    const prefix = productName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 3);
    
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const sku = `${prefix}-${random}`;
    
    // Check if SKU exists
    const exists = await this.prisma.product.findUnique({
      where: { sku },
    });
    
    if (exists) {
      return this.generateSku(productName);
    }
    
    return sku;
  }
} 