import * as featuredService from './featured.service.js';

export const getFeaturedItems = async (req, res) => {
  try {
    const items = await featuredService.getFeaturedItems();
    res.json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Error fetching featured items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured items'
    });
  }
};

export const setFeaturedItems = async (req, res) => {
  try {
    const { menuItemIds } = req.body;

    if (!Array.isArray(menuItemIds) || menuItemIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'menuItemIds must be a non-empty array'
      });
    }

    const items = await featuredService.setFeaturedItems(menuItemIds);
    res.json({
      success: true,
      data: items,
      message: 'Featured items updated successfully'
    });
  } catch (error) {
    console.error('Error setting featured items:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update featured items'
    });
  }
};

export const addFeaturedItem = async (req, res) => {
  try {
    const { menuItemId } = req.body;

    if (!menuItemId) {
      return res.status(400).json({
        success: false,
        message: 'menuItemId is required'
      });
    }

    const item = await featuredService.addFeaturedItem(menuItemId);
    res.json({
      success: true,
      data: item,
      message: 'Item added to featured successfully'
    });
  } catch (error) {
    console.error('Error adding featured item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add featured item'
    });
  }
};

export const removeFeaturedItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await featuredService.removeFeaturedItem(id);
    res.json({
      success: true,
      data: item,
      message: 'Item removed from featured successfully'
    });
  } catch (error) {
    console.error('Error removing featured item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove featured item'
    });
  }
};

export const reorderFeaturedItems = async (req, res) => {
  try {
    const { itemIds } = req.body;

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'itemIds must be a non-empty array'
      });
    }

    const items = await featuredService.reorderFeaturedItems(itemIds);
    res.json({
      success: true,
      data: items,
      message: 'Featured items reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering featured items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder featured items'
    });
  }
};
