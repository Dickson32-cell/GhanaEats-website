import prisma from '../../config/db.js';

export const getCategories = () =>
  prisma.category.findMany({ orderBy: { name: 'asc' } });

export const getItems = async ({ category, search, page = 1, limit = 12 }) => {
  const where = { isAvailable: true };
  if (category) where.category = { slug: category };
  if (search) where.name = { contains: search, mode: 'insensitive' };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    prisma.menuItem.findMany({
      where,
      include: { category: { select: { name: true, slug: true } } },
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.menuItem.count({ where }),
  ]);

  return { items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) };
};

export const getItemById = async (id) => {
  const item = await prisma.menuItem.findUnique({
    where: { id },
    include: { category: { select: { name: true, slug: true } } },
  });
  if (!item) throw { status: 404, message: 'Item not found' };
  return item;
};
