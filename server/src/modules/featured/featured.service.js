import prisma from '../../config/db.js';

export const getFeaturedItems = async () => {
  return await prisma.featuredItem.findMany({
    where: { isActive: true },
    include: {
      menuItem: {
        include: {
          category: true
        }
      }
    },
    orderBy: { position: 'asc' }
  });
};

export const setFeaturedItems = async (menuItemIds) => {
  // Delete all existing featured items first
  await prisma.featuredItem.deleteMany({});

  // Create new featured items with specified positions
  const operations = menuItemIds.map((menuItemId, index) =>
    prisma.featuredItem.create({
      data: {
        menuItemId,
        position: index + 1,
        isActive: true
      }
    })
  );

  return await prisma.$transaction(operations);
};

export const addFeaturedItem = async (menuItemId) => {
  // Get the next position
  const maxPosition = await prisma.featuredItem.findFirst({
    orderBy: { position: 'desc' },
    select: { position: true }
  });

  const nextPosition = (maxPosition?.position || 0) + 1;

  return await prisma.featuredItem.create({
    data: {
      menuItemId,
      position: nextPosition,
      isActive: true
    },
    include: {
      menuItem: {
        include: {
          category: true
        }
      }
    }
  });
};

export const removeFeaturedItem = async (id) => {
  return await prisma.featuredItem.update({
    where: { id },
    data: { isActive: false }
  });
};

export const reorderFeaturedItems = async (reorderedIds) => {
  const operations = reorderedIds.map((id, index) =>
    prisma.featuredItem.update({
      where: { id },
      data: { position: index + 1 }
    })
  );

  return await prisma.$transaction(operations);
};
