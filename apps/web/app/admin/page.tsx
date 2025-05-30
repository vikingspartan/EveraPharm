'use client';

import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import Link from 'next/link';

interface DashboardStats {
  stats: {
    totalOrders: number;
    pendingOrders: number;
    totalProducts: number;
    activeProducts: number;
    totalUsers: number;
    totalRevenue: number;
    todayOrders: number;
    todayRevenue: number;
    lowStockProducts: number;
  };
  recentOrders: Array<any>;
  lowStockAlerts: Array<any>;
  salesByCategory: Array<{
    category: string;
    orderCount: number;
    revenue: number;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await api.getAdminStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="text-center text-red-600 py-8">
        <p>{error || 'Failed to load dashboard'}</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.stats.totalOrders,
      subtext: `${stats.stats.pendingOrders} pending`,
      color: 'bg-blue-500',
      link: '/admin/orders',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.stats.totalRevenue.toFixed(2)}`,
      subtext: `$${stats.stats.todayRevenue.toFixed(2)} today`,
      color: 'bg-green-500',
    },
    {
      title: 'Total Products',
      value: stats.stats.totalProducts,
      subtext: `${stats.stats.activeProducts} active`,
      color: 'bg-purple-500',
      link: '/admin/products',
    },
    {
      title: 'Total Users',
      value: stats.stats.totalUsers,
      subtext: `${stats.stats.todayOrders} orders today`,
      color: 'bg-orange-500',
      link: '/admin/users',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.subtext}</p>
              </div>
              <div className={`h-12 w-12 ${stat.color} rounded-lg opacity-20`}></div>
            </div>
            {stat.link && (
              <Link
                href={stat.link}
                className="text-sm text-blue-600 hover:text-blue-700 mt-4 inline-block"
              >
                View details →
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Low Stock Alert */}
      {stats.stats.lowStockProducts > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-red-800 font-medium">
              {stats.stats.lowStockProducts} products are low on stock
            </span>
            <Link
              href="/admin/products?filter=lowStock"
              className="ml-auto text-red-600 hover:text-red-700 text-sm"
            >
              View products
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
          </div>
          <div className="divide-y">
            {stats.recentOrders.length === 0 ? (
              <p className="p-6 text-gray-500 text-center">No recent orders</p>
            ) : (
              stats.recentOrders.map((order) => (
                <div key={order.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Order #{order.orderNumber}
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.customer.firstName} {order.customer.lastName}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${parseFloat(order.total).toFixed(2)}
                      </p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t">
            <Link
              href="/admin/orders"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View all orders →
            </Link>
          </div>
        </div>

        {/* Sales by Category */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-medium text-gray-900">Sales by Category</h2>
          </div>
          <div className="p-6">
            {stats.salesByCategory.length === 0 ? (
              <p className="text-gray-500 text-center">No sales data available</p>
            ) : (
              <div className="space-y-4">
                {stats.salesByCategory.map((category) => (
                  <div key={category.category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {category.category}
                      </span>
                      <span className="text-sm text-gray-500">
                        ${parseFloat(category.revenue.toString()).toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(parseFloat(category.revenue.toString()) / 
                            Math.max(...stats.salesByCategory.map(c => parseFloat(c.revenue.toString())))) * 100}%`
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {category.orderCount} orders
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Low Stock Products */}
      {stats.lowStockAlerts.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-medium text-gray-900">Low Stock Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Available
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reorder Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.lowStockAlerts.map((item: any) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.product_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.product_sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`font-medium ${item.availableQuantity < 5 ? 'text-red-600' : 'text-orange-600'}`}>
                        {item.availableQuantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.reorderLevel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/admin/products/${item.productId}/edit`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Restock
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 