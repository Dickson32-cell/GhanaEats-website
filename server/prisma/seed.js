import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
  { name: 'Burgers', slug: 'burgers', imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' },
  { name: 'Pizza', slug: 'pizza', imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
  { name: 'Pasta', slug: 'pasta', imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400' },
  { name: 'Drinks', slug: 'drinks', imageUrl: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400' },
  { name: 'Desserts', slug: 'desserts', imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400' },
  { name: 'Sides', slug: 'sides', imageUrl: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400' },
];

const menuItems = [
  // Burgers
  { name: 'Classic Cheeseburger', description: 'Juicy beef patty with cheddar, lettuce, tomato & pickles', price: 12.99, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', category: 'burgers' },
  { name: 'Double Smash Burger', description: 'Two smashed patties, American cheese, special sauce', price: 15.99, imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400', category: 'burgers' },
  { name: 'BBQ Bacon Burger', description: 'Smoky BBQ sauce, crispy bacon, caramelised onions', price: 14.99, imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400', category: 'burgers' },
  { name: 'Veggie Burger', description: 'House-made black bean patty with avocado and sprouts', price: 11.99, imageUrl: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400', category: 'burgers' },
  // Pizza
  { name: 'Margherita', description: 'San Marzano tomato, fresh mozzarella, basil', price: 13.99, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', category: 'pizza' },
  { name: 'Pepperoni', description: 'Classic pepperoni with mozzarella and tomato sauce', price: 15.99, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400', category: 'pizza' },
  { name: 'BBQ Chicken Pizza', description: 'Grilled chicken, BBQ sauce, red onion, coriander', price: 16.99, imageUrl: 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=400', category: 'pizza' },
  { name: 'Four Cheese', description: 'Mozzarella, gorgonzola, parmesan, and gouda', price: 16.49, imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', category: 'pizza' },
  // Pasta
  { name: 'Spaghetti Bolognese', description: 'Slow-cooked beef ragù with parmesan', price: 14.99, imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400', category: 'pasta' },
  { name: 'Penne Arrabbiata', description: 'Spicy tomato sauce with garlic and chilli', price: 12.99, imageUrl: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400', category: 'pasta' },
  { name: 'Creamy Carbonara', description: 'Pancetta, egg yolk, pecorino, black pepper', price: 15.49, imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400', category: 'pasta' },
  { name: 'Pesto Linguine', description: 'Fresh basil pesto, cherry tomatoes, pine nuts', price: 13.49, imageUrl: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400', category: 'pasta' },
  // Drinks
  { name: 'Fresh Lemonade', description: 'Freshly squeezed lemon with mint and ice', price: 3.99, imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400', category: 'drinks' },
  { name: 'Mango Smoothie', description: 'Fresh mango, yoghurt and honey blend', price: 4.99, imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400', category: 'drinks' },
  { name: 'Iced Coffee', description: 'Cold brew over ice with oat milk', price: 4.49, imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', category: 'drinks' },
  { name: 'Sparkling Water', description: 'Chilled sparkling mineral water 500ml', price: 2.49, imageUrl: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?w=400', category: 'drinks' },
  // Desserts
  { name: 'Chocolate Lava Cake', description: 'Warm dark chocolate cake with molten centre', price: 7.99, imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400', category: 'desserts' },
  { name: 'New York Cheesecake', description: 'Classic creamy cheesecake with berry compote', price: 6.99, imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', category: 'desserts' },
  { name: 'Tiramisu', description: 'Classic Italian mascarpone and espresso dessert', price: 7.49, imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', category: 'desserts' },
  // Sides
  { name: 'Crispy Fries', description: 'Double-fried golden fries with sea salt', price: 4.99, imageUrl: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=400', category: 'sides' },
  { name: 'Onion Rings', description: 'Beer-battered onion rings with dipping sauce', price: 5.49, imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=400', category: 'sides' },
  { name: 'Garden Salad', description: 'Mixed greens, cucumber, tomato, balsamic glaze', price: 6.99, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', category: 'sides' },
  { name: 'Garlic Bread', description: 'Toasted sourdough with herb butter and garlic', price: 4.49, imageUrl: 'https://images.unsplash.com/photo-1619985632461-f33748ef4b87?w=400', category: 'sides' },
];

async function main() {
  console.log('Seeding database...');

  // Seed categories
  const categoryMap = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap[cat.slug] = created.id;
  }
  console.log('Categories seeded.');

  // Seed menu items
  for (const item of menuItems) {
    const { category, ...rest } = item;
    await prisma.menuItem.upsert({
      where: { id: (await prisma.menuItem.findFirst({ where: { name: item.name } }))?.id || 'none' },
      update: {},
      create: { ...rest, categoryId: categoryMap[category] },
    });
  }
  console.log('Menu items seeded.');

  // Seed admin user
  const adminEmail = 'admin@foodapp.com';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const hashed = await bcrypt.hash('Admin@1234', 10);
    await prisma.user.create({
      data: { name: 'Admin', email: adminEmail, password: hashed, role: 'ADMIN' },
    });
    console.log('Admin user created: admin@foodapp.com / Admin@1234');
  } else {
    console.log('Admin user already exists.');
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
