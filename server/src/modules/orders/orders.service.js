import prisma from '../../config/db.js';

const DELIVERY_FEE = 2.99;

const orderInclude = {
  items: {
    include: {
      menuItem: { select: { id: true, name: true, imageUrl: true } },
    },
  },
  statusHistory: { orderBy: { changedAt: 'asc' } },
};

export const placeOrder = async (userId, { deliveryAddress, notes }) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { menuItem: true },
  });

  if (!cartItems.length) throw { status: 400, message: 'Cart is empty' };

  const unavailable = cartItems.filter((ci) => !ci.menuItem.isAvailable);
  if (unavailable.length) {
    throw { status: 400, message: `These items are unavailable: ${unavailable.map((i) => i.menuItem.name).join(', ')}` };
  }

  const totalAmount = cartItems.reduce(
    (sum, ci) => sum + parseFloat(ci.menuItem.price) * ci.quantity,
    0
  ) + DELIVERY_FEE;

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        userId,
        totalAmount,
        deliveryAddress,
        notes,
        items: {
          create: cartItems.map((ci) => ({
            menuItemId: ci.menuItemId,
            quantity: ci.quantity,
            unitPrice: ci.menuItem.price,
          })),
        },
        statusHistory: {
          create: { status: 'PENDING' },
        },
      },
      include: orderInclude,
    });

    await tx.cartItem.deleteMany({ where: { userId } });

    return newOrder;
  });

  return order;
};

export const getOrders = (userId) =>
  prisma.order.findMany({
    where: { userId },
    include: orderInclude,
    orderBy: { createdAt: 'desc' },
  });

export const getOrderById = async (userId, id) => {
  const order = await prisma.order.findFirst({
    where: { id, userId },
    include: orderInclude,
  });
  if (!order) throw { status: 404, message: 'Order not found' };
  return order;
};

export const trackOrder = async (userId, id) => {
  const order = await prisma.order.findFirst({
    where: { id, userId },
    select: {
      id: true,
      status: true,
      statusHistory: { orderBy: { changedAt: 'asc' } },
    },
  });
  if (!order) throw { status: 404, message: 'Order not found' };
  return order;
};
