const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting production seed...");

  try {
    // Create admin user
    const adminPassword = await bcrypt.hash("ChangeMeImmediately!", 10);
    const admin = await prisma.user.upsert({
      where: { email: "admin@everapharm.com" },
      update: {},
      create: {
        email: "admin@everapharm.com",
        password: adminPassword,
        firstName: "Admin",
        lastName: "User",
        role: "ADMIN",
        isActive: true,
      },
    });

    console.log("✅ Admin user created:", admin.email);

    // Create essential categories
    const categories = [
      { 
        name: "Prescription Medications", 
        slug: "prescription-medications", 
        description: "Medications requiring a valid prescription" 
      },
      { 
        name: "Over-the-Counter", 
        slug: "over-the-counter", 
        description: "Medications available without prescription" 
      },
      { 
        name: "Medical Supplies", 
        slug: "medical-supplies", 
        description: "Essential medical supplies and equipment" 
      },
      { 
        name: "Health & Wellness", 
        slug: "health-wellness", 
        description: "Vitamins, supplements, and wellness products" 
      },
    ];

    for (const category of categories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category,
      });
    }

    console.log("✅ Essential categories created");
    console.log("");
    console.log("⚠️  IMPORTANT: Change the admin password immediately after first login!");
    console.log("");
    console.log("📧 Login credentials:");
    console.log("   Email: admin@everapharm.com");
    console.log("   Password: ChangeMeImmediately!");
    
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("❌ Seed error:", error);
  process.exit(1);
}); 