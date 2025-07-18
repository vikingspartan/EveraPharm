"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaginationParams = getPaginationParams;
exports.createPaginatedResponse = createPaginatedResponse;
exports.isExpiringSoon = isExpiringSoon;
exports.isExpired = isExpired;
exports.addDays = addDays;
exports.calculateStockLevel = calculateStockLevel;
exports.isLowStock = isLowStock;
exports.calculateOrderTotal = calculateOrderTotal;
exports.isValidEmail = isValidEmail;
exports.isValidPhoneNumber = isValidPhoneNumber;
exports.isValidSKU = isValidSKU;
exports.generateOrderNumber = generateOrderNumber;
exports.generatePrescriptionNumber = generatePrescriptionNumber;
exports.generateBatchNumber = generateBatchNumber;
exports.createSearchQuery = createSearchQuery;
exports.formatPrismaError = formatPrismaError;
exports.sanitizeInput = sanitizeInput;
exports.sanitizePhoneNumber = sanitizePhoneNumber;
exports.formatCurrency = formatCurrency;
exports.formatDate = formatDate;
exports.formatDateTime = formatDateTime;
const constants_1 = require("./constants");
// Pagination utilities
function getPaginationParams(page, limit) {
    const currentPage = Math.max(1, page || 1);
    const pageSize = Math.min(Math.max(1, limit || constants_1.DEFAULT_PAGE_SIZE), constants_1.MAX_PAGE_SIZE);
    const skip = (currentPage - 1) * pageSize;
    return {
        skip,
        take: pageSize,
        page: currentPage,
        limit: pageSize
    };
}
function createPaginatedResponse(data, total, page, limit) {
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
function isExpiringSoon(expiryDate) {
    const warningDate = new Date();
    warningDate.setDate(warningDate.getDate() + constants_1.EXPIRY_WARNING_DAYS);
    return expiryDate <= warningDate;
}
function isExpired(expiryDate) {
    return expiryDate <= new Date();
}
function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
// Stock utilities
function calculateStockLevel(currentQuantity, reorderLevel) {
    const percentage = (currentQuantity / reorderLevel) * 100;
    if (percentage <= 10)
        return 'critical';
    if (percentage <= 20)
        return 'low';
    return 'normal';
}
function isLowStock(currentQuantity, reorderLevel) {
    return currentQuantity <= reorderLevel;
}
// Price calculation utilities
function calculateOrderTotal(items, taxRate = 0.08, shippingCost = 0, orderDiscount = 0) {
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
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function isValidPhoneNumber(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}
function isValidSKU(sku) {
    const skuRegex = /^[A-Z0-9\-]+$/i;
    return skuRegex.test(sku) && sku.length >= 3;
}
// String utilities
function generateOrderNumber() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `ORD-${timestamp}-${random}`.toUpperCase();
}
function generatePrescriptionNumber() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `RX-${timestamp}-${random}`.toUpperCase();
}
function generateBatchNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().substr(2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.random().toString(36).substr(2, 4);
    return `B${year}${month}-${random}`.toUpperCase();
}
// Search utilities
function createSearchQuery(query) {
    if (!query || query.trim() === '')
        return {};
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
function formatPrismaError(error) {
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
function sanitizeInput(input) {
    return input.trim().replace(/[<>]/g, '');
}
function sanitizePhoneNumber(phone) {
    return phone.replace(/\D/g, '');
}
// Formatting utilities
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}
function formatDateTime(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}
