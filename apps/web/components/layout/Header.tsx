'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../contexts/CartContext';
import CartDrawer from '../cart/CartDrawer';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartCount } = useCart();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCartDrawer, setShowCartDrawer] = useState(false);

  const cartCount = getCartCount();

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <Link href="/" className="flex items-center">
              <svg className="h-8 w-8 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <span className="ml-2 text-xl font-semibold text-gray-900">EveraPharma</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/products" className="text-gray-600 hover:text-gray-900">Products</Link>
              <Link href="/prescriptions" className="text-gray-600 hover:text-gray-900">Prescriptions</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
              <button 
                className="relative p-2 text-gray-400 hover:text-gray-500"
                onClick={() => setShowCartDrawer(true)}
              >
                <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                    <span className="hidden sm:block">{user.firstName}</span>
                    <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        {user.role === 'ADMIN' && (
                          <>
                            <Link
                              href="/admin"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-medium"
                              onClick={() => setShowUserMenu(false)}
                            >
                              Admin Dashboard
                            </Link>
                            <hr className="my-1" />
                          </>
                        )}
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          My Profile
                        </Link>
                        <Link
                          href="/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          My Orders
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login" className="text-gray-600 hover:text-gray-900">
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      <CartDrawer isOpen={showCartDrawer} onClose={() => setShowCartDrawer(false)} />
    </>
  );
}