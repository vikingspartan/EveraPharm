import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, EXPIRY_WARNING_DAYS } from './constants';

// Pagination utilities
export function getPaginationParams(page?: number, limit?: number) {
  const currentPage = Math.max(1, page || 1);
  const pageSize = Math.min(Math.max(1, limit || DEFAULT_PAGE_SIZE), MAX_PAGE_SIZE);
  const skip = (currentPage - 1) * pageSize;
  
  return {
    skip,
    take: pageSize,
    page: currentPage,
    limit: pageSize
  };
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

// Date utilities
export function isExpiringSoon(expiryDate: Date): boolean {
  const warningDate = new Date();
  warningDate.setDate(warningDate.getDate() + EXPIRY_WARNING_DAYS);
  return expiryDate <= warningDate;
}

export function isExpired(expiryDate: Date): boolean {
  return expiryDate <= new Date();
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Stock utilities
export function calculateStockLevel(currentQuantity: number, reorderLevel: number): 'critical' | 'low' | 'normal' {
  const percentage = (currentQuantity / reorderLevel) * 100;
  
  if (percentage <= 10) return 'critical';
  if (percentage <= 20) return 'low';
  return 'normal';
}

export function isLowStock(currentQuantity: number, reorderLevel: number): boolean {
  return currentQuantity <= reorderLevel;
}

// Price calculation utilities
export function calculateOrderTotal(
  items: Array<{ quantity: number; unitPrice: number; discount?: number }>,
  taxRate: number = 0.08,
  shippingCost: number = 0,
  orderDiscount: number = 0
): {
  subtotal: number;
  tax: number;
  discount: number;
  shippingCost: number;
  total: number;
} {
  const subtotal = items.reduce((sum, item) => {
    const itemTotal = item.quantity * item.unitPrice;
    const itemDiscount = item.discount || 0;
    return sum + (itemTotal - itemDiscount);
  }, 0);
  
  const discountedSubtotal = subtotal - orderDiscount;
  const tax = discountedSubtotal * taxRate;
  const total = discountedSubtotal + tax + shippingCost;
  
  return {
    subtotal,
    tax,
    discount: orderDiscount,
    shippingCost,
    total
  };
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

export function isValidSKU(sku: string): boolean {
  const skuRegex = /^[A-Z0-9\-]+$/i;
  return skuRegex.test(sku) && sku.length >= 3;
}

// String utilities
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `ORD-${timestamp}-${random}`.toUpperCase();
}

export function generatePrescriptionNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `RX-${timestamp}-${random}`.toUpperCase();
}

export function generateBatchNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().substr(2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.random().toString(36).substr(2, 4);
  return `B${year}${month}-${random}`.toUpperCase();
}

// Search utilities
export function createSearchQuery(query: string): object {
  if (!query || query.trim() === '') return {};
  
  const searchTerms = query.trim().toLowerCase().split(/\s+/);
  
  return {
    OR: [
      { name: { contains: query, mode: 'insensitive' } },
      { genericName: { contains: query, mode: 'insensitive' } },
      { description: { contains: query, mode: 'insensitive' } },
      { sku: { contains: query, mode: 'insensitive' } },
      { manufacturer: { contains: query, mode: 'insensitive' } }
    ]
  };
}

// Error handling utilities
export function formatPrismaError(error: any): { code: string; message: string; field?: string } {
  if (error.code === 'P2002') {
    const field = error.meta?.target?.[0];
    return {
      code: 'DUPLICATE_ENTRY',
      message: `A record with this ${field} already exists`,
      field
    };
  }
  
  if (error.code === 'P2025') {
    return {
      code: 'NOT_FOUND',
      message: 'Record not found'
    };
  }
  
  if (error.code === 'P2003') {
    const field = error.meta?.field_name;
    return {
      code: 'INVALID_REFERENCE',
      message: `Invalid reference for ${field}`,
      field
    };
  }
  
  return {
    code: 'DATABASE_ERROR',
    message: error.message || 'An unexpected database error occurred'
  };
}

// Sanitization utilities
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function sanitizePhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

// Formatting utilities
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
} 