import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

const ghanaMenuData = {
  categories: [
    {
      name: 'Rice Dishes',
      slug: 'rice-dishes',
      tagline: 'Rice done the Ghana way — bold, saucy, and unforgettable.',
      description: 'From party jollof that starts friendly debates to waakye wrapped in banana leaf on the street corner, rice is the canvas and our sauces are the masterpiece. Pick your favourite and load it up.',
      imageUrl: 'https://images.unsplash.com/photo-1604908554049-29c4d3a5c66d?w=600',
      dishes: [
        {
          name: 'Ghana Jollof Rice',
          description: 'The one that wins every argument. Smoky, tomato-rich rice cooked low and slow with spices that hit different.',
          price: 15.00,
          tags: ['Popular', 'Party Favourite'],
          spiceLevel: 2,
          pairsWith: 'Fried chicken, grilled tilapia, coleslaw, shito',
          imageUrl: 'https://images.unsplash.com/photo-1604908176991-6c7c5c17c15c?w=600'
        },
        {
          name: 'Waakye',
          description: 'Rice and beans stained deep red with millet leaves — a street food legend. Comes loaded with all the sides you love.',
          price: 15.00,
          tags: ['Street Classic', 'Best Seller'],
          spiceLevel: 1,
          pairsWith: 'Shito, spaghetti (talia), fried plantain, gari, boiled eggs, wele',
          imageUrl: 'https://images.unsplash.com/photo-1633934542430-090599cc3c46?w=600'
        },
        {
          name: 'Fried Rice',
          description: 'Ghana-style fried rice tossed with vegetables, soy sauce, and plenty of flavour. Not your regular takeout fried rice.',
          price: 18.00,
          tags: ['Quick Bite'],
          spiceLevel: 1,
          pairsWith: 'Grilled chicken, fried chicken, spring rolls',
          imageUrl: 'https://images.unsplash.com/photo-1603133872848-4d4f9b6dc6e8?w=600'
        },
        {
          name: 'Plain Rice & Stew',
          description: 'Simple but deadly. Fluffy white rice swimming in rich tomato stew with your choice of protein. Comfort in a bowl.',
          price: 12.00,
          tags: ['Comfort Food'],
          spiceLevel: 2,
          pairsWith: 'Beef, chicken, fish, boiled egg',
          imageUrl: 'https://images.unsplash.com/photo-1546069661-7ac2c4e3a13e?w=600'
        },
        {
          name: 'Angwamu (Oil Rice)',
          description: 'Fragrant one-pot rice cooked in seasoned oil with onions. Looks humble, tastes incredible. Baby rice for the grown-ups too.',
          price: 10.00,
          tags: ['Homestyle'],
          spiceLevel: 1,
          pairsWith: 'Sardines, boiled eggs, shito, pepper sauce',
          imageUrl: 'https://images.unsplash.com/photo-1601050690597-cf6b8a91d9bf?w=600'
        },
        {
          name: 'Omo Tuo (Rice Balls)',
          description: 'Soft, pillowy rice balls that soak up every drop of soup. The perfect vehicle for groundnut soup or palm nut soup.',
          price: 20.00,
          tags: ['Traditional'],
          spiceLevel: 1,
          pairsWith: 'Groundnut soup, palm nut soup',
          imageUrl: 'https://images.unsplash.com/photo-1635105684003-7d3a1b1e0e6c?w=600'
        }
      ]
    },
    {
      name: 'Swallows & Soups',
      slug: 'swallows-soups',
      tagline: 'Tear, dip, swallow, repeat. That\'s how we do it.',
      description: 'No spoon needed — just your hands, a bowl of rich soup, and one of our freshly prepared swallows. Whether you\'re team fufu or team banku, we\'ve got you covered with soups that will make you close your eyes and nod.',
      imageUrl: 'https://images.unsplash.com/photo-1604908554049-29c4d3a5c66d?w=600',
      dishes: [
        {
          name: 'Fufu & Light Soup',
          description: 'Pounded cassava and plantain in a peppery, aromatic goat or chicken light soup. The Akan classic that never misses.',
          price: 25.00,
          tags: ['Must Try', 'Weekend Special'],
          spiceLevel: 3,
          proteinOptions: 'Goat, chicken, assorted meat, snail',
          imageUrl: 'https://images.unsplash.com/photo-1633934542430-090599cc3c46?w=600'
        },
        {
          name: 'Fufu & Groundnut Soup (Nkate Nkwan)',
          description: 'Creamy, nutty groundnut soup with tender meat, paired with smooth fufu. Rich, thick, and absolutely heavenly.',
          price: 25.00,
          tags: ['Fan Favourite'],
          spiceLevel: 2,
          proteinOptions: 'Chicken, goat, beef',
          imageUrl: 'https://images.unsplash.com/photo-1601050690597-cf6b8a91d9bf?w=600'
        },
        {
          name: 'Fufu & Palm Nut Soup',
          description: 'Deep orange palm nut soup loaded with crab, fish, or bushmeat. Earthy, rich, and full-bodied flavour.',
          price: 28.00,
          tags: ['Traditional'],
          spiceLevel: 2,
          proteinOptions: 'Crab, fish, bushmeat, snail',
          imageUrl: 'https://images.unsplash.com/photo-1635105684003-7d3a1b1e0e6c?w=600'
        },
        {
          name: 'Banku & Tilapia',
          description: 'Fermented corn-cassava dough with perfectly grilled tilapia, fresh pepper, tomatoes, and onions. Coastal Ghana on a plate.',
          price: 30.00,
          tags: ['Best Seller', 'Street Classic'],
          spiceLevel: 3,
          pairsWith: 'Grilled pepper, shito, sliced onions & tomatoes',
          imageUrl: 'https://images.unsplash.com/photo-1559737558-2f5f35c450e8?w=600'
        },
        {
          name: 'Banku & Okro Soup',
          description: 'Smooth banku meets thick, draw-style okro soup with smoked fish and crab. Slimy in the best way possible.',
          price: 22.00,
          tags: ['Comfort Food'],
          spiceLevel: 2,
          proteinOptions: 'Smoked fish, crab, assorted meat',
          imageUrl: 'https://images.unsplash.com/photo-1604908176991-6c7c5c17c15c?w=600'
        },
        {
          name: 'Tuo Zaafi (TZ) & Ayoyo Soup',
          description: 'Northern Ghana\'s pride — soft corn-cassava paste with a herb-rich ayoyo or okro soup. The dawadawa flavour is unmatched.',
          price: 23.00,
          tags: ['Northern Special'],
          spiceLevel: 2,
          proteinOptions: 'Beef, guinea fowl, dried fish',
          imageUrl: 'https://images.unsplash.com/photo-1633934542430-090599cc3c46?w=600'
        },
        {
          name: 'Akple & Fetri Detsi (Okra Soup)',
          description: 'Ewe tradition at its finest. Smooth corn flour swallow paired with a rich okra soup cooked with smoked fish and crab.',
          price: 22.00,
          tags: ['Regional Favourite'],
          spiceLevel: 2,
          proteinOptions: 'Smoked fish, crab, wele',
          imageUrl: 'https://images.unsplash.com/photo-1601050690597-cf6b8a91d9bf?w=600'
        },
        {
          name: 'Konkonte & Groundnut Soup',
          description: 'Dried cassava flour swallow with a thick groundnut soup. Old-school vibes, timeless taste.',
          price: 20.00,
          tags: ['Homestyle'],
          spiceLevel: 2,
          proteinOptions: 'Goat, chicken, dried fish',
          imageUrl: 'https://images.unsplash.com/photo-1635105684003-7d3a1b1e0e6c?w=600'
        }
      ]
    },
    {
      name: 'Snacks & Sides',
      slug: 'snacks-sides',
      tagline: 'Small chops, big flavour. Perfect for snacking or stacking your order.',
      description: 'The best part about Ghana food? The sides might steal the whole show. Crunchy kelewele, smoky suya, crispy spring rolls — grab them solo or pile them onto your main. No judgment.',
      imageUrl: 'https://images.unsplash.com/photo-1604908554049-29c4d3a5c66d?w=600',
      dishes: [
        {
          name: 'Kelewele',
          description: 'Ripe plantain chunks spiced with ginger, chili, and cloves, then deep-fried to golden perfection. Sweet, spicy, crunchy — all at once.',
          price: 8.00,
          tags: ['Popular', 'Snack King'],
          spiceLevel: 2,
          pairsWith: 'Jollof, beans, or solo snacking',
          imageUrl: 'https://images.unsplash.com/photo-1605195843136-8b7c5c17c15c?w=600'
        },
        {
          name: 'Fried Plantain (Kaklo)',
          description: 'Sweet ripe plantain sliced and fried until caramelized. Simple, golden, and absolutely addictive.',
          price: 6.00,
          tags: ['Side Dish'],
          spiceLevel: 0,
          pairsWith: 'Red red, stews, or on its own',
          imageUrl: 'https://images.unsplash.com/photo-1546069661-7ac2c4e3a13e?w=600'
        },
        {
          name: 'Fried Yam & Pepper Sauce',
          description: 'Crispy on the outside, fluffy inside. Served with a fiery fresh pepper sauce that brings it all together.',
          price: 10.00,
          tags: ['Street Classic'],
          spiceLevel: 3,
          pairsWith: 'Pepper sauce',
          imageUrl: 'https://images.unsplash.com/photo-1603133872848-4d4f9b6dc6e8?w=600'
        },
        {
          name: 'Suya (Kyinkyinga)',
          description: 'Smoky grilled meat skewers rubbed in groundnut spice mix (tankora). Charcoal-kissed and impossible to eat just one.',
          price: 12.00,
          tags: ['BBQ Favourite'],
          spiceLevel: 2,
          proteinOptions: 'Beef, chicken, guinea fowl',
          imageUrl: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600'
        },
        {
          name: 'Spring Rolls',
          description: 'Crispy, golden rolls packed with seasoned vegetables (and meat if you like). Perfect grab-and-go snack.',
          price: 5.00,
          tags: ['Quick Bite'],
          spiceLevel: 1,
          imageUrl: 'https://images.unsplash.com/photo-1605195843136-8b7c5c17c15c?w=600'
        },
        {
          name: 'Koose (Bean Fritters)',
          description: 'Black-eyed pea fritters seasoned with ginger and Scotch bonnet, fried until crispy. A breakfast champ that works any time of day.',
          price: 7.00,
          tags: ['Breakfast', 'Snack'],
          spiceLevel: 2,
          pairsWith: 'Koko (porridge), bread, or solo',
          imageUrl: 'https://images.unsplash.com/photo-1601050690597-cf6b8a91d9bf?w=600'
        },
        {
          name: 'Bofrot (Puff Puff)',
          description: 'Soft, pillowy fried dough balls dusted with sugar. Ghana\'s favourite sweet snack — light, airy, and dangerously easy to finish.',
          price: 5.00,
          tags: ['Sweet Treat'],
          spiceLevel: 0,
          imageUrl: 'https://images.unsplash.com/photo-1605195843136-8b7c5c17c15c?w=600'
        },
        {
          name: 'Boiled Eggs (Add-on)',
          description: 'The universal Ghana food topper. Add boiled eggs to your waakye, red red, or any stew.',
          price: 2.00,
          tags: ['Add-on'],
          spiceLevel: 0,
          imageUrl: 'https://images.unsplash.com/photo-1603133872848-4d4f9b6dc6e8?w=600'
        }
      ]
    },
    {
      name: 'Stews & One-Pots',
      slug: 'stews-one-pots',
      tagline: 'Where the real flavour lives — slow-cooked, palm oil-rich, and deeply satisfying.',
      description: 'A proper Ghana stew is an event. Hours of cooking, layers of flavour, and the kind of aroma that calls the neighbours over. These stews come with your choice of sides — rice, yam, plantain, or bread.',
      imageUrl: 'https://images.unsplash.com/photo-1604908554049-29c4d3a5c66d?w=600',
      dishes: [
        {
          name: 'Red Red (Bean Stew)',
          description: 'Black-eyed peas simmered in palm oil with tomatoes, onions, and spices. Served with fried plantain for that classic combo.',
          price: 12.00,
          tags: ['Comfort Food', 'Vegetarian Friendly'],
          spiceLevel: 2,
          pairsWith: 'Fried plantain, gari, bread',
          imageUrl: 'https://images.unsplash.com/photo-1546069661-7ac2c4e3a13e?w=600'
        },
        {
          name: 'Garden Egg Stew',
          description: 'Creamy stew made from African eggplant (garden eggs) with smoked fish and palm oil. Pairs beautifully with boiled yam.',
          price: 15.00,
          tags: ['Traditional'],
          spiceLevel: 1,
          pairsWith: 'Boiled yam, boiled plantain, bread',
          imageUrl: 'https://images.unsplash.com/photo-1601050690597-cf6b8a91d9bf?w=600'
        },
        {
          name: 'Kontomire Stew (Palava Sauce)',
          description: 'Cocoyam leaf stew with dried fish, palm oil, and tomatoes. Green, nutritious, and packed with earthy flavour.',
          price: 14.00,
          tags: ['Healthy Choice'],
          spiceLevel: 2,
          pairsWith: 'Ampesi (boiled yam/plantain), rice',
          imageUrl: 'https://images.unsplash.com/photo-1603133872848-4d4f9b6dc6e8?w=600'
        },
        {
          name: 'Yam Pottage (Ampesi Stew)',
          description: 'Chunky yams slow-cooked with tomatoes, peppers, onions, smoked fish, and palm oil. Hearty one-pot goodness.',
          price: 16.00,
          tags: ['Homestyle'],
          spiceLevel: 2,
          imageUrl: 'https://images.unsplash.com/photo-1604908176991-6c7c5c17c15c?w=600'
        },
        {
          name: 'Okro Stew',
          description: 'Thick, rich okra stew cooked in palm oil with assorted meat and fish. Perfect over rice or alongside banku.',
          price: 15.00,
          tags: ['Fan Favourite'],
          spiceLevel: 2,
          proteinOptions: 'Assorted meat, smoked fish, crab',
          imageUrl: 'https://images.unsplash.com/photo-1633934542430-090599cc3c46?w=600'
        },
        {
          name: 'Groundnut Soup',
          description: 'Creamy peanut-based soup with tender meat in a rich, nutty broth. One of Ghana\'s most loved soups — period.',
          price: 18.00,
          tags: ['Must Try'],
          spiceLevel: 2,
          pairsWith: 'Fufu, rice balls, rice',
          imageUrl: 'https://images.unsplash.com/photo-1601050690597-cf6b8a91d9bf?w=600'
        }
      ]
    },
    {
      name: 'Breakfast & Porridges',
      slug: 'breakfast-porridges',
      tagline: 'Start your morning the Ghana way — warm, filling, and ready to fuel your day.',
      description: 'Forget cereal. Ghana breakfast hits different. A warm bowl of spiced porridge with koose on the side, or hot kenkey with pepper and fish — this is how you start a proper day.',
      imageUrl: 'https://images.unsplash.com/photo-1604908554049-29c4d3a5c66d?w=600',
      dishes: [
        {
          name: 'Hausa Koko (Millet Porridge)',
          description: 'Warm, spiced millet porridge with a slight tang from fermentation. Best enjoyed with koose or bread on the side.',
          price: 6.00,
          tags: ['Breakfast Staple'],
          spiceLevel: 1,
          pairsWith: 'Koose, bread, bofrot',
          imageUrl: 'https://images.unsplash.com/photo-1605195843136-8b7c5c17c15c?w=600'
        },
        {
          name: 'Koko (Corn Porridge)',
          description: 'Smooth, fermented corn porridge with a subtle tang. Add sugar and milk to taste. A morning essential.',
          price: 5.00,
          tags: ['Breakfast Staple'],
          spiceLevel: 1,
          pairsWith: 'Koose, bofrot',
          imageUrl: 'https://images.unsplash.com/photo-1601050690597-cf6b8a91d9bf?w=600'
        },
        {
          name: 'Tom Brown (Roasted Corn Porridge)',
          description: 'Nutty, roasted corn and groundnut porridge that\'s thick, filling, and packed with protein. The energy-booster breakfast.',
          price: 7.00,
          tags: ['Healthy Choice'],
          spiceLevel: 0,
          imageUrl: 'https://images.unsplash.com/photo-1603133872848-4d4f9b6dc6e8?w=600'
        },
        {
          name: 'Tea & Bread (Breakfast Combo)',
          description: 'Hot tea (Lipton or Milo) with buttered bread, omelette, or fried eggs. Quick, classic, no-fuss morning fuel.',
          price: 8.00,
          tags: ['Quick Bite'],
          spiceLevel: 0,
          imageUrl: 'https://images.unsplash.com/photo-1546069661-7ac2c4e3a13e?w=600'
        },
        {
          name: 'Kenkey & Fried Fish (Breakfast Style)',
          description: 'Warm kenkey with crispy fried fish, fresh pepper sauce, and sliced onions. A full-force morning meal that keeps you going.',
          price: 15.00,
          tags: ['Heavy Breakfast'],
          spiceLevel: 3,
          pairsWith: 'Fresh pepper sauce, sliced onions',
          imageUrl: 'https://images.unsplash.com/photo-1559737558-2f5f35c450e8?w=600'
        }
      ]
    },
    {
      name: 'Drinks',
      slug: 'drinks',
      tagline: 'Wash it all down with something cold, sweet, or refreshing.',
      description: 'Every great meal deserves a great drink. Cool off with a cold beverage to complete your Ghana food experience.',
      imageUrl: 'https://images.unsplash.com/photo-1604908554049-29c4d3a5c66d?w=600',
      dishes: [
        {
          name: 'Coca-Cola',
          description: 'Classic Coke, ice cold.',
          price: 3.00,
          tags: ['Refreshing'],
          spiceLevel: 0,
          imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600'
        },
        {
          name: 'Fanta',
          description: 'Orange Fanta, perfectly chilled.',
          price: 3.00,
          tags: ['Refreshing'],
          spiceLevel: 0,
          imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600'
        },
        {
          name: 'Sprite',
          description: 'Crisp lemon-lime soda.',
          price: 3.00,
          tags: ['Refreshing'],
          spiceLevel: 0,
          imageUrl: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=600'
        },
        {
          name: 'Bottled Water',
          description: 'Pure drinking water.',
          price: 2.00,
          tags: ['Essential'],
          spiceLevel: 0,
          imageUrl: 'https://images.unsplash.com/photo-1560023907-5f339617ea30?w=600'
        },
        {
          name: 'Malta Guinness',
          description: 'Rich, non-alcoholic malt drink.',
          price: 4.00,
          tags: ['Popular'],
          spiceLevel: 0,
          imageUrl: 'https://images.unsplash.com/photo-1603133872848-4d4f9b6dc6e8?w=600'
        },
        {
          name: 'Alvaro (Non-Alcoholic Wine)',
          description: 'Sweet non-alcoholic wine, Ghana favorite.',
          price: 5.00,
          tags: ['Sweet'],
          spiceLevel: 0,
          imageUrl: 'https://images.unsplash.com/photo-1605195843136-8b7c5c17c15c?w=600'
        }
      ]
    },
    {
      name: 'Extras & Add-ons',
      slug: 'extras-addons',
      tagline: 'Level up your meal with these essential extras.',
      description: 'The finishing touches that take your meal from good to unforgettable.',
      imageUrl: 'https://images.unsplash.com/photo-1604908554049-29c4d3a5c66d?w=600',
      dishes: [
        {
          name: 'Shito (Hot Pepper Sauce)',
          description: 'Ghana\'s legendary dark chili sauce made with dried fish, prawns, and spices. A little goes a long way.',
          price: 2.00,
          tags: ['Essential Condiment'],
          spiceLevel: 3,
          imageUrl: 'https://images.unsplash.com/photo-1603133872848-4d4f9b6dc6e8?w=600'
        },
        {
          name: 'Extra Grilled Chicken',
          description: 'Add grilled chicken to any dish.',
          price: 8.00,
          tags: ['Add-on'],
          spiceLevel: 0,
          imageUrl: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600'
        },
        {
          name: 'Extra Fried Fish',
          description: 'Add fried fish to any dish.',
          price: 10.00,
          tags: ['Add-on'],
          spiceLevel: 0,
          imageUrl: 'https://images.unsplash.com/photo-1559737558-2f5f35c450e8?w=600'
        },
        {
          name: 'Extra Goat Meat',
          description: 'Add tender goat meat to any dish.',
          price: 12.00,
          tags: ['Add-on'],
          spiceLevel: 0,
          imageUrl: 'https://images.unsplash.com/photo-1601050690597-cf6b8a91d9bf?w=600'
        },
        {
          name: 'Wele (Cowhide)',
          description: 'Add chewy, flavorful wele to any dish.',
          price: 6.00,
          tags: ['Add-on'],
          spiceLevel: 0,
          imageUrl: 'https://images.unsplash.com/photo-1604908176991-6c7c5c17c15c?w=600'
        },
        {
          name: 'Gari (Dried Cassava)',
          description: 'Sprinkle some gari on your beans, stew, or waakye. Crunchy texture, classic move.',
          price: 1.00,
          tags: ['Add-on'],
          spiceLevel: 0,
          imageUrl: 'https://images.unsplash.com/photo-1603133872848-4d4f9b6dc6e8?w=600'
        },
        {
          name: 'Extra Fried Plantain',
          description: 'Because you always want more plantain. Golden, sweet, perfectly fried.',
          price: 4.00,
          tags: ['Add-on'],
          spiceLevel: 0,
          imageUrl: 'https://images.unsplash.com/photo-1546069661-7ac2c4e3a13e?w=600'
        }
      ]
    }
  ]
};

async function main() {
  console.log('🇬🇭 Starting Ghana Eats menu seeding...\n');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.orderItem.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.featuredItem.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  console.log('✅ Existing data cleared\n');

  // Seed categories and menu items
  console.log('📝 Seeding Ghana menu...');

  for (const categoryData of ghanaMenuData.categories) {
    const { dishes, ...categoryInfo } = categoryData;

    console.log(`\n📂 Creating category: ${categoryInfo.name}`);
    const category = await prisma.category.create({
      data: categoryInfo
    });

    console.log(`   ✅ Category created: ${category.name}`);
    // Create menu items for this category
    for (const dish of dishes) {
      const menuItem = await prisma.menuItem.create({
        data: {
          ...dish,
          categoryId: category.id,
          isAvailable: true
        }
      });
      console.log(`   ├─ ${menuItem.name} - GH₵${menuItem.price}`);
    }
  }

  // Seed admin user
  const adminEmail = 'admin@foodapp.com';
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existing) {
    const hashed = await bcrypt.hash('Admin@1234', 10);
    await prisma.user.create({
      data: { name: 'Admin', email: adminEmail, password: hashed, role: 'ADMIN' },
    });
    console.log('\n👤 Admin user created: admin@foodapp.com / Admin@1234');
  } else {
    console.log('\n👤 Admin user already exists.');
  }

  // Seed featured items (pick popular dishes for the homepage)
  console.log('\n⭐ Seeding featured items...');
  await prisma.featuredItem.deleteMany();

  const popularItems = await prisma.menuItem.findMany({
    where: {
      name: {
        in: [
          'Ghana Jollof Rice',
          'Waakye',
          'Fufu & Light Soup',
          'Banku & Tilapia',
          'Kelewele',
          'Red Red (Bean Stew)',
          'Okro Stew',
          'Kenkey & Fried Fish (Breakfast Style)',
          'Hausa Koko (Millet Porridge)',
          'Extra Fried Plantain',
          'Extra Fried Fish',
          'Extra Grilled Chicken',
          'Extra Goat Meat',
          'Yam Pottage (Ampesi Stew)',
          'Banku & Okro Soup'
        ]
      }
    }
  });

  for (let i = 0; i < popularItems.length; i++) {
    await prisma.featuredItem.create({
      data: {
        menuItemId: popularItems[i].id,
        position: i + 1,
        isActive: true
      }
    });
  }
  console.log(`   ✅ Featured ${popularItems.length} items for homepage`);

  // Seed promo messages
  console.log('\n📢 Seeding promo messages...');
  await prisma.promoMessage.deleteMany();

  const promos = [
    { message: 'Sunday Special: Free delivery on orders above GH₵50', isActive: true, priority: 1 },
    { message: 'New: Try our authentic Fufu & Light Soup — weekend special!', isActive: true, priority: 2 },
    { message: 'Order Banku & Tilapia and get a free drink', isActive: true, priority: 3 },
    { message: 'Kelewele — the perfect snack, now available for delivery', isActive: true, priority: 4 },
  ];

  for (const promo of promos) {
    await prisma.promoMessage.create({ data: promo });
  }
  console.log(`   ✅ ${promos.length} promo messages seeded`);

  // Count and display summary
  const categoryCount = await prisma.category.count();
  const menuItemCount = await prisma.menuItem.count();
  const featuredCount = await prisma.featuredItem.count();

  console.log('\n✨ Seeding completed successfully!');
  console.log(`📊 Summary:`);
  console.log(`   Categories: ${categoryCount}`);
  console.log(`   Menu Items: ${menuItemCount}`);
  console.log(`   Featured Items: ${featuredCount}`);
  console.log('\n🇬🇭 Ghana Eats menu is ready to serve! 🍛');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });