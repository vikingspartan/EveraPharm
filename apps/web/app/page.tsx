import { Hero } from '@/components/home/hero'
import { FeaturedProducts } from '@/components/home/featured-products'
import { WhyChooseUs } from '@/components/home/why-choose-us'
import { ProductCategories } from '@/components/home/product-categories'
import { GlobalReach } from '@/components/home/global-reach'
import { Testimonials } from '@/components/home/testimonials'
import { BecomeDistributor } from '@/components/home/become-distributor'
import { NewsAndUpdates } from '@/components/home/news-updates'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <WhyChooseUs />
      <ProductCategories />
      <GlobalReach />
      <Testimonials />
      <BecomeDistributor />
      <NewsAndUpdates />
    </>
  )
}