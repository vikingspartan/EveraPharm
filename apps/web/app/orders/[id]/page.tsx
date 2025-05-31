'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { useAuth } from '../../../hooks/useAuth';
import Link from 'next/link';
import Image from 'next/image';
import { OrderStatus, PaymentStatus } from '../../../lib/types';

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  subtotal: string;
  tax: string;
  shippingCost: string;
  total: string;
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
  shippedAt: string | null;
  deliveredAt: string | null;
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: string;
    total: string;
    product: {
      id: string;
      name: string;
      genericName: string | null;
      manufacturer: string;
      requiresPrescription: boolean;
      images: string[];
    };
  }>;
  customer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  prescription?: {
    id: string;
    status: string;
    doctorName: string;
    prescribedDate: string;
  };
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/orders/${params.id}`);
      return;
    }

    const fetchOrder = async () => {
      try {
        const data = await api.getOrder(params.id as string);
        setOrder(data as OrderDetail);
      } catch (err: any) {
        setError(err.message || 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.id, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/orders" className="text-blue-600 hover:text-blue-700">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600';
      case 'PAID':
        return 'text-green-600';
      case 'FAILED':
        return 'text-red-600';
      case 'REFUNDED':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link href="/orders" className="text-blue-600 hover:text-blue-700 text-sm mb-4 inline-block">
          ← Back to Orders
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600 mt-1">Order #{order.orderNumber}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex space-x-4 py-4 border-b last:border-0">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={item.product.images[0] || '/placeholder.png'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{item.product.name}</h3>
                    {item.product.genericName && (
                      <p className="text-sm text-gray-500">{item.product.genericName}</p>
                    )}
                    <p className="text-sm text-gray-500">{item.product.manufacturer}</p>
                    {item.product.requiresPrescription && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                        Rx Required
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">${item.total}</p>
                    <p className="text-sm text-gray-500">
                      ${item.unitPrice} × {item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prescription Information */}
          {order.prescription && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Prescription Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Doctor</p>
                  <p className="text-sm font-medium text-gray-900">{order.prescription.doctorName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Prescribed Date</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(order.prescription.prescribedDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-sm font-medium text-gray-900">{order.prescription.status}</p>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h3>
                <p className="text-sm text-gray-600 whitespace-pre-line">{order.shippingAddress}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Billing Address</h3>
                <p className="text-sm text-gray-600 whitespace-pre-line">{order.billingAddress}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order Date</span>
                <span className="text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
              {order.shippedAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipped Date</span>
                  <span className="text-gray-900">
                    {new Date(order.shippedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              {order.deliveredAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivered Date</span>
                  <span className="text-gray-900">
                    {new Date(order.deliveredAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">${order.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-gray-900">${order.tax}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-900">
                  {parseFloat(order.shippingCost) === 0 ? 'FREE' : `$${order.shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-medium pt-2 border-t">
                <span>Total</span>
                <span>${order.total}</span>
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-gray-600">Payment Method</span>
                <span className="text-gray-900">{order.paymentMethod.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Payment Status</span>
                <span className={`font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            {order.status === 'COMPLETED' && (
              <button className="w-full mt-6 bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700">
                Download Invoice
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 