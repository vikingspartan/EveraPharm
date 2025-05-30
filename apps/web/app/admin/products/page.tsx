'use client';

import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  sku: string;
  name: string;
  genericName: string | null;
  manufacturer: string;
  price: string;
  requiresPrescription: boolean;
  isActive: boolean;
  isFeatured: boolean;
  images: string[];
  category: {
    id: string;
    name: string;
  };
  inventory?: {
    availableQuantity: number;
    reorderLevel: number;
  };
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    requiresPrescription: '',
  });

  useEffect(() => {
    loadProducts();
  }, [page, filters]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await api.getProducts({
        page,
        limit: 10,
        search: filters.search || undefined,
        category: filters.category || undefined,
        requiresPrescription: filters.requiresPrescription ? filters.requiresPrescription === 'true' : undefined,
      });
      setProducts(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.deleteProduct(productId);
      // Reload products to reflect changes
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      await api.updateProduct(productId, { isActive: !currentStatus });
      // Reload products to reflect changes
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to update product status');
    }
  };

  const toggleFeatured = async (productId: string, currentFeatured: boolean) => {
    try {
      await api.updateProduct(productId, { isFeatured: !currentFeatured });
      loadProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to update featured status');
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPage(1); // Reset to first page when filtering
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add New Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Name, SKU, or manufacturer"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="pain-relief">Pain Relief</option>
              <option value="antibiotics">Antibiotics</option>
              <option value="vitamins">Vitamins</option>
              <option value="diabetes">Diabetes</option>
              <option value="heart-health">Heart Health</option>
              <option value="allergy">Allergy</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prescription Required
            </label>
            <select
              value={filters.requiresPrescription}
              onChange={(e) => handleFilterChange('requiresPrescription', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">All Products</option>
              <option value="true">Prescription Required</option>
              <option value="false">OTC Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={product.images[0] || '/placeholder.png'}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.genericName || product.manufacturer}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.sku}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ${parseFloat(product.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.inventory ? (
                      <div>
                        <span className={`text-sm font-medium ${
                          product.inventory.availableQuantity <= product.inventory.reorderLevel
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}>
                          {product.inventory.availableQuantity} units
                        </span>
                        {product.inventory.availableQuantity <= product.inventory.reorderLevel && (
                          <p className="text-xs text-red-600">Low stock</p>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No inventory</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleProductStatus(product.id, product.isActive)}
                        className={`inline-flex items-center px-2.5 py-1.5 rounded text-xs font-medium ${
                          product.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </button>
                      {product.requiresPrescription && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Rx
                        </span>
                      )}
                      <button
                        onClick={() => toggleFeatured(product.id, product.isFeatured)}
                        className={`text-yellow-500 hover:text-yellow-600 ${product.isFeatured ? 'opacity-100' : 'opacity-30'}`}
                        title={product.isFeatured ? 'Remove from featured' : 'Add to featured'}
                      >
                        ★
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id, product.name)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 