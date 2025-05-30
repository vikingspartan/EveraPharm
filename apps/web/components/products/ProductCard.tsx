'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  id: string;
  name: string;
  genericName?: string;
  manufacturer: string;
  price: number;
  image?: string;
  requiresPrescription: boolean;
  inStock: boolean;
  dosageForm?: string;
  strength?: string;
}

export default function ProductCard({
  id,
  name,
  genericName,
  manufacturer,
  price,
  image,
  requiresPrescription,
  inStock,
  dosageForm,
  strength,
}: ProductCardProps) {
  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200">
      {/* Product Image */}
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
        {image ? (
          <Image
            src={image}
            alt={name}
            width={300}
            height={300}
            className="h-full w-full object-cover object-center group-hover:opacity-75"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-gray-100">
            <svg className="h-20 w-20 text-gray-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Badges */}
        <div className="flex gap-2 mb-2">
          {requiresPrescription && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Rx Required
            </span>
          )}
          {!inStock && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Out of Stock
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-semibold text-gray-900">
          <Link href={`/products/${id}`} className="hover:text-blue-600">
            {name}
          </Link>
        </h3>

        {/* Generic Name */}
        {genericName && (
          <p className="text-sm text-gray-500 italic">{genericName}</p>
        )}

        {/* Dosage Info */}
        <div className="mt-1 text-sm text-gray-600">
          {strength && <span>{strength}</span>}
          {strength && dosageForm && <span> • </span>}
          {dosageForm && <span>{dosageForm}</span>}
        </div>

        {/* Manufacturer */}
        <p className="mt-1 text-sm text-gray-500">by {manufacturer}</p>

        {/* Price and Action */}
        <div className="mt-4 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">${price.toFixed(2)}</span>
          </div>
          
          <button
            disabled={!inStock || requiresPrescription}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !inStock || requiresPrescription
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {!inStock ? 'Out of Stock' : requiresPrescription ? 'Prescription Required' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
} 