'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../lib/api';
import AddressForm from '../../components/checkout/AddressForm';
import PrescriptionUpload from '../../components/checkout/PrescriptionUpload';
import PaymentForm from '../../components/checkout/PaymentForm';
import Link from 'next/link';
import Image from 'next/image';
import { PaymentMethod } from '@prisma/client';

type CheckoutStep = 'address' | 'prescription' | 'payment' | 'confirmation';

interface AddressData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('address');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form data
  const [shippingAddress, setShippingAddress] = useState<AddressData | null>(null);
  const [billingAddress, setBillingAddress] = useState<AddressData | null>(null);
  const [prescriptionData, setPrescriptionData] = useState<any>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  // Calculate if prescription is required
  const hasRxItems = items.some(item => item.requiresPrescription);
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const shippingCost = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
  const total = subtotal + tax + shippingCost;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <Link href="/products" className="text-blue-600 hover:text-blue-700">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleAddressSubmit = (shipping: AddressData, billing: AddressData) => {
    setShippingAddress(shipping);
    setBillingAddress(billing);
    
    // Skip prescription step if no prescription items
    if (!hasRxItems) {
      setCurrentStep('payment');
    } else {
      setCurrentStep('prescription');
    }
  };

  const handlePrescriptionSubmit = async (data: any) => {
    setPrescriptionData(data);
    setCurrentStep('payment');
  };

  const handlePrescriptionSkip = () => {
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = async (paymentMethod: PaymentMethod, paymentDetails?: any) => {
    if (!shippingAddress || !billingAddress) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Format addresses for API
      const formatAddress = (addr: AddressData) => 
        `${addr.firstName} ${addr.lastName}\n${addr.address}\n${addr.city}, ${addr.state} ${addr.zipCode}\nPhone: ${addr.phone}`;
      
      // Create order
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        shippingAddress: formatAddress(shippingAddress),
        billingAddress: formatAddress(billingAddress),
        paymentMethod,
        notes: '',
      };
      
      const order = await api.createOrder(orderData);
      setOrderId(order.id);
      
      // Upload prescription if needed
      if (hasRxItems && prescriptionData) {
        const formData = new FormData();
        Object.keys(prescriptionData).forEach(key => {
          if (key === 'file' && prescriptionData[key]) {
            formData.append('file', prescriptionData[key]);
          } else if (prescriptionData[key]) {
            formData.append(key, prescriptionData[key]);
          }
        });
        
        await api.uploadPrescription(order.id, formData);
      }
      
      // Clear cart and show confirmation
      clearCart();
      setCurrentStep('confirmation');
    } catch (err: any) {
      setError(err.message || 'Failed to process order');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = hasRxItems
      ? ['Address', 'Prescription', 'Payment']
      : ['Address', 'Payment'];
    
    const currentStepIndex = 
      currentStep === 'address' ? 0 :
      currentStep === 'prescription' ? 1 :
      currentStep === 'payment' ? (hasRxItems ? 2 : 1) :
      steps.length;
    
    return (
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  index <= currentStepIndex
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index < currentStepIndex ? (
                  <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                index <= currentStepIndex ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {step}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-20 h-1 mx-4 ${
                  index < currentStepIndex ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (currentStep === 'confirmation' && orderId) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <svg className="mx-auto h-24 w-24 text-green-400 mb-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="text-xl font-medium text-gray-900">{orderId}</p>
          </div>
          <div className="space-y-4">
            <Link
              href={`/orders/${orderId}`}
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700"
            >
              View Order Details
            </Link>
            <Link
              href="/products"
              className="block w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-300"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {renderStepIndicator()}
          
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}
          
          <div className="bg-white rounded-lg shadow p-6">
            {currentStep === 'address' && (
              <AddressForm
                onSubmit={handleAddressSubmit}
                initialShipping={shippingAddress || undefined}
                initialBilling={billingAddress || undefined}
              />
            )}
            
            {currentStep === 'prescription' && (
              <PrescriptionUpload
                onSubmit={handlePrescriptionSubmit}
                onSkip={handlePrescriptionSkip}
                hasRxItems={hasRxItems}
              />
            )}
            
            {currentStep === 'payment' && (
              <PaymentForm
                onSubmit={handlePaymentSubmit}
                total={total}
              />
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex space-x-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={item.image || '/placeholder.png'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    {item.requiresPrescription && (
                      <p className="text-xs text-red-600">Rx Required</p>
                    )}
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-medium pt-2 border-t">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 