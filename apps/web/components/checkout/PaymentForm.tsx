'use client';

import React, { useState } from 'react';
import { PaymentMethod } from '../../lib/types';

interface PaymentFormProps {
  onSubmit: (paymentMethod: PaymentMethod, paymentDetails?: any) => void;
  total: number;
}

export default function PaymentForm({ onSubmit, total }: PaymentFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CREDIT_CARD);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateCard = () => {
    const newErrors: Record<string, string> = {};
    
    if (paymentMethod === PaymentMethod.CREDIT_CARD) {
      if (!cardDetails.cardNumber) newErrors.cardNumber = 'Card number is required';
      else if (cardDetails.cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }
      
      if (!cardDetails.cardHolder) newErrors.cardHolder = 'Cardholder name is required';
      if (!cardDetails.expiryMonth) newErrors.expiryMonth = 'Expiry month is required';
      if (!cardDetails.expiryYear) newErrors.expiryYear = 'Expiry year is required';
      if (!cardDetails.cvv) newErrors.cvv = 'CVV is required';
      else if (cardDetails.cvv.length !== 3) newErrors.cvv = 'CVV must be 3 digits';
    }
    
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateCard();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit(paymentMethod, paymentMethod === PaymentMethod.CREDIT_CARD ? cardDetails : undefined);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    setCardDetails({ ...cardDetails, cardNumber: formatted });
    setErrors({ ...errors, cardNumber: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
        
        <div className="space-y-4">
          <label className="relative flex items-start cursor-pointer">
            <div className="flex items-center h-5">
              <input
                type="radio"
                name="paymentMethod"
                value={PaymentMethod.CREDIT_CARD}
                checked={paymentMethod === PaymentMethod.CREDIT_CARD}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
            </div>
            <div className="ml-3">
              <label className="font-medium text-gray-700">Credit/Debit Card</label>
              <p className="text-gray-500 text-sm">Pay securely with your credit or debit card</p>
            </div>
          </label>

          <label className="relative flex items-start cursor-pointer">
            <div className="flex items-center h-5">
              <input
                type="radio"
                name="paymentMethod"
                value={PaymentMethod.BANK_TRANSFER}
                checked={paymentMethod === PaymentMethod.BANK_TRANSFER}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
            </div>
            <div className="ml-3">
              <label className="font-medium text-gray-700">Bank Transfer</label>
              <p className="text-gray-500 text-sm">Transfer funds directly to our account</p>
            </div>
          </label>

          <label className="relative flex items-start cursor-pointer">
            <div className="flex items-center h-5">
              <input
                type="radio"
                name="paymentMethod"
                value={PaymentMethod.CASH}
                checked={paymentMethod === PaymentMethod.CASH}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
              />
            </div>
            <div className="ml-3">
              <label className="font-medium text-gray-700">Cash on Delivery</label>
              <p className="text-gray-500 text-sm">Pay when you receive your order</p>
            </div>
          </label>
        </div>
      </div>

      {paymentMethod === PaymentMethod.CREDIT_CARD && (
        <div className="bg-gray-50 p-6 rounded-lg space-y-4">
          <h4 className="font-medium text-gray-900">Card Details</h4>
          
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              value={cardDetails.cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.cardNumber ? 'border-red-300' : ''
              }`}
            />
            {errors.cardNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700">
              Cardholder Name
            </label>
            <input
              type="text"
              id="cardHolder"
              value={cardDetails.cardHolder}
              onChange={(e) => {
                setCardDetails({ ...cardDetails, cardHolder: e.target.value });
                setErrors({ ...errors, cardHolder: '' });
              }}
              placeholder="John Doe"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                errors.cardHolder ? 'border-red-300' : ''
              }`}
            />
            {errors.cardHolder && (
              <p className="mt-1 text-sm text-red-600">{errors.cardHolder}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700">
                Month
              </label>
              <select
                id="expiryMonth"
                value={cardDetails.expiryMonth}
                onChange={(e) => {
                  setCardDetails({ ...cardDetails, expiryMonth: e.target.value });
                  setErrors({ ...errors, expiryMonth: '' });
                }}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.expiryMonth ? 'border-red-300' : ''
                }`}
              >
                <option value="">MM</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month.toString().padStart(2, '0')}>
                    {month.toString().padStart(2, '0')}
                  </option>
                ))}
              </select>
              {errors.expiryMonth && (
                <p className="mt-1 text-sm text-red-600">{errors.expiryMonth}</p>
              )}
            </div>

            <div>
              <label htmlFor="expiryYear" className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <select
                id="expiryYear"
                value={cardDetails.expiryYear}
                onChange={(e) => {
                  setCardDetails({ ...cardDetails, expiryYear: e.target.value });
                  setErrors({ ...errors, expiryYear: '' });
                }}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.expiryYear ? 'border-red-300' : ''
                }`}
              >
                <option value="">YY</option>
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                  <option key={year} value={year.toString().slice(-2)}>
                    {year}
                  </option>
                ))}
              </select>
              {errors.expiryYear && (
                <p className="mt-1 text-sm text-red-600">{errors.expiryYear}</p>
              )}
            </div>

            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                CVV
              </label>
              <input
                type="text"
                id="cvv"
                value={cardDetails.cvv}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 3) {
                    setCardDetails({ ...cardDetails, cvv: value });
                    setErrors({ ...errors, cvv: '' });
                  }
                }}
                maxLength={3}
                placeholder="123"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                  errors.cvv ? 'border-red-300' : ''
                }`}
              />
              {errors.cvv && (
                <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="border-t pt-6">
        <div className="flex justify-between text-lg font-medium text-gray-900 mb-6">
          <span>Total to Pay</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Complete Order
        </button>
      </div>
    </form>
  );
} 