import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus, PaymentStatus, Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const { items, ...orderData } = createOrderDto;

    // Calculate totals
    let subtotal = 0;
    const orderItems = [];

    // Validate products and calculate prices
    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
        include: { category: true },
      });

      if (!product || !product.isActive) {
        throw new BadRequestException(`Product ${item.productId} not found or inactive`);
      }

      const itemTotal = item.unitPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: 0,
        total: itemTotal,
        batchNumber: item.batchNumber,
      });
    }

    const tax = subtotal * 0.08; // 8% tax
    const shippingCost = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const total = subtotal + tax + shippingCost;

    // Create order with items
    const order = await this.prisma.order.create({
      data: {
        customerId: userId,
        status: OrderStatus.PENDING,
        subtotal,
        tax,
        discount: 0,
        shippingCost,
        total,
        shippingAddress: orderData.shippingAddress,
        billingAddress: orderData.billingAddress,
        paymentMethod: orderData.paymentMethod,
        paymentStatus: PaymentStatus.PENDING,
        notes: orderData.notes,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Update inventory
    for (const item of orderItems) {
      await this.updateInventory(item.productId, item.quantity);
    }

    return order;
  }

  async findAll(userId: string, role?: string) {
    const where: Prisma.OrderWhereInput = {};
    
    // Only show user's own orders unless admin
    if (role !== 'ADMIN') {
      where.customerId = userId;
    }

    const orders = await this.prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return orders;
  }

  async findOne(id: string, userId: string, role?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
              },
            },
          },
        },
        customer: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phoneNumber: true,
          },
        },
        prescription: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check authorization
    if (role !== 'ADMIN' && order.customerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return order;
  }

  async updateStatus(id: string, status: OrderStatus, role?: string) {
    if (role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can update order status');
    }

    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check if prescription is required
    const hasRxItems = order.items.some(item => item.product.requiresPrescription);
    if (hasRxItems && status === OrderStatus.PROCESSING) {
      // Check if order has a prescription
      const orderWithPrescription = await this.prisma.order.findUnique({
        where: { id },
        include: { prescription: true },
      });
      
      if (!orderWithPrescription?.prescription) {
        throw new BadRequestException('Prescription required before processing order');
      }
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: { 
        status,
        ...(status === OrderStatus.COMPLETED && { deliveredAt: new Date() }),
        ...(status === OrderStatus.PROCESSING && { shippedAt: new Date() }),
      },
    });

    // Send notifications, update tracking, etc.
    // This would be handled by a notification service in production

    return updatedOrder;
  }

  async addPrescription(orderId: string, userId: string, prescriptionData: any) {
    const order = await this.findOne(orderId, userId);

    // Check if order has prescription items
    const hasRxItems = order.items.some(item => item.product.requiresPrescription);
    if (!hasRxItems) {
      throw new BadRequestException('No prescription required for this order');
    }

    // Create prescription record
    const prescription = await this.prisma.prescription.create({
      data: {
        patientId: userId,
        orderId: orderId,
        doctorName: prescriptionData.doctorName,
        doctorLicense: prescriptionData.doctorLicense,
        clinicName: prescriptionData.clinicName,
        clinicContact: prescriptionData.clinicContact,
        prescribedDate: new Date(prescriptionData.prescribedDate),
        validUntil: new Date(prescriptionData.validUntil),
        diagnosis: prescriptionData.diagnosis,
        notes: prescriptionData.notes,
        documentUrl: prescriptionData.documentUrl, // This would be uploaded separately
        status: 'PENDING',
        items: {
          create: order.items
            .filter(item => item.product.requiresPrescription)
            .map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              dosage: prescriptionData.items?.find((p: any) => p.productId === item.productId)?.dosage || 'As directed',
              duration: prescriptionData.items?.find((p: any) => p.productId === item.productId)?.duration || 'As prescribed',
              instructions: prescriptionData.items?.find((p: any) => p.productId === item.productId)?.instructions,
              isSubstitutable: false,
            })),
        },
      },
    });

    // Update order status if in pending
    if (order.status === OrderStatus.PENDING) {
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.PROCESSING },
      });
    }

    return prescription;
  }

  private async updateInventory(productId: string, quantity: number) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId },
    });

    if (!inventory) {
      throw new BadRequestException('Inventory not found for product');
    }

    if (inventory.availableQuantity < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    await this.prisma.inventory.update({
      where: { productId },
      data: {
        availableQuantity: inventory.availableQuantity - quantity,
        reservedQuantity: inventory.reservedQuantity + quantity,
      },
    });

    // Create inventory movement record
    await this.prisma.inventoryMovement.create({
      data: {
        inventoryId: inventory.id,
        type: 'OUT',
        quantity: -quantity,
        previousQuantity: inventory.totalQuantity,
        newQuantity: inventory.totalQuantity - quantity,
        reason: 'Order placed',
        referenceType: 'ORDER',
        referenceId: productId,
      },
    });
  }
} 