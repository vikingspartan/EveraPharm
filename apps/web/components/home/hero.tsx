'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ArrowRight, Shield, Globe, Users, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'

const slides = [
  {
    id: 1,
    title: 'Leading Pharmaceutical Manufacturer',
    subtitle: 'Quality Healthcare Solutions Worldwide',
    description: 'Trusted by distributors in over 65 countries, we deliver high-quality pharmaceuticals, medical devices, and healthcare products.',
    image: '/hero-pharma.jpg',
    cta: { text: 'Explore Products', href: '/products' },
  },
  {
    id: 2,
    title: 'Global Distribution Network',
    subtitle: 'Connecting Healthcare Worldwide',
    description: 'Partner with us to access our extensive product portfolio and benefit from our comprehensive distribution support.',
    image: '/hero-global.jpg',
    cta: { text: 'Become a Distributor', href: '/distributorship' },
  },
  {
    id: 3,
    title: 'Innovation in Healthcare',
    subtitle: 'Advanced Manufacturing Standards',
    description: 'GMP-certified facilities producing over 4,000 products across pharmaceuticals, medical devices, supplements, and veterinary medicines.',
    image: '/hero-innovation.jpg',
    cta: { text: 'Learn More', href: '/about' },
  },
]

const stats = [
  { icon: Globe, value: '65+', label: 'Countries' },
  { icon: Shield, value: '4,000+', label: 'Products' },
  { icon: Users, value: '500+', label: 'Distributors' },
  { icon: Award, value: '20+', label: 'Years Experience' },
]

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative h-[600px] overflow-hidden bg-gray-900 lg:h-[700px]">
      {/* Background slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-gray-900/50" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="container relative z-10 flex h-full flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-4 text-primary"
            >
              <span className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider">
                <Shield className="h-4 w-4" />
                {slides[currentSlide].subtitle}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl"
            >
              {slides[currentSlide].title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8 text-lg text-gray-200 md:text-xl"
            >
              {slides[currentSlide].description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Button asChild size="lg" className="group">
                <Link href={slides[currentSlide].cta.href}>
                  {slides[currentSlide].cta.text}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900">
                <Link href="/contact">
                  Contact Us
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-8 rounded-full transition-all ${
                index === currentSlide ? 'bg-white w-12' : 'bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 py-6 md:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <Icon className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-200">{stat.label}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}