'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '../../../lib/api';
import ProductCard from '../../../components/products/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (id: string) => {
    setLoading(true);
    setError('');

    try {
      const productData = await api.getProduct(id);
      setProduct(productData);

      // Fetch similar products
      const similarResponse = await api.getProducts({
        category: productData.category.slug,
        limit: 4,
      });
      setSimilarProducts(similarResponse.data.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to load product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    alert(`Added ${quantity} ${product.name} to cart`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
          <Link href="/products" className="text-blue-600 hover:underline">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  const price = parseFloat(product.price);
  const isInStock = product.inventory && product.inventory.availableQuantity > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li>
              <Link href="/" className="text-gray-700 hover:text-gray-900">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <Link href="/products" className="ml-1 text-gray-700 hover:text-gray-900 md:ml-2">
                  Products
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-gray-500 md:ml-2" aria-current="page">
                  {product.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
                {product.images && product.images.length > 0 && product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-gray-100">
                    <svg className="h-32 w-32 text-gray-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {product.category.name}
                </span>
                {product.requiresPrescription && (
                  <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    Prescription Required
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              {product.genericName && (
                <p className="text-lg text-gray-600 italic mb-4">{product.genericName}</p>
              )}

              <p className="text-gray-700 mb-6">{product.description}</p>

              <div className="space-y-2 mb-6">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Manufacturer:</span> {product.manufacturer}
                </p>
                {product.dosageForm && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Form:</span> {product.dosageForm}
                  </p>
                )}
                {product.strength && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Strength:</span> {product.strength}
                  </p>
                )}
                {product.packSize && (
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Pack Size:</span> {product.packSize}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  <span className="font-medium">SKU:</span> {product.sku}
                </p>
              </div>

              {/* Price and Stock */}
              <div className="border-t border-b border-gray-200 py-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">${price.toFixed(2)}</span>
                  </div>
                  <div className="text-right">
                    {isInStock ? (
                      <p className="text-green-600 font-medium">In Stock</p>
                    ) : (
                      <p className="text-red-600 font-medium">Out of Stock</p>
                    )}
                    {product.inventory && (
                      <p className="text-sm text-gray-500">
                        {product.inventory.availableQuantity} available
                      </p>
                    )}
                  </div>
                </div>

                {/* Quantity and Add to Cart */}
                {isInStock && !product.requiresPrescription && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center">
                      <label htmlFor="quantity" className="mr-2 text-sm font-medium text-gray-700">
                        Quantity:
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        min="1"
                        max={product.inventory?.availableQuantity || 99}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add to Cart
                    </button>
                  </div>
                )}

                {product.requiresPrescription && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <p className="text-sm text-yellow-800">
                      <span className="font-medium">Prescription Required:</span> This medication requires a valid prescription from a licensed healthcare provider.
                    </p>
                  </div>
                )}
              </div>

              {/* Additional Information */}
              {product.activeIngredients && product.activeIngredients.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Active Ingredients</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {product.activeIngredients.map((ingredient: string, index: number) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.storageConditions && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Storage</h3>
                  <p className="text-gray-700">{product.storageConditions}</p>
                </div>
              )}

              {product.handlingInstructions && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Handling Instructions</h3>
                  <p className="text-gray-700">{product.handlingInstructions}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 