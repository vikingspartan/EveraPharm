import { z } from 'zod'
import type { 
  Company, 
  User, 
  Product, 
  Order, 
  Quote,
  CompanyType,
  UserRole,
  DistributorTier,
  ProductDivision,
  ProductStatus,
  OrderStatus,
  PaymentStatus,
  PaymentMethod
} from '@prisma/client'

// ==================== USER & AUTH TYPES ====================

export interface UserWithCompany extends User {
  company: Company | null
}

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  companyId?: string
  permissions: string[]
}

export const PermissionSchema = z.enum([
  // Product permissions
  'products.view',
  'products.create',
  'products.update',
  'products.delete',
  'products.manage_pricing',
  
  // Order permissions
  'orders.view',
  'orders.create',
  'orders.update',
  'orders.approve',
  'orders.cancel',
  'orders.ship',
  
  // Quote permissions
  'quotes.view',
  'quotes.create',
  'quotes.update',
  'quotes.delete',
  'quotes.convert',
  
  // Company permissions
  'companies.view',
  'companies.create',
  'companies.update',
  'companies.delete',
  'companies.approve',
  
  // User permissions
  'users.view',
  'users.create',
  'users.update',
  'users.delete',
  'users.manage_roles',
  
  // Document permissions
  'documents.view',
  'documents.upload',
  'documents.delete',
  
  // Report permissions
  'reports.view',
  'reports.export',
  
  // Settings permissions
  'settings.view',
  'settings.update',
  
  // Audit permissions
  'audit.view',
])

export type Permission = z.infer<typeof PermissionSchema>

// Role-based default permissions
export const rolePermissions: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: PermissionSchema.options,
  ADMIN: PermissionSchema.options.filter(p => !p.startsWith('users.manage_roles')),
  SALES: [
    'products.view',
    'orders.view',
    'orders.create',
    'orders.update',
    'quotes.view',
    'quotes.create',
    'quotes.update',
    'companies.view',
    'companies.update',
    'documents.view',
  ],
  SUPPORT: [
    'products.view',
    'orders.view',
    'quotes.view',
    'companies.view',
    'documents.view',
  ],
  WAREHOUSE: [
    'products.view',
    'products.update',
    'orders.view',
    'orders.update',
    'orders.ship',
  ],
  FINANCE: [
    'orders.view',
    'quotes.view',
    'companies.view',
    'reports.view',
    'reports.export',
  ],
  DISTRIBUTOR_ADMIN: [
    'products.view',
    'orders.view',
    'orders.create',
    'quotes.view',
    'quotes.create',
    'documents.view',
    'documents.upload',
    'users.view',
    'users.create',
    'users.update',
  ],
  DISTRIBUTOR_USER: [
    'products.view',
    'orders.view',
    'orders.create',
    'quotes.view',
    'quotes.create',
    'documents.view',
  ],
}

// ==================== PRICING TYPES ====================

export interface PricingCalculationParams {
  product: Product
  company: Company
  quantity: number
  currency?: string
}

export interface PricingCalculationResult {
  basePrice: number
  volumeDiscount: number
  volumeDiscountPercentage: number
  tierDiscount: number
  tierDiscountPercentage: number
  specialDiscount: number
  specialDiscountPercentage: number
  subtotal: number
  finalPrice: number
  unitPrice: number
  totalSavings: number
  savingsPercentage: number
}

export interface VolumeDiscountTier {
  minQuantity: number
  maxQuantity?: number
  discountPercentage: number
}

export const volumeDiscountTiers: VolumeDiscountTier[] = [
  { minQuantity: 100, maxQuantity: 499, discountPercentage: 5 },
  { minQuantity: 500, maxQuantity: 999, discountPercentage: 10 },
  { minQuantity: 1000, maxQuantity: 4999, discountPercentage: 15 },
  { minQuantity: 5000, discountPercentage: 20 },
]

export const tierDiscounts: Record<DistributorTier, number> = {
  BRONZE: 10,
  SILVER: 15,
  GOLD: 20,
  PLATINUM: 25,
}

// ==================== PRODUCT TYPES ====================

export interface ProductWithRelations extends Product {
  category: {
    id: string
    name: string
    slug: string
  }
  subcategory?: {
    id: string
    name: string
    slug: string
  } | null
  images: Array<{
    id: string
    url: string
    alt: string | null
    displayOrder: number
  }>
  documents: Array<{
    id: string
    name: string
    type: string
    url: string
  }>
}

export interface ProductSearchParams {
  query?: string
  category?: string
  subcategory?: string
  division?: ProductDivision
  dosageForm?: string
  manufacturer?: string
  certifications?: string[]
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  status?: ProductStatus
  featured?: boolean
  page?: number
  limit?: number
  sortBy?: 'name' | 'price' | 'newest' | 'popular'
  sortOrder?: 'asc' | 'desc'
}

export interface ProductSearchResult {
  products: ProductWithRelations[]
  totalCount: number
  page: number
  totalPages: number
  facets: {
    categories: Array<{ value: string; count: number }>
    dosageForms: Array<{ value: string; count: number }>
    manufacturers: Array<{ value: string; count: number }>
    certifications: Array<{ value: string; count: number }>
    priceRanges: Array<{ min: number; max: number; count: number }>
  }
}

// ==================== ORDER TYPES ====================

export interface OrderWithRelations extends Order {
  company: Company
  user: User
  items: Array<{
    id: string
    product: Product
    quantity: number
    unitPrice: number
    discount: number
    tax: number
    totalPrice: number
  }>
  documents: Array<{
    id: string
    type: string
    url: string
  }>
}

export interface CreateOrderDto {
  companyId: string
  userId: string
  items: Array<{
    productId: string
    quantity: number
  }>
  shippingAddress: {
    addressLine1: string
    addressLine2?: string
    city: string
    state?: string
    country: string
    postalCode: string
  }
  billingAddress?: {
    addressLine1: string
    addressLine2?: string
    city: string
    state?: string
    country: string
    postalCode: string
  }
  paymentMethod: PaymentMethod
  notes?: string
}

// ==================== QUOTE TYPES ====================

export interface QuoteWithRelations extends Quote {
  company: Company
  user: User
  items: Array<{
    id: string
    product: Product
    quantity: number
    unitPrice: number
    discount: number
    totalPrice: number
  }>
}

export interface CreateQuoteDto {
  companyId: string
  userId: string
  items: Array<{
    productId: string
    quantity: number
  }>
  validDays?: number
  notes?: string
}

// ==================== ANALYTICS TYPES ====================

export interface DashboardStats {
  revenue: {
    total: number
    growth: number
    chart: Array<{ date: string; value: number }>
  }
  orders: {
    total: number
    pending: number
    processing: number
    completed: number
    growth: number
    chart: Array<{ date: string; value: number }>
  }
  products: {
    total: number
    active: number
    lowStock: number
    outOfStock: number
  }
  customers: {
    total: number
    active: number
    new: number
    growth: number
  }
}

export interface SalesAnalytics {
  periodSales: Array<{
    date: string
    revenue: number
    orders: number
    units: number
  }>
  topProducts: Array<{
    product: Product
    revenue: number
    units: number
  }>
  topCustomers: Array<{
    company: Company
    revenue: number
    orders: number
  }>
  salesByCategory: Array<{
    category: string
    revenue: number
    percentage: number
  }>
  salesByRegion: Array<{
    country: string
    revenue: number
    orders: number
  }>
}