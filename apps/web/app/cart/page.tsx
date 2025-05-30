'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../hooks/useAuth';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isClearing, setIsClearing] = useState(false);

  const handleUpdateQuantity = (productId: string, newQuantity: string) => {
    const quantity = parseInt(newQuantity) || 0;
    updateQuantity(productId, quantity);
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setIsClearing(true);
      clearCart();
      setTimeout(() => setIsClearing(false), 500);
    }
  };

  const hasRxItems = items.some(item => item.requiresPrescription);
  const subtotal = getCartTotal();
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
  const total = subtotal + tax + shipping;

  if (items.length === 0 && !isClearing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <h2 className="mt-4 text-2xl font-semibold text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-gray-600">Start shopping to add items to your cart.</p>
            <Link
              href="/products"
              className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={handleClearCart}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-6 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="h-12 w-12 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        <Link href={`/products/${item.productId}`} className="hover:text-blue-600">
                          {item.name}
                        </Link>
                      </h3>
                      {item.genericName && (
                        <p className="text-sm text-gray-500 italic">{item.genericName}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        {item.strength && <span>{item.strength}</span>}
                        {item.strength && item.dosageForm && <span> • </span>}
                        {item.dosageForm && <span>{item.dosageForm}</span>}
                      </p>
                      <p className="text-sm text-gray-500">by {item.manufacturer}</p>
                      
                      {item.requiresPrescription && (
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Prescription Required
                          </span>
                        </div>
                      )}

                      <div className="mt-4 flex items-center space-x-4">
                        {/* Quantity Selector */}
                        <div className="flex items-center">
                          <label htmlFor={`quantity-${item.id}`} className="sr-only">
                            Quantity
                          </label>
                          <select
                            id={`quantity-${item.id}`}
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.productId, e.target.value)}
                            className="rounded-md border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                          >
                            {[...Array(Math.min(item.maxQuantity, 10))].map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </select>
                          <span className="ml-2 text-sm text-gray-500">
                            of {item.maxQuantity} available
                          </span>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-sm text-gray-500">
                          ${item.price.toFixed(2)} each
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-2">
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
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-gray-500">
                    Free shipping on orders over $50
                  </p>
                )}
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-gray-900">Total</span>
                    <span className="text-base font-semibold text-gray-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {hasRxItems && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <span className="font-medium">Note:</span> Your cart contains prescription items. 
                    You'll need to provide valid prescriptions during checkout.
                  </p>
                </div>
              )}

              <div className="mt-6 space-y-3">
                {!isAuthenticated ? (
                  <>
                    <Link
                      href="/login"
                      className="w-full block text-center bg-blue-600 text-white px-4 py-3 rounded-md font-medium hover:bg-blue-700"
                    >
                      Login to Checkout
                    </Link>
                    <Link
                      href="/register"
                      className="w-full block text-center bg-gray-200 text-gray-800 px-4 py-3 rounded-md font-medium hover:bg-gray-300"
                    >
                      Create Account
                    </Link>
                  </>
                ) : (
                  <button
                    className="w-full bg-blue-600 text-white px-4 py-3 rounded-md font-medium hover:bg-blue-700"
                    onClick={() => alert('Checkout functionality coming soon!')}
                  >
                    Proceed to Checkout
                  </button>
                )}
                
                <Link
                  href="/products"
                  className="w-full block text-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 