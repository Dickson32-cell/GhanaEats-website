import prisma from '../../config/db.js';

export const getDashboard = async () => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [totalRevenue, ordersToday, activeOrders, totalUsers] = await Promise.all([
    prisma.order.aggregate({
      where: { status: 'DELIVERED' },
      _sum: { totalAmount: true },
    }),
    prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.order.count({
      where: { status: { in: ['PENDING', 'PREPARING', 'ON_THE_WAY'] } },
    }),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
  ]);

  return {
    totalRevenue: totalRevenue._sum.totalAmount || 0,
    ordersToday,
    activeOrders,
    totalUsers,
  };
};

export const getRevenue = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const orders = await prisma.order.findMany({
    where: { status: 'DELIVERED', createdAt: { gte: thirtyDaysAgo } },
    select: { totalAmount: true, createdAt: true },
  });

  const grouped = {};
  orders.forEach(({ totalAmount, createdAt }) => {
    const date = createdAt.toISOString().split('T')[0];
    grouped[date] = (grouped[date] || 0) + parseFloat(totalAmount);
  });

  return Object.entries(grouped)
    .map(([date, revenue]) => ({ date, revenue }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

export const getAllOrders = async ({ status, page = 1, limit = 20 }) => {
  const where = status ? { status } : {};
  const skip = (Number(page) - 1) * Number(limit);

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: { menuItem: { select: { name: true } } },
        },
        statusHistory: { orderBy: { changedAt: 'desc' }, take: 1 },
      },
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) };
};

export const updateOrderStatus = async (id, status, adminId) => {
  const validStatuses = ['PENDING', 'PREPARING', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED'];
  if (!validStatuses.includes(status)) throw { status: 400, message: 'Invalid status' };

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.update({
      where: { id },
      data: { status },
    });
    await tx.orderStatusHistory.create({
      data: { orderId: id, status, changedBy: adminId },
    });
    return order;
  });
};

export const getAllMenuItems = () =>
  prisma.menuItem.findMany({
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { createdAt: 'desc' },
  });

export const createMenuItem = (data) =>
  prisma.menuItem.create({
    data,
    include: { category: { select: { name: true, slug: true } } },
  });

export const updateMenuItem = (id, data) =>
  prisma.menuItem.update({
    where: { id },
    data,
    include: { category: { select: { name: true, slug: true } } },
  });

export const deleteMenuItem = (id) =>
  prisma.menuItem.delete({ where: { id } });

export const getAllUsers = () =>
  prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, phone: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
