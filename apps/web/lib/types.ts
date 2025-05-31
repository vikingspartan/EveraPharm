// Enum types that mirror the database schema
// These are duplicated here to avoid importing from @prisma/client in the frontend

export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CASH = 'CASH'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  PHARMACIST = 'PHARMACIST',
  ADMIN = 'ADMIN',
  SUPPLIER = 'SUPPLIER'
}

export enum ProductType {
  MEDICINE = 'MEDICINE',
  MEDICAL_DEVICE = 'MEDICAL_DEVICE',
  SUPPLEMENT = 'SUPPLEMENT',
  COSMETIC = 'COSMETIC',
  OTHER = 'OTHER'
} 