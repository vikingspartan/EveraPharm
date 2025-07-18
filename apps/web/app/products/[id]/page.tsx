'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Product {
  id: string;
  sku: string;
  name: string;
  genericName: string | null;
  description: string;
  manufacturer: string;
  price: string;
  costPrice: string;
  activeIngredients: string[];
  requiresPrescription: boolean;
  dosageForm: string | null;
  strength: string | null;
  packSize: string | null;
  storageConditions: string | null;
  handlingInstructions: string | null;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  inventory?: {
    id: string;
    totalQuantity: number;
    availableQuantity: number;
    reservedQuantity: number;
  } | null;
  batches?: Array<{
    id: string;
    batchNumber: string;
    quantity: number;
    remainingQuantity: number;
    expiryDate: string;
    manufactureDate: string;
  }>;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (id: string) => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      
      const response = await fetch(`${apiUrl}/products/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found');
        }
        throw new Error('Failed to fetch product');
      }

      const data = await response.json();
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Mock data for development
      setProduct({
        id: id,
        sku: 'AMX-001',
        name: 'Amoxicillin 500mg',
        genericName: 'Amoxicillin',
        description: 'Amoxicillin is a broad-spectrum antibiotic belonging to the penicillin family. It is effective against a wide range of bacterial infections including respiratory tract infections, urinary tract infections, skin and soft tissue infections, and dental infections. This medication works by inhibiting bacterial cell wall synthesis, leading to bacterial cell death.',
        manufacturer: 'PharmaCorp International',
        price: '24.99',
        costPrice: '15.50',
        activeIngredients: ['Amoxicillin trihydrate'],
        requiresPrescription: true,
        dosageForm: 'Capsule',
        strength: '500mg',
        packSize: '21 capsules',
        storageConditions: 'Store below 25°C in a dry place. Keep container tightly closed.',
        handlingInstructions: 'Take with food to reduce stomach upset. Complete the full course even if symptoms improve.',
        images: [],
        isActive: true,
        isFeatured: false,
        category: { id: '1', name: 'Antibiotics', slug: 'antibiotics' },
        inventory: {
          id: 'inv-1',
          totalQuantity: 500,
          availableQuantity: 450,
          reservedQuantity: 50
        },
        batches: [
          {
            id: 'batch-1',
            batchNumber: 'AMX2024001',
            quantity: 250,
            remainingQuantity: 230,
            expiryDate: '2025-12-31',
            manufactureDate: '2024-01-15'
          },
          {
            id: 'batch-2',
            batchNumber: 'AMX2024002',
            quantity: 250,
            remainingQuantity: 220,
            expiryDate: '2026-01-31',
            manufactureDate: '2024-02-10'
          }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    // This would integrate with your cart system
    alert(`Added ${quantity} x ${product?.name} to cart`);
  };

  const handleOrderNow = () => {
    // This would redirect to checkout
    alert(`Proceeding to order ${quantity} x ${product?.name}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The product you are looking for could not be found.'}</p>
            <Link
              href="/products/pharmaceuticals"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              ← Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="text-gray-700 hover:text-blue-600">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link href={`/products/${product.category.slug}`} className="ml-1 text-gray-700 hover:text-blue-600 md:ml-2">
                    {product.category.name}
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 text-gray-500 md:ml-2" aria-current="page">
                    {product.name}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Product Image */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg flex items-center justify-center">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <div className="text-center">
                    <svg className="mx-auto h-20 w-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">No image available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="mt-6 lg:mt-0 lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  {product.genericName && (
                    <p className="text-lg text-gray-600 mt-1">Generic: {product.genericName}</p>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  {product.requiresPrescription && (
                    <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800 mb-2">
                      Prescription Required
                    </span>
                  )}
                  {product.isFeatured && (
                    <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div className="text-3xl font-bold text-gray-900 mb-6">${product.price}</div>

              {/* Key Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Manufacturer</h3>
                  <p className="mt-1 text-sm text-gray-900">{product.manufacturer}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">SKU</h3>
                  <p className="mt-1 text-sm text-gray-900">{product.sku}</p>
                </div>
                {product.strength && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Strength</h3>
                    <p className="mt-1 text-sm text-gray-900">{product.strength}</p>
                  </div>
                )}
                {product.dosageForm && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Dosage Form</h3>
                    <p className="mt-1 text-sm text-gray-900">{product.dosageForm}</p>
                  </div>
                )}
                {product.packSize && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Pack Size</h3>
                    <p className="mt-1 text-sm text-gray-900">{product.packSize}</p>
                  </div>
                )}
                {product.inventory && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Stock Status</h3>
                    <p className={`mt-1 text-sm font-medium ${
                      product.inventory.availableQuantity > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {product.inventory.availableQuantity > 0 
                        ? `${product.inventory.availableQuantity} units available`
                        : 'Out of stock'
                      }
                    </p>
                  </div>
                )}
              </div>

              {/* Add to Cart Section */}
              {product.inventory && product.inventory.availableQuantity > 0 && (
                <div className="border-t pt-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                      Quantity:
                    </label>
                    <select
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      {Array.from({ length: Math.min(10, product.inventory.availableQuantity) }, (_, i) => i + 1).map((num) => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={handleOrderNow}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Product Description */}
            <div className="mt-6 bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Active Ingredients */}
            {product.activeIngredients && product.activeIngredients.length > 0 && (
              <div className="mt-6 bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Active Ingredients</h2>
                <ul className="list-disc list-inside text-gray-700">
                  {product.activeIngredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Storage & Handling */}
            {(product.storageConditions || product.handlingInstructions) && (
              <div className="mt-6 bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Storage & Handling</h2>
                {product.storageConditions && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Storage Conditions</h3>
                    <p className="text-gray-700">{product.storageConditions}</p>
                  </div>
                )}
                {product.handlingInstructions && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Handling Instructions</h3>
                    <p className="text-gray-700">{product.handlingInstructions}</p>
                  </div>
                )}
              </div>
            )}

            {/* Batch Information (for admins) */}
            {product.batches && product.batches.length > 0 && (
              <div className="mt-6 bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Batch Information</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Batch Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Available
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Expiry Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Manufacture Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {product.batches.map((batch) => (
                        <tr key={batch.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {batch.batchNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {batch.remainingQuantity} / {batch.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(batch.expiryDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(batch.manufactureDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            ← Back to Products
          </button>
        </div>
      </div>
    </div>
  );
} 