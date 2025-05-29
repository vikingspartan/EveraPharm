import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Linkedin, Youtube, Instagram, Mail, Phone, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const footerLinks = {
  products: [
    { name: 'Pharmaceuticals', href: '/products/pharmaceuticals' },
    { name: 'Medical Devices', href: '/products/medical-devices' },
    { name: 'Supplements', href: '/products/supplements' },
    { name: 'Veterinary', href: '/products/veterinary' },
    { name: 'Oncology', href: '/products/oncology' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Manufacturing', href: '/manufacturing' },
    { name: 'Quality Assurance', href: '/quality' },
    { name: 'Certifications', href: '/certifications' },
    { name: 'Careers', href: '/careers' },
  ],
  services: [
    { name: 'Become a Distributor', href: '/distributorship' },
    { name: 'Product Registration', href: '/registration' },
    { name: 'Marketing Support', href: '/marketing-support' },
    { name: 'Supply Chain', href: '/supply-chain' },
    { name: 'FAQs', href: '/faq' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Compliance', href: '/compliance' },
    { name: 'Sitemap', href: '/sitemap' },
  ],
}

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/everapharm' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/everapharm' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/everapharm' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/everapharm' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/everapharm' },
]

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900">
      <div className="container py-12 md:py-16">
        {/* Newsletter */}
        <div className="mb-12 rounded-lg bg-primary p-8 text-primary-foreground">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="mb-2 text-2xl font-bold">Stay Updated</h3>
            <p className="mb-6 text-primary-foreground/90">
              Subscribe to our newsletter for the latest updates on products, industry news, and exclusive offers.
            </p>
            <form className="flex flex-col gap-4 sm:flex-row">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white text-gray-900"
              />
              <Button type="submit" variant="secondary" size="lg">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Main footer content */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Company info */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 flex items-center space-x-2">
              <div className="relative h-10 w-40">
                <Image
                  src="/logo.png"
                  alt="EveraPharma"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="mb-4 text-sm text-muted-foreground">
              Global manufacturer and supplier of pharmaceuticals, medical devices, supplements, 
              and veterinary medicines distributed in more than 65 countries.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href="tel:+1234567890" className="hover:text-primary">+1 234 567 890</a>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href="mailto:info@everapharm.com" className="hover:text-primary">info@everapharm.com</a>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <span>123 Pharma Street, Medical District, NY 10001, USA</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-4 text-sm font-semibold">Products</h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Services</h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom footer */}
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} EveraPharma. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary"
                  aria-label={social.name}
                >
                  <Icon className="h-5 w-5" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}