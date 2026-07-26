const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const samplePromos = [
  {
    message: '🎉 50% OFF on all pizzas this weekend! Order now and save big!',
    priority: 3,
    isActive: true,
  },
  {
    message: '🍔 Buy 2 Burgers, Get 1 FREE! Limited time offer!',
    priority: 2,
    isActive: true,
  },
  {
    message: '☀️ Sunday Special: Free delivery on orders above GH₵50',
    priority: 1,
    isActive: true,
  },
  {
    message: '🥗 Healthy Monday: 20% off on all salads and smoothies',
    priority: 1,
    isActive: true,
  },
  {
    message: '🍰 New! Try our fresh desserts - Tiramisu & Cheesecake now available!',
    priority: 0,
    isActive: true,
  },
];

async function seedPromos() {
  console.log('🌱 Seeding promo messages...');

  try {
    // Delete existing promos
    await prisma.promoMessage.deleteMany({});
    console.log('✓ Cleared existing promos');

    // Create new promos
    for (const promo of samplePromos) {
      await prisma.promoMessage.create({
        data: promo,
      });
    }

    console.log(`✓ Created ${samplePromos.length} promo messages`);
    console.log('✅ Promo seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding promos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedPromos();
