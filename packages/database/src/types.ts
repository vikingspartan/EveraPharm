import { 
  User, 
  Product, 
  Order, 
  Prescription,
  UserRole,
  OrderStatus,
  PrescriptionStatus,
  ProductType,
  Prisma
} from '@prisma/client';

// User related types
export type UserWithProfiles = User & {
  customerProfile?: any;
  pharmacistProfile?: any;
  supplierProfile?: any;
};

export type CreateUserDTO = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  phoneNumber?: string;
  dateOfBirth?: Date;
  address?: string;
};

export type UpdateUserDTO = Partial<CreateUserDTO> & {
  isActive?: boolean;
};

// Product related types
export type ProductWithRelations = Product & {
  category?: any;
  supplier?: any;
  inventory?: any[];
};

export type CreateProductDTO = {
  sku: string;
  name: string;
  genericName?: string;
  description: string;
  type: ProductType;
  manufacturer: string;
  supplierId?: string;
  categoryId: string;
  price: number;
  costPrice: number;
  activeIngredients: string[];
  dosageForm?: string;
  strength?: string;
  packSize?: string;
  requiresPrescription?: boolean;
  storageConditions?: string;
  images?: string[];
};

export type UpdateProductDTO = Partial<CreateProductDTO> & {
  isActive?: boolean;
};

// Order related types
export type OrderWithItems = Order & {
  items: any[];
  customer?: User;
  prescription?: Prescription;
};

export type CreateOrderDTO = {
  customerId: string;
  items: CreateOrderItemDTO[];
  shippingAddress: string;
  billingAddress: string;
  paymentMethod?: string;
  notes?: string;
};

export type CreateOrderItemDTO = {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
};

export type UpdateOrderDTO = {
  status?: OrderStatus;
  paymentStatus?: string;
  notes?: string;
};

// Prescription related types
export type PrescriptionWithItems = Prescription & {
  items: any[];
  patient?: User;
  verifiedByPharmacist?: any;
  dispensedByPharmacist?: any;
};

export type CreatePrescriptionDTO = {
  patientId: string;
  doctorName: string;
  doctorLicense: string;
  clinicName?: string;
  clinicContact?: string;
  prescribedDate: Date;
  validUntil: Date;
  diagnosis?: string;
  notes?: string;
  items: CreatePrescriptionItemDTO[];
};

export type CreatePrescriptionItemDTO = {
  productId: string;
  quantity: number;
  dosage: string;
  duration: string;
  instructions?: string;
};

export type UpdatePrescriptionDTO = {
  status?: PrescriptionStatus;
  verifiedBy?: string;
  verifiedAt?: Date;
  dispensedBy?: string;
  dispensedAt?: Date;
  orderId?: string;
};

// Inventory related types
export type CreateInventoryDTO = {
  productId: string;
  quantity: number;
  reorderLevel: number;
  reorderQuantity: number;
  batchNumber: string;
  expiryDate: Date;
  location?: string;
};

export type UpdateInventoryDTO = {
  quantity?: number;
  reorderLevel?: number;
  reorderQuantity?: number;
  location?: string;
};

// Category related types
export type CategoryWithChildren = {
  id: string;
  name: string;
  description?: string | null;
  parentId?: string | null;
  children: CategoryWithChildren[];
  createdAt: Date;
  updatedAt: Date;
};

// Search and filter types
export type ProductSearchParams = {
  query?: string;
  categoryId?: string;
  type?: ProductType;
  requiresPrescription?: boolean;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
};

export type OrderSearchParams = {
  customerId?: string;
  status?: OrderStatus;
  startDate?: Date;
  endDate?: Date;
  minTotal?: number;
  maxTotal?: number;
  sortBy?: 'createdAt' | 'total' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
};

// Pagination types
export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// Analytics types
export type DashboardStats = {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingPrescriptions: number;
  lowStockProducts: number;
  expiringProducts: number;
};

export type SalesReport = {
  period: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }>;
};

// Error types
export type DatabaseError = {
  code: string;
  message: string;
  field?: string;
}; 