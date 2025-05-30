// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Date constants
export const DEFAULT_PRESCRIPTION_VALIDITY_DAYS = 30;
export const EXPIRY_WARNING_DAYS = 90;

// Inventory constants
export const LOW_STOCK_THRESHOLD_PERCENTAGE = 20;
export const CRITICAL_STOCK_THRESHOLD_PERCENTAGE = 10;

// Order constants
export const ORDER_EXPIRY_HOURS = 24;
export const DEFAULT_TAX_RATE = 0.08; // 8%

// User roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  PHARMACIST: 'PHARMACIST',
  CUSTOMER: 'CUSTOMER',
  SUPPLIER: 'SUPPLIER'
} as const;

// Order statuses
export const ORDER_STATUSES = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED'
} as const;

// Prescription statuses
export const PRESCRIPTION_STATUSES = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  DISPENSED: 'DISPENSED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED'
} as const;

// Product types
export const PRODUCT_TYPES = {
  MEDICINE: 'MEDICINE',
  MEDICAL_DEVICE: 'MEDICAL_DEVICE',
  SUPPLEMENT: 'SUPPLEMENT',
  COSMETIC: 'COSMETIC',
  OTHER: 'OTHER'
} as const;

// Purchase order statuses
export const PURCHASE_ORDER_STATUSES = {
  DRAFT: 'draft',
  SENT: 'sent',
  RECEIVED: 'received',
  CANCELLED: 'cancelled'
} as const;

// Payment methods
export const PAYMENT_METHODS = {
  CASH: 'CASH',
  CREDIT_CARD: 'CREDIT_CARD',
  DEBIT_CARD: 'DEBIT_CARD',
  INSURANCE: 'INSURANCE',
  BANK_TRANSFER: 'BANK_TRANSFER'
} as const;

// Payment statuses
export const PAYMENT_STATUSES = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
} as const;

// Dosage forms
export const DOSAGE_FORMS = {
  TABLET: 'Tablet',
  CAPSULE: 'Capsule',
  SYRUP: 'Syrup',
  INJECTION: 'Injection',
  CREAM: 'Cream',
  OINTMENT: 'Ointment',
  DROPS: 'Drops',
  INHALER: 'Inhaler',
  PATCH: 'Patch',
  SUPPOSITORY: 'Suppository'
} as const;

// Error codes
export const ERROR_CODES = {
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  NOT_FOUND: 'NOT_FOUND',
  INVALID_DATA: 'INVALID_DATA',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK',
  EXPIRED_PRODUCT: 'EXPIRED_PRODUCT',
  PRESCRIPTION_REQUIRED: 'PRESCRIPTION_REQUIRED',
  INVALID_PRESCRIPTION: 'INVALID_PRESCRIPTION'
} as const;

// Audit actions
export const AUDIT_ACTIONS = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  VIEW: 'VIEW',
  VERIFY: 'VERIFY',
  DISPENSE: 'DISPENSE',
  CANCEL: 'CANCEL',
  REFUND: 'REFUND'
} as const; 