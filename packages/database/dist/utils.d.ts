export declare function getPaginationParams(page?: number, limit?: number): {
    skip: number;
    take: number;
    page: number;
    limit: number;
};
export declare function createPaginatedResponse<T>(data: T[], total: number, page: number, limit: number): {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};
export declare function isExpiringSoon(expiryDate: Date): boolean;
export declare function isExpired(expiryDate: Date): boolean;
export declare function addDays(date: Date, days: number): Date;
export declare function calculateStockLevel(currentQuantity: number, reorderLevel: number): 'critical' | 'low' | 'normal';
export declare function isLowStock(currentQuantity: number, reorderLevel: number): boolean;
export declare function calculateOrderTotal(items: Array<{
    quantity: number;
    unitPrice: number;
    discount?: number;
}>, taxRate?: number, shippingCost?: number, orderDiscount?: number): {
    subtotal: number;
    tax: number;
    discount: number;
    shippingCost: number;
    total: number;
};
export declare function isValidEmail(email: string): boolean;
export declare function isValidPhoneNumber(phone: string): boolean;
export declare function isValidSKU(sku: string): boolean;
export declare function generateOrderNumber(): string;
export declare function generatePrescriptionNumber(): string;
export declare function generateBatchNumber(): string;
export declare function createSearchQuery(query: string): object;
export declare function formatPrismaError(error: any): {
    code: string;
    message: string;
    field?: string;
};
export declare function sanitizeInput(input: string): string;
export declare function sanitizePhoneNumber(phone: string): string;
export declare function formatCurrency(amount: number): string;
export declare function formatDate(date: Date): string;
export declare function formatDateTime(date: Date): string;
//# sourceMappingURL=utils.d.ts.map