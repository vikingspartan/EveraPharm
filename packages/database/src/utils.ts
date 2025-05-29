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
    Math.max(1, params.limit || DB_CONSTANTS.DEFAULT_PAGE_SIZE