import { PrismaClient, UserRole, ProductType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@everapharm.com' },
    update: {},
    create: {
      email: 'admin@everapharm.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      phoneNumber: '+1234567890',
    },
  });
  console.log('✅ Admin user created');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'antibiotics' },
      update: {},
      create: {
        name: 'Antibiotics',
        slug: 'antibiotics',
        description: 'Medications used to treat bacterial infections',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'pain-relief' },
      update: {},
      create: {
        name: 'Pain Relief',
        slug: 'pain-relief',
        description: 'Medications for pain management',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'vitamins-supplements' },
      update: {},
      create: {
        name: 'Vitamins & Supplements',
        slug: 'vitamins-supplements',
        description: 'Nutritional supplements and vitamins',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'cold-flu' },
      update: {},
      create: {
        name: 'Cold & Flu',
        slug: 'cold-flu',
        description: 'Medications for cold and flu symptoms',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'allergy' },
      update: {},
      create: {
        name: 'Allergy',
        slug: 'allergy',
        description: 'Medications for allergy relief',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'digestive-health' },
      update: {},
      create: {
        name: 'Digestive Health',
        slug: 'digestive-health',
        description: 'Medications for digestive issues',
      },
    }),
  ]);
  console.log('✅ Categories created');

  // Create products
  const products = [
    // Antibiotics (Prescription)
    {
      sku: 'AMX-001',
      name: 'Amoxicillin 500mg',
      genericName: 'Amoxicillin',
      description: 'Broad-spectrum antibiotic for bacterial infections',
      type: ProductType.MEDICINE,
      manufacturer: 'PharmaCorp',
      categoryId: categories[0].id,
      price: 12.99,
      costPrice: 8.50,
      activeIngredients: ['Amoxicillin trihydrate'],
      dosageForm: 'Capsule',
      strength: '500mg',
      packSize: '21 capsules',
      requiresPrescription: true,
      images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'],
    },
    {
      sku: 'AZI-001',
      name: 'Azithromycin 250mg Z-Pack',
      genericName: 'Azithromycin',
      description: 'Antibiotic for respiratory and skin infections',
      type: ProductType.MEDICINE,
      manufacturer: 'MediPharm',
      categoryId: categories[0].id,
      price: 24.99,
      costPrice: 18.00,
      activeIngredients: ['Azithromycin dihydrate'],
      dosageForm: 'Tablet',
      strength: '250mg',
      packSize: '6 tablets',
      requiresPrescription: true,
      images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'],
    },

    // Pain Relief (Mixed)
    {
      sku: 'IBU-001',
      name: 'Ibuprofen 200mg',
      genericName: 'Ibuprofen',
      description: 'Non-steroidal anti-inflammatory drug for pain relief',
      type: ProductType.MEDICINE,
      manufacturer: 'HealthCare Plus',
      categoryId: categories[1].id,
      price: 7.99,
      costPrice: 4.50,
      activeIngredients: ['Ibuprofen'],
      dosageForm: 'Tablet',
      strength: '200mg',
      packSize: '50 tablets',
      requiresPrescription: false,
      images: ['https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400'],
    },
    {
      sku: 'TYL-001',
      name: 'Tylenol Extra Strength',
      genericName: 'Acetaminophen',
      description: 'Pain reliever and fever reducer',
      type: ProductType.MEDICINE,
      manufacturer: 'Johnson & Johnson',
      categoryId: categories[1].id,
      price: 9.99,
      costPrice: 6.50,
      activeIngredients: ['Acetaminophen'],
      dosageForm: 'Caplet',
      strength: '500mg',
      packSize: '100 caplets',
      requiresPrescription: false,
      images: ['https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400'],
    },

    // Vitamins & Supplements (OTC)
    {
      sku: 'VTC-001',
      name: 'Vitamin C 1000mg',
      genericName: 'Ascorbic Acid',
      description: 'Immune system support supplement',
      type: ProductType.SUPPLEMENT,
      manufacturer: 'NatureHealth',
      categoryId: categories[2].id,
      price: 14.99,
      costPrice: 9.00,
      activeIngredients: ['Ascorbic Acid'],
      dosageForm: 'Tablet',
      strength: '1000mg',
      packSize: '60 tablets',
      requiresPrescription: false,
      images: ['https://images.unsplash.com/photo-1608133015428-27b1c661e0b5?w=400'],
    },
    {
      sku: 'VTD-001',
      name: 'Vitamin D3 2000IU',
      genericName: 'Cholecalciferol',
      description: 'Bone health and immune support',
      type: ProductType.SUPPLEMENT,
      manufacturer: 'VitaWell',
      categoryId: categories[2].id,
      price: 11.99,
      costPrice: 7.50,
      activeIngredients: ['Cholecalciferol'],
      dosageForm: 'Softgel',
      strength: '2000IU',
      packSize: '90 softgels',
      requiresPrescription: false,
      images: ['https://images.unsplash.com/photo-1608133015428-27b1c661e0b5?w=400'],
    },

    // Cold & Flu (OTC)
    {
      sku: 'DYQ-001',
      name: 'DayQuil Cold & Flu',
      genericName: 'Acetaminophen, Dextromethorphan, Phenylephrine',
      description: 'Multi-symptom cold and flu relief',
      type: ProductType.MEDICINE,
      manufacturer: 'Procter & Gamble',
      categoryId: categories[3].id,
      price: 12.99,
      costPrice: 8.50,
      activeIngredients: ['Acetaminophen', 'Dextromethorphan HBr', 'Phenylephrine HCl'],
      dosageForm: 'Liquid',
      strength: '325mg/10mg/5mg per 15mL',
      packSize: '236mL',
      requiresPrescription: false,
      images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400'],
    },

    // Allergy (OTC)
    {
      sku: 'CLR-001',
      name: 'Claritin 24 Hour',
      genericName: 'Loratadine',
      description: 'Non-drowsy antihistamine for allergy relief',
      type: ProductType.MEDICINE,
      manufacturer: 'Bayer',
      categoryId: categories[4].id,
      price: 18.99,
      costPrice: 12.00,
      activeIngredients: ['Loratadine'],
      dosageForm: 'Tablet',
      strength: '10mg',
      packSize: '30 tablets',
      requiresPrescription: false,
      images: ['https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400'],
    },

    // Digestive Health (OTC)
    {
      sku: 'PPC-001',
      name: 'Pepcid AC Maximum Strength',
      genericName: 'Famotidine',
      description: 'Acid reducer for heartburn relief',
      type: ProductType.MEDICINE,
      manufacturer: 'Johnson & Johnson',
      categoryId: categories[5].id,
      price: 13.99,
      costPrice: 9.00,
      activeIngredients: ['Famotidine'],
      dosageForm: 'Tablet',
      strength: '20mg',
      packSize: '25 tablets',
      requiresPrescription: false,
      images: ['https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400'],
    },
  ];

  // Create products and their inventory
  for (const productData of products) {
    const product = await prisma.product.create({
      data: productData,
    });

    // Create inventory for each product
    await prisma.inventory.create({
      data: {
        productId: product.id,
        totalQuantity: Math.floor(Math.random() * 100) + 50,
        availableQuantity: Math.floor(Math.random() * 100) + 50,
        reservedQuantity: 0,
        reorderLevel: 20,
        reorderQuantity: 100,
      },
    });
  }
  console.log('✅ Products created');

  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 