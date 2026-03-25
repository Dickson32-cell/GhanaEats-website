import prisma from '../../config/db.js';

const favInclude = {
  menuItem: {
    include: { category: { select: { name: true, slug: true } } },
  },
};

export const getFavorites = (userId) =>
  prisma.favorite.findMany({ where: { userId }, include: favInclude });

export const addFavorite = async (userId, menuItemId) => {
  const item = await prisma.menuItem.findUnique({ where: { id: menuItemId } });
  if (!item) throw { status: 404, message: 'Menu item not found' };

  return prisma.favorite.upsert({
    where: { userId_menuItemId: { userId, menuItemId } },
    create: { userId, menuItemId },
    update: {},
    include: favInclude,
  });
};

export const removeFavorite = (userId, menuItemId) =>
  prisma.favorite.deleteMany({ where: { userId, menuItemId } });
