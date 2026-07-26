import prisma from '../../config/db.js';

export const createReview = async (userId, data) => {
  // Validate rating is between 1-5
  if (data.rating < 1 || data.rating > 5) {
    throw new Error('Rating must be between 1 and 5');
  }

  // Verify the order belongs to the user and is delivered
  const order = await prisma.order.findFirst({
    where: {
      id: data.orderId,
      userId,
      status: 'DELIVERED',
    },
    include: {
      items: {
        where: { menuItemId: data.menuItemId },
      },
    },
  });

  if (!order) {
    throw new Error('Order not found or not delivered yet');
  }

  if (order.items.length === 0) {
    throw new Error('This item was not in your order');
  }

  // Check if review already exists
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_menuItemId_orderId: {
        userId,
        menuItemId: data.menuItemId,
        orderId: data.orderId,
      },
    },
  });

  if (existingReview) {
    throw new Error('You have already reviewed this item for this order');
  }

  // Create the review
  return await prisma.review.create({
    data: {
      userId,
      menuItemId: data.menuItemId,
      orderId: data.orderId,
      rating: data.rating,
      comment: data.comment || null,
    },
    include: {
      user: {
        select: { id: true, name: true },
      },
      menuItem: {
        select: { id: true, name: true, imageUrl: true },
      },
    },
  });
};

export const getMenuItemReviews = async (menuItemId) => {
  return await prisma.review.findMany({
    where: { menuItemId },
    include: {
      user: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getMenuItemAverageRating = async (menuItemId) => {
  const result = await prisma.review.aggregate({
    where: { menuItemId },
    _avg: { rating: true },
    _count: { id: true },
  });

  return {
    averageRating: result._avg.rating || 0,
    totalReviews: result._count.id,
  };
};

export const getUserReviews = async (userId) => {
  return await prisma.review.findMany({
    where: { userId },
    include: {
      menuItem: {
        select: { id: true, name: true, imageUrl: true },
      },
      order: {
        select: { id: true, createdAt: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getOrderReviews = async (orderId, userId) => {
  return await prisma.review.findMany({
    where: {
      orderId,
      userId,
    },
    include: {
      menuItem: {
        select: { id: true, name: true, imageUrl: true },
      },
    },
  });
};

export const updateReview = async (reviewId, userId, data) => {
  // Verify the review belongs to the user
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.userId !== userId) {
    throw new Error('Review not found');
  }

  // Validate rating if provided
  if (data.rating && (data.rating < 1 || data.rating > 5)) {
    throw new Error('Rating must be between 1 and 5');
  }

  return await prisma.review.update({
    where: { id: reviewId },
    data: {
      rating: data.rating,
      comment: data.comment,
    },
    include: {
      user: {
        select: { id: true, name: true },
      },
      menuItem: {
        select: { id: true, name: true, imageUrl: true },
      },
    },
  });
};

export const deleteReview = async (reviewId, userId) => {
  // Verify the review belongs to the user
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review || review.userId !== userId) {
    throw new Error('Review not found');
  }

  return await prisma.review.delete({
    where: { id: reviewId },
  });
};
