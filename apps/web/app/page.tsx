'use client';

// import { useState } from 'react';
import HeroSection from '../components/home/HeroSection';
import ProductCard from '../components/products/ProductCard';
// import CartDrawer from '../components/cart/CartDrawer';

// Sample featured products data
const FEATURED_PRODUCTS = [
  {
    id: '1',
    name: 'Aspirin 325mg',
    genericName: 'Acetylsalicylic Acid',
    manufacturer: 'PharmaCorp',
    price: '12.99',
    images: [],
    requiresPrescription: false,
    dosageForm: 'Tablet',
    strength: '325mg',
    packSize: '100 tablets',
    category: {
      id: 'cat1',
      name: 'Pain Relief',
      slug: 'pain-relief'
    }
  },
  {
    id: '2',
    name: 'Amoxicillin 500mg',
    genericName: 'Amoxicillin',
    manufacturer: 'MediLabs',
    price: '24.99',
    images: [],
    requiresPrescription: true,
    dosageForm: 'Capsule',
    strength: '500mg',
    packSize: '30 capsules',
    category: {
      id: 'cat2',
      name: 'Antibiotics',
      slug: 'antibiotics'
    }
  },
  {
    id: '3',
    name: 'Vitamin D3 1000IU',
    genericName: 'Cholecalciferol',
    manufacturer: 'HealthPlus',
    price: '15.99',
    images: [],
    requiresPrescription: false,
    dosageForm: 'Softgel',
    strength: '1000IU',
    packSize: '90 softgels',
    category: {
      id: 'cat3',
      name: 'Vitamins & Supplements',
      slug: 'vitamins-supplements'
    }
  },
  {
    id: '4',
    name: 'Insulin Glargine',
    genericName: 'Insulin Glargine',
    manufacturer: 'DiabetesCare',
    price: '89.99',
    images: [],
    requiresPrescription: true,
    dosageForm: 'Injection',
    strength: '100 units/mL',
    packSize: '10mL vial',
    category: {
      id: 'cat4',
      name: 'Diabetes Care',
      slug: 'diabetes-care'
    }
  },
];

// Sample cart items
// const SAMPLE_CART_ITEMS = [
//   {
//     id: 'cart-1',
//     productId: '1',
//     name: 'Aspirin 325mg',
//     genericName: 'Acetylsalicylic Acid',
//     price: '12.99',
//     quantity: 2,
//     strength: '325mg',
//     dosageForm: 'Tablet',
//   },
// ];

export default function Page() {
  // const [isCartOpen, setIsCartOpen] = useState(false);
  // const [cartItems, setCartItems] = useState(SAMPLE_CART_ITEMS);

  // const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
  //   if (newQuantity === 0) {
  //     handleRemoveItem(itemId);
  //     return;
  //   }
  //   setCartItems(items =>
  //     items.map(item =>
  //       item.id === itemId ? { ...item, quantity: newQuantity } : item
  //     )
  //   );
  // };

  // const handleRemoveItem = (itemId: string) => {
  //   setCartItems(items => items.filter(item => item.id !== itemId));
  // };

  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Featured Products
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Browse our selection of popular medications and healthcare products
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <a
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              View All Products
              <svg className="ml-2 -mr-1 h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Why Choose EveraPharma
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We're committed to providing the best pharmaceutical care
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-blue-600">
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">24/7 Support</h3>
              <p className="mt-2 text-gray-600">
                Our licensed pharmacists are available around the clock to answer your questions
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-blue-600">
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Secure & Private</h3>
              <p className="mt-2 text-gray-600">
                Your health information is protected with bank-level encryption
              </p>
            </div>

            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-blue-600">
                <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                </svg>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">Free Delivery</h3>
              <p className="mt-2 text-gray-600">
                Free shipping on orders over $50, delivered right to your door
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Start Your Health Journey Today
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Upload your prescription and get your medications delivered
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/prescriptions"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-100"
            >
              Upload Prescription
            </a>
            <a
              href="/register"
              className="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors"
            >
              Create Account
            </a>
          </div>
        </div>
      </section>

      {/* Cart Drawer */}
      {/* <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      /> */}

      {/* Floating Cart Button - for demo purposes */}
      {/* <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-30"
      >
        <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        {cartItems.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </button> */}
    </>
  );
}
