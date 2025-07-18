'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  genericName: string | null;
  description: string;
  manufacturer: string;
  price: string;
  requiresPrescription: boolean;
  dosageForm: string | null;
  strength: string | null;
  packSize: string | null;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function PharmaceuticalsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        category: 'pharmaceuticals',
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`${apiUrl}/products?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data: ProductsResponse = await response.json();
      setProducts(data.data);
      setTotalPages(data.meta.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Fallback to mock data for development
      setProducts([
        {
          id: '1',
          name: 'Amoxicillin 500mg',
          genericName: 'Amoxicillin',
          description: 'Broad-spectrum antibiotic for bacterial infections',
          manufacturer: 'PharmaCorp',
          price: '24.99',
          requiresPrescription: true,
          dosageForm: 'Capsule',
          strength: '500mg',
          packSize: '21 capsules',
          images: [],
          category: { id: '1', name: 'Antibiotics', slug: 'antibiotics' }
        },
        {
          id: '2',
          name: 'Ibuprofen 200mg',
          genericName: 'Ibuprofen',
          description: 'Non-steroidal anti-inflammatory drug for pain relief',
          manufacturer: 'HealthCare Plus',
          price: '7.99',
          requiresPrescription: false,
          dosageForm: 'Tablet',
          strength: '200mg',
          packSize: '50 tablets',
          images: [],
          category: { id: '2', name: 'Pain Relief', slug: 'pain-relief' }
        },
        {
          id: '3',
          name: 'Metformin 500mg',
          genericName: 'Metformin',
          description: 'Diabetes medication for blood sugar control',
          manufacturer: 'DiabetesCare',
          price: '15.99',
          requiresPrescription: true,
          dosageForm: 'Tablet',
          strength: '500mg',
          packSize: '30 tablets',
          images: [],
          category: { id: '3', name: 'Diabetes', slug: 'diabetes' }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pharmaceuticals</h1>
              <p className="mt-2 text-gray-600">
                Prescription and over-the-counter medications for various conditions
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Search medications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <Link 
                  href="/admin/products"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Manage Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  API Connection Issue
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Could not connect to API. Showing sample data. Error: {error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {product.name}
                        </h3>
                        {product.genericName && (
                          <p className="text-sm text-gray-600 mb-2">
                            Generic: {product.genericName}
                          </p>
                        )}
                      </div>
                      {product.requiresPrescription && (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Rx Required
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="space-y-1 text-sm text-gray-500 mb-4">
                      <p><span className="font-medium">Manufacturer:</span> {product.manufacturer}</p>
                      {product.strength && (
                        <p><span className="font-medium">Strength:</span> {product.strength}</p>
                      )}
                      {product.packSize && (
                        <p><span className="font-medium">Pack Size:</span> {product.packSize}</p>
                      )}
                      {product.dosageForm && (
                        <p><span className="font-medium">Form:</span> {product.dosageForm}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">
                        ${product.price}
                      </span>
                      <Link
                        href={`/products/${product.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 