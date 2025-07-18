export declare const DEFAULT_PAGE_SIZE = 20;
export declare const MAX_PAGE_SIZE = 100;
export declare const DEFAULT_PRESCRIPTION_VALIDITY_DAYS = 30;
export declare const EXPIRY_WARNING_DAYS = 90;
export declare const LOW_STOCK_THRESHOLD_PERCENTAGE = 20;
export declare const CRITICAL_STOCK_THRESHOLD_PERCENTAGE = 10;
export declare const ORDER_EXPIRY_HOURS = 24;
export declare const DEFAULT_TAX_RATE = 0.08;
export declare const USER_ROLES: {
    readonly ADMIN: "ADMIN";
    readonly PHARMACIST: "PHARMACIST";
    readonly CUSTOMER: "CUSTOMER";
    readonly SUPPLIER: "SUPPLIER";
};
export declare const ORDER_STATUSES: {
    readonly PENDING: "PENDING";
    readonly PROCESSING: "PROCESSING";
    readonly COMPLETED: "COMPLETED";
    readonly CANCELLED: "CANCELLED";
    readonly REFUNDED: "REFUNDED";
};
export declare const PRESCRIPTION_STATUSES: {
    readonly PENDING: "PENDING";
    readonly VERIFIED: "VERIFIED";
    readonly DISPENSED: "DISPENSED";
    readonly EXPIRED: "EXPIRED";
    readonly CANCELLED: "CANCELLED";
};
export declare const PRODUCT_TYPES: {
    readonly MEDICINE: "MEDICINE";
    readonly MEDICAL_DEVICE: "MEDICAL_DEVICE";
    readonly SUPPLEMENT: "SUPPLEMENT";
    readonly COSMETIC: "COSMETIC";
    readonly OTHER: "OTHER";
};
export declare const PURCHASE_ORDER_STATUSES: {
    readonly DRAFT: "draft";
    readonly SENT: "sent";
    readonly RECEIVED: "received";
    readonly CANCELLED: "cancelled";
};
export declare const PAYMENT_METHODS: {
    readonly CASH: "CASH";
    readonly CREDIT_CARD: "CREDIT_CARD";
    readonly DEBIT_CARD: "DEBIT_CARD";
    readonly INSURANCE: "INSURANCE";
    readonly BANK_TRANSFER: "BANK_TRANSFER";
};
export declare const PAYMENT_STATUSES: {
    readonly PENDING: "PENDING";
    readonly PROCESSING: "PROCESSING";
    readonly COMPLETED: "COMPLETED";
    readonly FAILED: "FAILED";
    readonly REFUNDED: "REFUNDED";
};
export declare const DOSAGE_FORMS: {
    readonly TABLET: "Tablet";
    readonly CAPSULE: "Capsule";
    readonly SYRUP: "Syrup";
    readonly INJECTION: "Injection";
    readonly CREAM: "Cream";
    readonly OINTMENT: "Ointment";
    readonly DROPS: "Drops";
    readonly INHALER: "Inhaler";
    readonly PATCH: "Patch";
    readonly SUPPOSITORY: "Suppository";
};
export declare const ERROR_CODES: {
    readonly DUPLICATE_ENTRY: "DUPLICATE_ENTRY";
    readonly NOT_FOUND: "NOT_FOUND";
    readonly INVALID_DATA: "INVALID_DATA";
    readonly UNAUTHORIZED: "UNAUTHORIZED";
    readonly FORBIDDEN: "FORBIDDEN";
    readonly INSUFFICIENT_STOCK: "INSUFFICIENT_STOCK";
    readonly EXPIRED_PRODUCT: "EXPIRED_PRODUCT";
    readonly PRESCRIPTION_REQUIRED: "PRESCRIPTION_REQUIRED";
    readonly INVALID_PRESCRIPTION: "INVALID_PRESCRIPTION";
};
export declare const AUDIT_ACTIONS: {
    readonly CREATE: "CREATE";
    readonly UPDATE: "UPDATE";
    readonly DELETE: "DELETE";
    readonly VIEW: "VIEW";
    readonly VERIFY: "VERIFY";
    readonly DISPENSE: "DISPENSE";
    readonly CANCEL: "CANCEL";
    readonly REFUND: "REFUND";
};
//# sourceMappingURL=constants.d.ts.map