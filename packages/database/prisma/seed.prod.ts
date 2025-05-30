import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting production seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('ChangeMeImmediately!', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@everapharm.com' },
    update: {},
    create: {
      email: 'admin@everapharm.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create essential categories only
  const categories = [
    { name: 'Prescription Medications', slug: 'prescription-medications', description: 'Medications requiring a valid prescription' },
    { name: 'Over-the-Counter', slug: 'over-the-counter', description: 'Medications available without prescription' },
    { name: 'Medical Supplies', slug: 'medical-supplies', description: 'Essential medical supplies and equipment' },
    { name: 'Health & Wellness', slug: 'health-wellness', description: 'Vitamins, supplements, and wellness products' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log('✅ Essential categories created');

  // Create a few sample products for testing
  const sampleProducts = [
    {
      sku: 'TEST-001',
      name: 'Sample Product - Remove After Testing',
      description: 'This is a test product. Please remove after deployment verification.',
      manufacturer: 'Test Manufacturer',
      price: 10.00,
      costPrice: 5.00,
      categorySlug: 'over-the-counter',
      requiresPrescription: false,
      isActive: true,
    },
  ];

  for (const product of sampleProducts) {
    const category = await prisma.category.findUnique({
      where: { slug: product.categorySlug },
    });

    if (category) {
      const { categorySlug, ...productData } = product;
      await prisma.product.upsert({
        where: { sku: product.sku },
        update: {},
        create: {
          ...productData,
          categoryId: category.id,
          type: 'MEDICINE',
        },
      });
    }
  }

  console.log('✅ Sample product created for testing');
  console.log('');
  console.log('⚠️  IMPORTANT: Change the admin password immediately after first login!');
  console.log('⚠️  IMPORTANT: Remove test products after deployment verification!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 