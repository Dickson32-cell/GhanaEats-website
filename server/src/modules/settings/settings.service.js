import prisma from '../../config/db.js';

/**
 * Get all site settings as a key→value map.
 * Public endpoint — no auth required.
 */
export const getAllSettings = async () => {
  const rows = await prisma.siteSetting.findMany();
  // Convert to { key: value } map
  const map = {};
  rows.forEach((row) => { map[row.key] = row.value; });
  return map;
};

/**
 * Get settings grouped by category.
 * Admin-only.
 */
export const getSettingsByCategory = async () => {
  const rows = await prisma.siteSetting.findMany({
    orderBy: [{ category: 'asc' }, { key: 'asc' }],
  });
  const grouped = {};
  rows.forEach((row) => {
    if (!grouped[row.category]) grouped[row.category] = [];
    grouped[row.category].push(row);
  });
  return grouped;
};

/**
 * Bulk upsert settings.
 * Admin-only. Accepts { key: value, ... } or [{ key, value }, ...].
 */
export const updateSettings = async (data) => {
  const entries = Array.isArray(data)
    ? data
    : Object.entries(data).map(([key, value]) => ({ key, value: String(value) }));

  const results = await Promise.all(
    entries.map(({ key, value }) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    )
  );

  return results;
};

/**
 * Delete a single setting by key.
 * Admin-only.
 */
export const deleteSetting = async (key) => {
  return prisma.siteSetting.delete({ where: { key } });
};