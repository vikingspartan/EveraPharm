'use client';

// import { useState } from 'react';
import Link from "next/link";
// import Image from "next/image";
// import HeroSection from '../components/home/HeroSection';
// import ProductCard from '../components/products/ProductCard';
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

export default function HomePage() {
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
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
          }}></div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Welcome to EveraPharm
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              We are a leading global pharmaceutical and healthcare distributor.
            </p>
            <div className="space-y-4">
              <p className="text-lg text-blue-200">
                We partner with manufacturers to distribute more than 4,000 medical products globally
              </p>
              <p className="text-lg text-blue-200">
                We excel at getting our products to those that need them most
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Products</h2>
            <p className="text-xl text-gray-600">
              We have an extensive and diverse portfolio of superior quality, affordable products.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pharmaceuticals */}
            <Link href="/products/pharmaceuticals" className="group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full">
                <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <svg className="h-20 w-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Pharmaceuticals</h3>
                  <p className="text-gray-600 mb-4">Therapies to cure diseases and intervene in chronic illnesses</p>
                  <span className="text-blue-600 font-medium group-hover:text-blue-700">Browse Products →</span>
                </div>
              </div>
            </Link>

            {/* Medical Devices */}
            <Link href="/products/medical-devices" className="group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full">
                <div className="h-48 bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <svg className="h-20 w-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Medical Devices</h3>
                  <p className="text-gray-600 mb-4">Diagnostic detection, medical wear, injection instruments and wound care supplies</p>
                  <span className="text-blue-600 font-medium group-hover:text-blue-700">Browse Products →</span>
                </div>
              </div>
            </Link>

            {/* Supplements */}
            <Link href="/products/supplements" className="group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full">
                <div className="h-48 bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <svg className="h-20 w-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Supplements</h3>
                  <p className="text-gray-600 mb-4">Vitamins, minerals and herbal formulations for a healthier life</p>
                  <span className="text-blue-600 font-medium group-hover:text-blue-700">Browse Products →</span>
                </div>
              </div>
            </Link>

            {/* Veterinary */}
            <Link href="/products/veterinary" className="group">
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full">
                <div className="h-48 bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <svg className="h-20 w-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Veterinary</h3>
                  <p className="text-gray-600 mb-4">Animal health solutions for large animals and companion pets</p>
                  <span className="text-blue-600 font-medium group-hover:text-blue-700">Browse Products →</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Become a Distributor CTA */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Become a Distributor Today</h2>
            <p className="text-xl text-blue-100 mb-8">Let's transform the standards of healthcare</p>
            <p className="text-lg max-w-3xl mx-auto mb-8 text-blue-200">
              We provide the best value to our partners by focusing on high quality, affordable products 
              and customized market-specific solutions. Join our established global network of distributors, 
              hospitals, pharmacies and institutions.
            </p>
            <Link href="/distribute-with-us" className="inline-flex items-center px-8 py-4 bg-white text-blue-900 font-bold rounded-md hover:bg-gray-100 transition-colors text-lg">
              Apply Now
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why EveraPharm */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why EveraPharm?</h2>
            <p className="text-xl text-gray-600">
              As an industry leader, we are aware of our responsibility to provide affordable 
              and sustainable solutions to improve healthcare worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 text-blue-600 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">High Quality Affordable Products</h3>
            </div>

            <div className="text-center">
              <div className="mx-auto h-16 w-16 text-blue-600 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Globally Recognized Brands</h3>
            </div>

            <div className="text-center">
              <div className="mx-auto h-16 w-16 text-blue-600 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Wide Product Range</h3>
            </div>

            <div className="text-center">
              <div className="mx-auto h-16 w-16 text-blue-600 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Regulatory Affairs Expertise</h3>
            </div>

            <div className="text-center">
              <div className="mx-auto h-16 w-16 text-blue-600 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Flexible Production Lines</h3>
            </div>

            <div className="text-center">
              <div className="mx-auto h-16 w-16 text-blue-600 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Marketing & Logistics Support</h3>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/about" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
              Learn More
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Customer Voices</h2>
            <p className="text-xl text-gray-600">
              We focus on our customers and their needs to develop mutually beneficial partnerships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="mb-4">
                <svg className="h-10 w-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-6">
                For us, building relationships is the most important aspect. EveraPharm has made this possible 
                and now we have a portfolio of established brands in the West African Region. As an experienced 
                manufacturer, EveraPharm understands us and our clients in the best way possible. 
                We are very satisfied with them as partners.
              </p>
              <div>
                <p className="font-semibold text-gray-900">J. Boadu</p>
                <p className="text-sm text-gray-600">CEO Institutional Procurement West Africa Region</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="mb-4">
                <svg className="h-10 w-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-6">
                We have been working with EveraPharm for the past 8 years and we are highly satisfied. 
                The benefit to our business is the convenience and simplicity EveraPharm offers. 
                Instead of having to source products from different suppliers, we just have one partner, 
                saving time and money.
              </p>
              <div>
                <p className="font-semibold text-gray-900">Dr. Mohsin K.</p>
                <p className="text-sm text-gray-600">VP Sales Pharmaceutical Distributor Middle East Region</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="mb-4">
                <svg className="h-10 w-10 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>
              <p className="text-gray-600 mb-6">
                As the COVID pandemic emerged, 2020 was a year defined by perseverance. We were lucky enough 
                that EveraPharm supported us with their expertise and resources. Together we developed 
                the ability to adapt amid the uncertainty of the pandemic; and from all barriers we created 
                an opportunity.
              </p>
              <div>
                <p className="font-semibold text-gray-900">T.P. Tran</p>
                <p className="text-sm text-gray-600">CPO Veterinary Distributor SE Asia Region</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
            <p className="text-xl text-blue-100">
              Talk with a sales advisor to create a customized quotation. Here's how you can reach us...
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-4">Contact Form</h3>
                <p className="text-blue-100 mb-6">
                  Send us your <strong className="text-white">inquiries</strong> about product distribution or registration.
                </p>
                <Link href="/contact" className="inline-flex items-center px-6 py-3 bg-white text-blue-900 font-bold rounded-md hover:bg-gray-100 transition-colors">
                  Submit
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-4">Chat with Us</h3>
                <p className="text-blue-100 mb-6">
                  Reach us <strong className="text-white">via chat</strong> with product or company related questions.
                </p>
                <button className="inline-flex items-center px-6 py-3 bg-white text-blue-900 font-bold rounded-md hover:bg-gray-100 transition-colors">
                  Chat
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
