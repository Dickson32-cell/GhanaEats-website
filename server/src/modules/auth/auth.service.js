import prisma from '../../config/db.js';
import { hashPassword, comparePassword } from '../../utils/hash.utils.js';
import { signToken } from '../../utils/jwt.utils.js';

export const register = async ({ name, email, password }) => {
  // Validate and sanitize inputs
  if (!name?.trim()) throw { status: 400, message: 'Name is required' };
  if (name.trim().length > 100) throw { status: 400, message: 'Name is too long' };
  if (!email?.trim()) throw { status: 400, message: 'Email is required' };
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) throw { status: 400, message: 'Please provide a valid email address' };
  if (!password || password.length < 6) throw { status: 400, message: 'Password must be at least 6 characters' };
  if (password.length > 72) throw { status: 400, message: 'Password must be at most 72 characters' };

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) throw { status: 409, message: 'Email already in use' };

  const hashed = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name: name.trim(), email: normalizedEmail, password: hashed },
    select: { id: true, name: true, email: true, role: true },
  });

  const token = signToken({ id: user.id, role: user.role });
  return { user, token };
};

export const login = async ({ email, password }) => {
  const normalizedEmail = email?.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) throw { status: 401, message: 'Invalid credentials' };

  const valid = await comparePassword(password, user.password);
  if (!valid) throw { status: 401, message: 'Invalid credentials' };

  const token = signToken({ id: user.id, role: user.role });
  const { password: _, ...safeUser } = user;
  return { user: safeUser, token };
};

export const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, phone: true, address: true, role: true, createdAt: true },
  });
  if (!user) throw { status: 404, message: 'User not found' };
  return user;
};

export const updateMe = async (userId, data) => {
  const { name, phone, address } = data;
  const user = await prisma.user.update({
    where: { id: userId },
    data: { name, phone, address },
    select: { id: true, name: true, email: true, phone: true, address: true, role: true },
  });
  return user;
};

export const changePassword = async (userId, { currentPassword, newPassword }) => {
  if (!currentPassword || !newPassword) {
    throw { status: 400, message: 'Current and new passwords are required' };
  }
  if (newPassword.length < 6) {
    throw { status: 400, message: 'New password must be at least 6 characters' };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw { status: 404, message: 'User not found' };

  const valid = await comparePassword(currentPassword, user.password);
  if (!valid) throw { status: 401, message: 'Current password is incorrect' };

  const hashed = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });
};
