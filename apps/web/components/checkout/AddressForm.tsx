'use client';

import React, { useState } from 'react';

interface AddressData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

interface AddressFormProps {
  onSubmit: (shippingAddress: AddressData, billingAddress: AddressData) => void;
  initialShipping?: AddressData;
  initialBilling?: AddressData;
}

const emptyAddress: AddressData = {
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  phone: '',
};

export default function AddressForm({ onSubmit, initialShipping, initialBilling }: AddressFormProps) {
  const [shippingAddress, setShippingAddress] = useState<AddressData>(initialShipping || emptyAddress);
  const [billingAddress, setBillingAddress] = useState<AddressData>(initialBilling || emptyAddress);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAddress = (address: AddressData, prefix: string) => {
    const newErrors: Record<string, string> = {};
    
    if (!address.firstName) newErrors[`${prefix}firstName`] = 'First name is required';
    if (!address.lastName) newErrors[`${prefix}lastName`] = 'Last name is required';
    if (!address.address) newErrors[`${prefix}address`] = 'Address is required';
    if (!address.city) newErrors[`${prefix}city`] = 'City is required';
    if (!address.state) newErrors[`${prefix}state`] = 'State is required';
    if (!address.zipCode) newErrors[`${prefix}zipCode`] = 'ZIP code is required';
    if (!address.phone) newErrors[`${prefix}phone`] = 'Phone number is required';
    
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const shippingErrors = validateAddress(shippingAddress, 'shipping');
    const billingErrors = sameAsShipping ? {} : validateAddress(billingAddress, 'billing');
    
    const allErrors = { ...shippingErrors, ...billingErrors };
    
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }
    
    onSubmit(
      shippingAddress,
      sameAsShipping ? shippingAddress : billingAddress
    );
  };

  const handleShippingChange = (field: keyof AddressData, value: string) => {
    setShippingAddress({ ...shippingAddress, [field]: value });
    setErrors({ ...errors, [`shipping${field}`]: '' });
  };

  const handleBillingChange = (field: keyof AddressData, value: string) => {
    setBillingAddress({ ...billingAddress, [field]: value });
    setErrors({ ...errors, [`billing${field}`]: '' });
  };

  const renderAddressFields = (
    address: AddressData,
    onChange: (field: keyof AddressData, value: string) => void,
    prefix: string
  ) => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor={`${prefix}-firstName`} className="block text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          type="text"
          id={`${prefix}-firstName`}
          value={address.firstName}
          onChange={(e) => onChange('firstName', e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors[`${prefix}firstName`] ? 'border-red-300' : ''
          }`}
        />
        {errors[`${prefix}firstName`] && (
          <p className="mt-1 text-sm text-red-600">{errors[`${prefix}firstName`]}</p>
        )}
      </div>

      <div>
        <label htmlFor={`${prefix}-lastName`} className="block text-sm font-medium text-gray-700">
          Last Name
        </label>
        <input
          type="text"
          id={`${prefix}-lastName`}
          value={address.lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors[`${prefix}lastName`] ? 'border-red-300' : ''
          }`}
        />
        {errors[`${prefix}lastName`] && (
          <p className="mt-1 text-sm text-red-600">{errors[`${prefix}lastName`]}</p>
        )}
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`${prefix}-address`} className="block text-sm font-medium text-gray-700">
          Street Address
        </label>
        <input
          type="text"
          id={`${prefix}-address`}
          value={address.address}
          onChange={(e) => onChange('address', e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors[`${prefix}address`] ? 'border-red-300' : ''
          }`}
        />
        {errors[`${prefix}address`] && (
          <p className="mt-1 text-sm text-red-600">{errors[`${prefix}address`]}</p>
        )}
      </div>

      <div>
        <label htmlFor={`${prefix}-city`} className="block text-sm font-medium text-gray-700">
          City
        </label>
        <input
          type="text"
          id={`${prefix}-city`}
          value={address.city}
          onChange={(e) => onChange('city', e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors[`${prefix}city`] ? 'border-red-300' : ''
          }`}
        />
        {errors[`${prefix}city`] && (
          <p className="mt-1 text-sm text-red-600">{errors[`${prefix}city`]}</p>
        )}
      </div>

      <div>
        <label htmlFor={`${prefix}-state`} className="block text-sm font-medium text-gray-700">
          State
        </label>
        <input
          type="text"
          id={`${prefix}-state`}
          value={address.state}
          onChange={(e) => onChange('state', e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors[`${prefix}state`] ? 'border-red-300' : ''
          }`}
        />
        {errors[`${prefix}state`] && (
          <p className="mt-1 text-sm text-red-600">{errors[`${prefix}state`]}</p>
        )}
      </div>

      <div>
        <label htmlFor={`${prefix}-zipCode`} className="block text-sm font-medium text-gray-700">
          ZIP Code
        </label>
        <input
          type="text"
          id={`${prefix}-zipCode`}
          value={address.zipCode}
          onChange={(e) => onChange('zipCode', e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors[`${prefix}zipCode`] ? 'border-red-300' : ''
          }`}
        />
        {errors[`${prefix}zipCode`] && (
          <p className="mt-1 text-sm text-red-600">{errors[`${prefix}zipCode`]}</p>
        )}
      </div>

      <div>
        <label htmlFor={`${prefix}-phone`} className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          id={`${prefix}-phone`}
          value={address.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
            errors[`${prefix}phone`] ? 'border-red-300' : ''
          }`}
        />
        {errors[`${prefix}phone`] && (
          <p className="mt-1 text-sm text-red-600">{errors[`${prefix}phone`]}</p>
        )}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
        {renderAddressFields(shippingAddress, handleShippingChange, 'shipping')}
      </div>

      <div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="sameAsShipping"
            checked={sameAsShipping}
            onChange={(e) => setSameAsShipping(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="sameAsShipping" className="ml-2 block text-sm text-gray-900">
            Billing address same as shipping
          </label>
        </div>

        {!sameAsShipping && (
          <>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h3>
            {renderAddressFields(billingAddress, handleBillingChange, 'billing')}
          </>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Continue to Next Step
        </button>
      </div>
    </form>
  );
} 