"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div className="ml-3">
                <div className="text-xl font-bold text-gray-900">AdvaCare</div>
                <div className="text-xs text-blue-600 -mt-1">PHARMA</div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Products Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setIsProductsOpen(true)}
                onMouseLeave={() => setIsProductsOpen(false)}
                className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Products
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isProductsOpen && (
                <div
                  onMouseEnter={() => setIsProductsOpen(true)}
                  onMouseLeave={() => setIsProductsOpen(false)}
                  className="absolute left-0 mt-0 w-64 bg-white rounded-lg shadow-lg border border-gray-200"
                >
                  <Link href="/products/pharmaceuticals" className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                    <div className="font-medium text-gray-900">Pharmaceuticals</div>
                    <div className="text-sm text-gray-600">Medicines & therapeutic drugs</div>
                  </Link>
                  <Link href="/products/medical-devices" className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                    <div className="font-medium text-gray-900">Medical Devices</div>
                    <div className="text-sm text-gray-600">Diagnostic & medical equipment</div>
                  </Link>
                  <Link href="/products/supplements" className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                    <div className="font-medium text-gray-900">Supplements</div>
                    <div className="text-sm text-gray-600">Vitamins & nutritional products</div>
                  </Link>
                  <Link href="/products/veterinary" className="block px-4 py-3 hover:bg-gray-50">
                    <div className="font-medium text-gray-900">Veterinary</div>
                    <div className="text-sm text-gray-600">Animal health solutions</div>
                  </Link>
                </div>
              )}
            </div>

            <Link href="/distribute-with-us" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Distribute with Us
            </Link>
            <Link href="/your-health" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Your Health
            </Link>
            <Link href="/company" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Company
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Contact Us
            </Link>
            <Link href="/media" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Media
            </Link>
            <Link href="/faq" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              FAQ
            </Link>

            {/* Language Selector */}
            <div className="flex items-center space-x-2 pl-8 border-l border-gray-300">
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <select className="text-sm text-gray-700 bg-transparent border-none focus:outline-none cursor-pointer">
                <option>EN</option>
                <option>ES</option>
                <option>FR</option>
              </select>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <div className="space-y-1">
              <div className="pb-2">
                <div className="font-medium text-gray-900 px-4 py-2">Products</div>
                <Link href="/products/pharmaceuticals" className="block pl-8 pr-4 py-2 text-gray-600 hover:text-blue-600">
                  Pharmaceuticals
                </Link>
                <Link href="/products/medical-devices" className="block pl-8 pr-4 py-2 text-gray-600 hover:text-blue-600">
                  Medical Devices
                </Link>
                <Link href="/products/supplements" className="block pl-8 pr-4 py-2 text-gray-600 hover:text-blue-600">
                  Supplements
                </Link>
                <Link href="/products/veterinary" className="block pl-8 pr-4 py-2 text-gray-600 hover:text-blue-600">
                  Veterinary
                </Link>
              </div>
              <Link href="/distribute-with-us" className="block px-4 py-2 text-gray-700 hover:text-blue-600">
                Distribute with Us
              </Link>
              <Link href="/your-health" className="block px-4 py-2 text-gray-700 hover:text-blue-600">
                Your Health
              </Link>
              <Link href="/company" className="block px-4 py-2 text-gray-700 hover:text-blue-600">
                Company
              </Link>
              <Link href="/contact" className="block px-4 py-2 text-gray-700 hover:text-blue-600">
                Contact Us
              </Link>
              <Link href="/media" className="block px-4 py-2 text-gray-700 hover:text-blue-600">
                Media
              </Link>
              <Link href="/faq" className="block px-4 py-2 text-gray-700 hover:text-blue-600">
                FAQ
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}