const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedFeatured() {
  console.log('Seeding featured items...');

  // Get some menu items to feature
  const menuItems = await prisma.menuItem.findMany({ take: 5 });

  if (menuItems.length === 0) {
    console.log('No menu items found. Please run the main seed first.');
    return;
  }

  // Create featured items
  for (let i = 0; i < menuItems.length; i++) {
    await prisma.featuredItem.upsert({
      where: { position: i + 1 },
      update: {
        menuItemId: menuItems[i].id,
        isActive: true
      },
      create: {
        menuItemId: menuItems[i].id,
        position: i + 1,
        isActive: true
      }
    });
  }

  console.log(`✅ Featured ${menuItems.length} items`);
}

seedFeatured()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
