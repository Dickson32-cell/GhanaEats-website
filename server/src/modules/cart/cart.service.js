import prisma from '../../config/db.js';

const cartInclude = {
  menuItem: {
    select: { id: true, name: true, price: true, imageUrl: true, isAvailable: true },
  },
};

export const getCart = (userId) =>
  prisma.cartItem.findMany({ where: { userId }, include: cartInclude });

export const addItem = async (userId, menuItemId, quantity = 1) => {
  const item = await prisma.menuItem.findUnique({ where: { id: menuItemId } });
  if (!item || !item.isAvailable) throw { status: 400, message: 'Item not available' };

  return prisma.cartItem.upsert({
    where: { userId_menuItemId: { userId, menuItemId } },
    create: { userId, menuItemId, quantity },
    update: { quantity: { increment: quantity } },
    include: cartInclude,
  });
};

export const updateItem = (userId, menuItemId, quantity) => {
  if (quantity < 1) throw { status: 400, message: 'Quantity must be at least 1' };
  return prisma.cartItem.update({
    where: { userId_menuItemId: { userId, menuItemId } },
    data: { quantity },
    include: cartInclude,
  });
};

export const removeItem = (userId, menuItemId) =>
  prisma.cartItem.delete({
    where: { userId_menuItemId: { userId, menuItemId } },
  });

export const clearCart = (userId) =>
  prisma.cartItem.deleteMany({ where: { userId } });
