import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { OrderStatus, Prisma, UserRole } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalOrders,
      pendingOrders,
      totalProducts,
      activeProducts,
      totalUsers,
      totalRevenue,
      todayOrders,
      todayRevenue,
      lowStockProducts,
    ] = await Promise.all([
      // Total orders
      this.prisma.order.count(),
      
      // Pending orders
      this.prisma.order.count({
        where: { status: OrderStatus.PENDING },
      }),
      
      // Total products
      this.prisma.product.count(),
      
      // Active products
      this.prisma.product.count({
        where: { isActive: true },
      }),
      
      // Total users
      this.prisma.user.count({
        where: { role: 'CUSTOMER' },
      }),
      
      // Total revenue
      this.prisma.order.aggregate({
        where: {
          paymentStatus: 'COMPLETED',
        },
        _sum: {
          total: true,
        },
      }),
      
      // Today's orders
      this.prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      
      // Today's revenue
      this.prisma.order.aggregate({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
          paymentStatus: 'COMPLETED',
        },
        _sum: {
          total: true,
        },
      }),
      
      // Low stock products (less than 10 units)
      this.prisma.inventory.count({
        where: {
          availableQuantity: {
            lt: 10,
          },
        },
      }),
    ]);

    // Recent orders
    const recentOrders = await this.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // Low stock alerts - get inventories below reorder level
    const lowStockAlerts = await this.prisma.$queryRaw`
      SELECT 
        i.id,
        i."productId",
        i."availableQuantity",
        i."reorderLevel",
        p.id as "product_id",
        p.name as "product_name",
        p.sku as "product_sku"
      FROM "Inventory" i
      JOIN "Product" p ON i."productId" = p.id
      WHERE i."availableQuantity" <= i."reorderLevel"
      ORDER BY i."availableQuantity" ASC
      LIMIT 5
    `;

    // Sales by category (last 30 days)
    const salesByCategory = await this.prisma.$queryRaw`
      SELECT 
        c.name as category,
        COUNT(DISTINCT o.id)::int as "orderCount",
        COALESCE(SUM(oi.total), 0)::decimal as revenue
      FROM "OrderItem" oi
      JOIN "Product" p ON oi."productId" = p.id
      JOIN "Category" c ON p."categoryId" = c.id
      JOIN "Order" o ON oi."orderId" = o.id
      WHERE o."createdAt" >= NOW() - INTERVAL '30 days'
        AND o."paymentStatus" = 'COMPLETED'
      GROUP BY c.id, c.name
      ORDER BY revenue DESC
    `;

    return {
      stats: {
        totalOrders,
        pendingOrders,
        totalProducts,
        activeProducts,
        totalUsers,
        totalRevenue: totalRevenue._sum.total || 0,
        todayOrders,
        todayRevenue: todayRevenue._sum.total || 0,
        lowStockProducts,
      },
      recentOrders,
      lowStockAlerts,
      salesByCategory,
    };
  }

  async getAllOrders(params: {
    skip?: number;
    take?: number;
    status?: OrderStatus;
    startDate?: Date;
    endDate?: Date;
    search?: string;
  }) {
    const { skip = 0, take = 10, status, startDate, endDate, search } = params;

    const where: Prisma.OrderWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: 'insensitive' } },
        {
          customer: {
            OR: [
              { email: { contains: search, mode: 'insensitive' } },
              { firstName: { contains: search, mode: 'insensitive' } },
              { lastName: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take,
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  requiresPrescription: true,
                },
              },
            },
          },
          prescription: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page: Math.floor(skip / take) + 1,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async getAllUsers(params: {
    skip?: number;
    take?: number;
    role?: string;
    isActive?: boolean;
    search?: string;
  }) {
    const { skip = 0, take = 10, role, isActive, search } = params;

    const where: Prisma.UserWhereInput = {};

    if (role) {
      where.role = role as UserRole;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        where,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          phoneNumber: true,
          isActive: true,
          createdAt: true,
          _count: {
            select: {
              orders: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page: Math.floor(skip / take) + 1,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    };
  }

  async updateUser(userId: string, data: { isActive?: boolean; role?: string }) {
    const updateData: Prisma.UserUpdateInput = {};
    
    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }
    
    if (data.role) {
      updateData.role = data.role as UserRole;
    }
    
    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });
  }
} 