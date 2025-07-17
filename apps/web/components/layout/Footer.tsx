'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/why-everapharm" className="hover:text-white transition-colors">
                  Why EveraPharm?
                </Link>
              </li>
              <li>
                <Link href="/distribution" className="hover:text-white transition-colors">
                  Distribution
                </Link>
              </li>
              <li>
                <Link href="/product-registration" className="hover:text-white transition-colors">
                  Product Registration
                </Link>
              </li>
              <li>
                <Link href="/production" className="hover:text-white transition-colors">
                  Production
                </Link>
              </li>
              <li>
                <Link href="/quality" className="hover:text-white transition-colors">
                  Quality
                </Link>
              </li>
              <li>
                <Link href="/consumers" className="hover:text-white transition-colors">
                  Consumers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products/pharmaceuticals" className="hover:text-white transition-colors">
                  Pharmaceuticals
                </Link>
              </li>
              <li>
                <Link href="/products/medical-devices" className="hover:text-white transition-colors">
                  Medical Devices
                </Link>
              </li>
              <li>
                <Link href="/products/supplements" className="hover:text-white transition-colors">
                  Supplements
                </Link>
              </li>
              <li>
                <Link href="/products/veterinary" className="hover:text-white transition-colors">
                  Veterinary
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Connected & Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Get Connected</h3>
            <div className="flex space-x-4 mb-6">
              <a
                href="https://wa.me/yourwhatsappnumber"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com/everapharm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/everapharm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>

            <h4 className="text-white font-semibold mb-3">Exclusive Updates. Subscribe.</h4>
            <p className="text-sm mb-4">Price Updates, New Products and Exhibitions</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-l-md focus:outline-none focus:bg-gray-700"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-r-md hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Popular Searches */}
        <div className="py-8 border-t border-gray-800">
          <h3 className="text-white font-semibold mb-4">Top Search</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Popular Products</h4>
              <ul className="text-sm space-y-1">
                <li><Link href="/products/amoxicillin" className="hover:text-white">Amoxicillin Capsules</Link></li>
                <li><Link href="/products/metronidazole" className="hover:text-white">Metronidazole Injection</Link></li>
                <li><Link href="/products/paracetamol" className="hover:text-white">Paracetamol + Ibuprofen</Link></li>
                <li><Link href="/products/ceftriaxone" className="hover:text-white">Ceftriaxone Sodium</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Medical Devices</h4>
              <ul className="text-sm space-y-1">
                <li><Link href="/products/syringes" className="hover:text-white">Disposable Syringes</Link></li>
                <li><Link href="/products/pregnancy-test" className="hover:text-white">Pregnancy Test Kit</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Supplements</h4>
              <ul className="text-sm space-y-1">
                <li><Link href="/products/omega-3" className="hover:text-white">Omega-3 Capsules</Link></li>
                <li><Link href="/products/hip-joint" className="hover:text-white">Hip & Joint Supplement</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Veterinary</h4>
              <ul className="text-sm space-y-1">
                <li><Link href="/products/ivermectin" className="hover:text-white">Ivermectin Injection</Link></li>
                <li><Link href="/products/oxytetracycline" className="hover:text-white">Oxytetracycline Injection</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Top Categories</h4>
              <ul className="text-sm space-y-1">
                <li><Link href="/categories/injections" className="hover:text-white">Pharmaceutical Injections</Link></li>
                <li><Link href="/categories/tablets" className="hover:text-white">Pharmaceutical Tablets</Link></li>
                <li><Link href="/categories/vet-injections" className="hover:text-white">Veterinary Injections</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="py-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} EveraPharm®. All rights reserved. International copyright registered and protected.
          </div>
          <div className="flex space-x-6 text-sm">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}