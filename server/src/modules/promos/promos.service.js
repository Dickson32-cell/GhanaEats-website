import prisma from '../../config/db.js';

export const getAllPromos = async () => {
  return await prisma.promoMessage.findMany({
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
  });
};

export const getActivePromos = async () => {
  return await prisma.promoMessage.findMany({
    where: { isActive: true },
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
  });
};

export const getPromoById = async (id) => {
  return await prisma.promoMessage.findUnique({
    where: { id },
  });
};

export const createPromo = async (data) => {
  return await prisma.promoMessage.create({
    data: {
      message: data.message,
      isActive: data.isActive ?? true,
      priority: data.priority ?? 0,
    },
  });
};

export const updatePromo = async (id, data) => {
  return await prisma.promoMessage.update({
    where: { id },
    data: {
      message: data.message,
      isActive: data.isActive,
      priority: data.priority,
    },
  });
};

export const deletePromo = async (id) => {
  return await prisma.promoMessage.delete({
    where: { id },
  });
};
