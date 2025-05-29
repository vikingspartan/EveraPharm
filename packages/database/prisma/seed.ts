import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { hashPassword } from '../src/utils'
import { 
  PHARMACEUTICAL_CATEGORIES,
  MEDICAL_DEVICE_CATEGORIES,
  SUPPLEMENT_CATEGORIES,
  DOSAGE_FORMS,
  CERTIFICATIONS,
  PHARMACEUTICAL_STANDARDS
} from '../src/constants'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean existing data
  await prisma.auditLog.deleteMany()
  await prisma.activityLog.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.quoteItem.deleteMany()
  await prisma.quote.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.productDocument.deleteMany()
  await prisma.product.deleteMany()
  await prisma.subcategory.deleteMany()
  await prisma.category.deleteMany()
  await prisma.document.deleteMany()
  await prisma.user.deleteMany()
  await prisma.company.deleteMany()
  
  console.log('✨ Cleaned existing data')

  // Create categories
  const categories = []
  const subcategories = []

  // Pharmaceutical categories
  for (const cat of PHARMACEUTICAL_CATEGORIES) {
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.name.toLowerCase().replace(/\s+/g, '-'),
        description: `${cat.name} products for pharmaceutical use`,
        displayOrder: categories.length,
      },
    })
    categories.push(category)

    for (const subcat of cat.subcategories) {
      const subcategory = await prisma.subcategory.create({
        data: {
          name: subcat,
          slug: subcat.toLowerCase().replace(/\s+/g, '-'),
          categoryId: category.id,
          displayOrder: subcategories.length,
        },
      })
      subcategories.push(subcategory)
    }
  }

  // Medical device categories
  for (const cat of MEDICAL_DEVICE_CATEGORIES) {
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.name.toLowerCase().replace(/\s+/g, '-'),
        description: `Medical devices for ${cat.name.toLowerCase()}`,
        displayOrder: categories.length,
      },
    })
    categories.push(category)

    for (const subcat of cat.subcategories) {
      const subcategory = await prisma.subcategory.create({
        data: {
          name: subcat,
          slug: subcat.toLowerCase().replace(/\s+/g, '-'),
          categoryId: category.id,
          displayOrder: subcategories.length,
        },
      })
      subcategories.push(subcategory)
    }
  }

  console.log(`✅ Created ${categories.length} categories and ${subcategories.length} subcategories`)

  // Create companies
  const companies = []
  
  // Create a few distributor companies
  for (let i = 0; i < 10; i++) {
    const company = await prisma.company.create({
      data: {
        name: faker.company.name(),
        legalName: faker.company.name() + ' LLC',
        registrationNumber: faker.string.alphanumeric(10).toUpperCase(),
        taxId: faker.string.numeric(9),
        website: faker.internet.url(),
        description: faker.company.catchPhrase(),
        
        addressLine1: faker.location.streetAddress(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: faker.location.country(),
        postalCode: faker.location.zipCode(),
        latitude: parseFloat(faker.location.latitude()),
        longitude: parseFloat(faker.location.longitude()),
        
        email: faker.internet.email(),
        phone: faker.phone.number('+1-###-###-####'),
        
        type: 'DISTRIBUTOR',
        status: i < 7 ? 'APPROVED' : 'PENDING',
        tier: i < 2 ? 'GOLD' : i < 5 ? 'SILVER' : 'BRONZE',
        creditLimit: faker.number.int({ min: 10000, max: 1000000 }),
        paymentTerms: faker.helpers.arrayElement([30, 45, 60]),
        
        certifications: [
          {
            type: 'Business License',
            number: faker.string.alphanumeric(8).toUpperCase(),
            expiryDate: faker.date.future().toISOString(),
          },
        ],
        
        onboardedAt: i < 7 ? faker.date.past() : null,
      },
    })
    companies.push(company)
  }

  console.log(`✅ Created ${companies.length} companies`)

  // Create users
  const users = []
  
  // Create admin users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@everapharm.com',
      firstName: 'Admin',
      lastName: 'User',
      authId: 'admin-auth-id',
      role: 'SUPER_ADMIN',
      permissions: [],
      emailVerifiedAt: new Date(),
    },
  })
  users.push(adminUser)

  // Create distributor users
  for (const company of companies.filter(c => c.status === 'APPROVED')) {
    const adminUser = await prisma.user.create({
      data: {
        email: `admin@${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        authId: faker.string.uuid(),
        role: 'DISTRIBUTOR_ADMIN',
        permissions: [],
        companyId: company.id,
        emailVerifiedAt: new Date(),
      },
    })
    users.push(adminUser)

    // Create additional users for some companies
    if (Math.random() > 0.5) {
      const regularUser = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          authId: faker.string.uuid(),
          role: 'DISTRIBUTOR_USER',
          permissions: [],
          companyId: company.id,
          emailVerifiedAt: new Date(),
        },
      })
      users.push(regularUser)
    }
  }

  console.log(`✅ Created ${users.length} users`)

  // Create products
  const products = []
  
  // Pharmaceutical products
  const pharmaNames = [
    'Amoxicillin', 'Paracetamol', 'Ibuprofen', 'Metformin', 'Omeprazole',
    'Amlodipine', 'Atorvastatin', 'Losartan', 'Ceftriaxone', 'Azithromycin',
    'Ciprofloxacin', 'Dexamethasone', 'Diclofenac', 'Fluoxetine', 'Gabapentin',
    'Levothyroxine', 'Lisinopril', 'Metoprolol', 'Prednisone', 'Ranitidine',
  ]

  for (let i = 0; i < 50; i++) {
    const category = faker.helpers.arrayElement(categories.filter(c => 
      PHARMACEUTICAL_CATEGORIES.some(pc => pc.name === c.name)
    ))
    const subcategory = faker.helpers.arrayElement(
      subcategories.filter(s => s.categoryId === category.id)
    )
    
    const productName = faker.helpers.arrayElement(pharmaNames)
    const strength = faker.helpers.arrayElement(['250mg', '500mg', '1000mg', '10mg', '20mg', '50mg'])
    const packSize = faker.helpers.arrayElement(['10x10', '30 tablets', '100 tablets', '10 vials'])
    
    const product = await prisma.product.create({
      data: {
        sku: `PH${faker.string.numeric(6)}`,
        name: `${productName} ${strength}`,
        genericName: productName,
        brandName: faker.helpers.arrayElement(['PharmaCare', 'MediLife', 'HealthPlus', 'WellCure']),
        description: faker.lorem.paragraph(),
        shortDescription: faker.lorem.sentence(),
        
        categoryId: category.id,
        subcategoryId: subcategory.id,
        division: 'PHARMACEUTICALS',
        
        dosageForm: faker.helpers.arrayElement(DOSAGE_FORMS),
        strength: strength,
        packSize: packSize,
        packType: faker.helpers.arrayElement(['Blister', 'Bottle', 'Vial']),
        
        composition: {
          activeIngredients: [
            { name: productName, amount: strength }
          ]
        },
        
        indications: [faker.lorem.sentence(), faker.lorem.sentence()],
        contraindications: [faker.lorem.sentence()],
        sideEffects: [faker.lorem.words(3), faker.lorem.words(3)],
        
        storageConditions: 'Store below 25°C in a dry place',
        shelfLife: '24 months',
        manufacturer: faker.company.name(),
        countryOfOrigin: faker.location.country(),
        
        registrationStatus: {
          US: { status: 'Approved', number: `FDA-${faker.string.numeric(8)}` },
          EU: { status: 'Approved', number: `EMA-${faker.string.numeric(8)}` },
        },
        
        certifications: faker.helpers.arrayElements(CERTIFICATIONS, 3),
        standards: faker.helpers.arrayElements(PHARMACEUTICAL_STANDARDS, 2),
        
        basePrice: faker.number.float({ min: 5, max: 500, precision: 0.01 }),
        costPrice: faker.number.float({ min: 2, max: 200, precision: 0.01 }),
        
        stock: faker.number.int({ min: 0, max: 10000 }),
        reorderLevel: faker.number.int({ min: 100, max: 1000 }),
        moq: faker.helpers.arrayElement([10, 50, 100, 500]),
        leadTime: faker.helpers.arrayElement(['1-2 weeks', '2-3 weeks', '3-4 weeks']),
        
        slug: `${productName}-${strength}`.toLowerCase().replace(/\s+/g, '-'),
        
        status: 'ACTIVE',
        featured: Math.random() > 0.8,
        isNew: Math.random() > 0.7,
        bestSeller: Math.random() > 0.9,
        
        publishedAt: new Date(),
      },
    })
    products.push(product)

    // Add product images
    for (let j = 0; j < faker.number.int({ min: 1, max: 3 }); j++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: `https://picsum.photos/400/400?random=${product.id}-${j}`,
          alt: product.name,
          displayOrder: j,
        },
      })
    }
  }

  console.log(`✅ Created ${products.length} products`)

  // Create orders
  const orders = []
  
  for (let i = 0; i < 30; i++) {
    const company = faker.helpers.arrayElement(companies.filter(c => c.status === 'APPROVED'))
    const user = faker.helpers.arrayElement(users.filter(u => u.companyId === company.id))
    
    if (!user) continue
    
    const orderItems = []
    const itemCount = faker.number.int({ min: 1, max: 5 })
    let subtotal = 0
    
    for (let j = 0; j < itemCount; j++) {
      const product = faker.helpers.arrayElement(products)
      const quantity = faker.number.int({ min: 10, max: 1000 })
      const unitPrice = Number(product.basePrice)
      const totalPrice = unitPrice * quantity
      
      orderItems.push({
        productId: product.id,
        quantity,
        unitPrice,
        discount: 0,
        tax: 0,
        totalPrice,
      })
      
      subtotal += totalPrice
    }
    
    const taxAmount = subtotal * 0.1 // 10% tax
    const shippingAmount = faker.number.float({ min: 50, max: 500, precision: 0.01 })
    const totalAmount = subtotal + taxAmount + shippingAmount
    
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-${faker.string.alphanumeric(4).toUpperCase()}`,
        companyId: company.id,
        userId: user.id,
        
        subtotal,
        discountAmount: 0,
        taxAmount,
        shippingAmount,
        totalAmount,
        currency: 'USD',
        
        shippingAddress: {
          addressLine1: company.addressLine1,
          city: company.city,
          state: company.state,
          country: company.country,
          postalCode: company.postalCode,
        },
        billingAddress: {
          addressLine1: company.addressLine1,
          city: company.city,
          state: company.state,
          country: company.country,
          postalCode: company.postalCode,
        },
        
        paymentStatus: faker.helpers.arrayElement(['PENDING', 'PAID', 'PARTIAL']),
        paymentMethod: faker.helpers.arrayElement(['CREDIT_CARD', 'WIRE_TRANSFER', 'CREDIT_TERMS']),
        
        status: faker.helpers.arrayElement(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED']),
        
        items: {
          create: orderItems,
        },
        
        createdAt: faker.date.recent({ days: 60 }),
      },
    })
    
    orders.push(order)
  }

  console.log(`✅ Created ${orders.length} orders`)

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })