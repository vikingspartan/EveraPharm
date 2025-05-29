import bcrypt from 'bcryptjs'
import { 
  Company, 
  Product, 
  DistributorTier,
  type PricingCalculationParams,
  type PricingCalculationResult,
  volumeDiscountTiers,
  tierDiscounts,
  DB_CONSTANTS
} from './index'

// ==================== PRICING UTILITIES ====================

export function calculatePrice(params: PricingCalculationParams): PricingCalculationResult {
  const { product, company, quantity, currency = 'USD' } = params
  
  // Start with base price
  let basePrice = Number(product.basePrice)
  
  // Apply currency conversion if needed
  if (currency !== product.currency) {
    // In real implementation, this would fetch from exchange rate API
    basePrice *= 1.0 // Placeholder for exchange rate
    basePrice *= (1 + DB_CONSTANTS.CURRENCY_CONVERSION_MARKUP) // Add markup
  }
  
  // Calculate volume discount
  let volumeDiscountPercentage = 0
  const volumeTier = volumeDiscountTiers.find(
    tier => quantity >= tier.minQuantity && (!tier.maxQuantity || quantity <= tier.maxQuantity)
  )
  if (volumeTier) {
    volumeDiscountPercentage = volumeTier.discountPercentage
  }
  
  // Calculate tier discount
  const tierDiscountPercentage = tierDiscounts[company.tier]
  
  // Calculate special discounts (would check company.specialDiscounts in real implementation)
  const specialDiscountPercentage = 0
  
  // Calculate amounts
  const subtotal = basePrice * quantity
  const volumeDiscount = subtotal * (volumeDiscountPercentage / 100)
  const tierDiscount = subtotal * (tierDiscountPercentage / 100)
  const specialDiscount = subtotal * (specialDiscountPercentage / 100)
  
  const totalSavings = volumeDiscount + tierDiscount + specialDiscount
  const finalPrice = subtotal - totalSavings
  const unitPrice = finalPrice / quantity
  const savingsPercentage = (totalSavings / subtotal) * 100
  
  return {
    basePrice,
    volumeDiscount,
    volumeDiscountPercentage,
    tierDiscount,
    tierDiscountPercentage,
    specialDiscount,
    specialDiscountPercentage,
    subtotal,
    finalPrice,
    unitPrice,
    totalSavings,
    savingsPercentage,
  }
}

// ==================== ORDER UTILITIES ====================

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${DB_CONSTANTS.ORDER_NUMBER_PREFIX}-${timestamp}-${random}`
}

export function generateQuoteNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${DB_CONSTANTS.QUOTE_NUMBER_PREFIX}-${timestamp}-${random}`
}

export function generateInvoiceNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${DB_CONSTANTS.INVOICE_NUMBER_PREFIX}-${timestamp}-${random}`
}

// ==================== SECURITY UTILITIES ====================

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, DB_CONSTANTS.PASSWORD_SALT_ROUNDS)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

// ==================== VALIDATION UTILITIES ====================

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (password.length < DB_CONSTANTS.PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${DB_CONSTANTS.PASSWORD_MIN_LENGTH} characters long`)
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    valid: errors.length === 0,
    errors,
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhoneNumber(phone: string): boolean {
  // Basic international phone number validation
  const phoneRegex = /^\+?[1-9]\d{1,14}$/
  return phoneRegex.test(phone.replace(/[\s-]/g, ''))
}

// ==================== SLUG UTILITIES ====================

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, hyphens with single hyphen
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

export function generateUniqueSlug(text: string, existingSlugs: string[]): string {
  let slug = generateSlug(text)
  let counter = 1
  
  while (existingSlugs.includes(slug)) {
    slug = `${generateSlug(text)}-${counter}`
    counter++
  }
  
  return slug
}

// ==================== DATE UTILITIES ====================

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function formatDate(date: Date, format: 'short' | 'long' | 'iso' = 'short'): string {
  switch (format) {
    case 'short':
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    case 'long':
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    case 'iso':
      return date.toISOString()
    default:
      return date.toLocaleDateString()
  }
}

export function isExpired(date: Date): boolean {
  return date < new Date()
}

// ==================== PAGINATION UTILITIES ====================

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginationResult {
  skip: number
  take: number
  page: number
  limit: number
}

export function getPaginationParams(params: PaginationParams): PaginationResult {
  const page = Math.max(1, params.page || 1)
  const limit = Math.min(
    DB_CONSTANTS.MAX_PAGE_SIZE,
    Math.max(1, params.limit || DB_CONSTANTS.DEFAULT_PAGE_SIZE)
  )
  
  return {
    skip: (page - 1) * limit,
    take: limit,
    page,
    limit,
  }
}

export function getPaginationMeta(totalCount: number, params: PaginationResult) {
  const totalPages = Math.ceil(totalCount / params.limit)
  
  return {
    page: params.page,
    limit: params.limit,
    totalCount,
    totalPages,
    hasNextPage: params.page < totalPages,
    hasPreviousPage: params.page > 1,
  }
}

// ==================== SEARCH UTILITIES ====================

export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except hyphens
    .substring(0, DB_CONSTANTS.MAX_SEARCH_LENGTH)
}

export function buildSearchConditions(query: string, fields: string[]) {
  const sanitized = sanitizeSearchQuery(query)
  if (!sanitized || sanitized.length < DB_CONSTANTS.MIN_SEARCH_LENGTH) {
    return {}
  }
  
  return {
    OR: fields.map(field => ({
      [field]: {
        contains: sanitized,
        mode: 'insensitive' as const,
      },
    })),
  }
}

// ==================== INVENTORY UTILITIES ====================

export function isLowStock(product: { stock: number; reorderLevel: number }): boolean {
  return product.stock <= product.reorderLevel * DB_CONSTANTS.LOW_STOCK_THRESHOLD
}

export function isOutOfStock(product: { stock: number }): boolean {
  return product.stock <= 0
}

export function calculateStockStatus(product: { stock: number; reorderLevel: number }) {
  if (isOutOfStock(product)) return 'OUT_OF_STOCK'
  if (isLowStock(product)) return 'LOW_STOCK'
  return 'IN_STOCK'
}

// ==================== AUDIT UTILITIES ====================

export interface AuditLogData {
  userId?: string
  action: string
  entityType?: string
  entityId?: string
  oldValues?: any
  newValues?: any
  metadata?: any
  ipAddress?: string
  userAgent?: string
}

export function createAuditLog(data: AuditLogData) {
  return {
    userId: data.userId,
    action: data.action,
    tableName: data.entityType || '',
    recordId: data.entityId || '',
    oldValues: data.oldValues ? JSON.parse(JSON.stringify(data.oldValues)) : null,
    newValues: data.newValues ? JSON.parse(JSON.stringify(data.newValues)) : null,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
  }
}

// ==================== FILE UTILITIES ====================

export function validateFileSize(sizeInBytes: number): boolean {
  return sizeInBytes <= DB_CONSTANTS.MAX_FILE_SIZE
}

export function validateFileType(mimeType: string): boolean {
  return DB_CONSTANTS.ALLOWED_FILE_TYPES.includes(mimeType)
}

export function generateFileKey(prefix: string, filename: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = filename.split('.').pop()
  return `${prefix}/${timestamp}-${random}.${extension}`
}

// ==================== EXPORT UTILITIES ====================

export function sanitizeForCsv(value: any): string {
  if (value === null || value === undefined) return ''
  
  const stringValue = String(value)
  
  // Escape quotes and wrap in quotes if contains comma, quote, or newline
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  
  return stringValue
}

export function generateCsvFromData(data: any[], headers: string[]): string {
  const csvHeaders = headers.join(',')
  const csvRows = data.map(row => 
    headers.map(header => sanitizeForCsv(row[header])).join(',')
  )
  
  return [csvHeaders, ...csvRows].join('\n')
}