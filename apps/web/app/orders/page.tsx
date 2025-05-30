'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';
import Link from 'next/link';
import Image from 'next/image';
import { OrderStatus } from '@prisma/client';

interface OrderItem {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  total: string;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    product: {
      id: string;
      name: string;
      images: string[];
    };
  }>;
}

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/orders');
      return;
    }

    const fetchOrders = async () => {
      try {
        const data = await api.getOrders();
        setOrders(data as OrderItem[]);
      } catch (err: any) {
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, router]);

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error loading orders</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <svg className="mx-auto h-24 w-24 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h1>
          <p className="text-gray-600 mb-6">Start shopping to place your first order!</p>
          <Link
            href="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 inline-block"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
      
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Order #{order.orderNumber}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <p className="text-lg font-medium text-gray-900 mt-2">
                    ${order.total}
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center space-x-4 mb-4">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="relative h-16 w-16 overflow-hidden rounded-md">
                      <Image
                        src={item.product.images[0] || '/placeholder.png'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center">
                      <span className="text-sm text-gray-600">
                        +{order.items.length - 3}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 