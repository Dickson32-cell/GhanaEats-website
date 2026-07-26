import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getItems } from '../../api/menuApi';
import { getFeaturedItems, setFeaturedItems, addFeaturedItem, removeFeaturedItem, reorderFeaturedItems } from '../../api/featuredApi';
import Button from '../../components/ui/Button';
import { formatPrice } from '../../utils/currency';

const AdminFeaturedPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [featuredItems, setFeaturedItemsState] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [menuData, featuredData] = await Promise.all([
        getItems(),
        getFeaturedItems()
      ]);

      // API returns: response.data.data.items
      setMenuItems(menuData.data?.data?.items || []);
      setFeaturedItemsState(featuredData.data || []);

      // Extract menu item IDs from featured items
      const featuredMenuItemIds = (featuredData.data || []).map(item => item.menuItemId);
      setSelectedItems(featuredMenuItemIds);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = (menuItemId) => {
    if (selectedItems.includes(menuItemId)) {
      setSelectedItems(selectedItems.filter(id => id !== menuItemId));
    } else {
      setSelectedItems([...selectedItems, menuItemId]);
    }
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    const newItems = [...selectedItems];
    [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
    setSelectedItems(newItems);
  };

  const handleMoveDown = (index) => {
    if (index === selectedItems.length - 1) return;
    const newItems = [...selectedItems];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    setSelectedItems(newItems);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(selectedItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSelectedItems(items);
  };

  const handleSave = async () => {
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item to feature');
      return;
    }

    try {
      setSaving(true);
      await setFeaturedItems(selectedItems);
      toast.success('Featured items updated successfully!');
      await loadData(); // Reload to get updated data
    } catch (error) {
      console.error('Error saving featured items:', error);
      toast.error(error.response?.data?.message || 'Failed to update featured items');
    } finally {
      setSaving(false);
    }
  };

  const getMenuItemById = (id) => {
    return menuItems.find(item => item.id === id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark dark:text-white">Manage Featured Items</h1>
          <p className="mt-2 text-dark/60 dark:text-white/60">
            Control which items appear on the homepage hero section
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="px-6">
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Available Menu Items */}
        <div className="bg-white dark:bg-dark-700 rounded-xl shadow-soft p-6 border border-gray-100 dark:border-white/10">
          <h2 className="text-xl font-bold text-dark dark:text-white mb-4">
            Available Menu Items
          </h2>
          <p className="text-sm text-dark/60 dark:text-white/60 mb-4">
            Click on items to add them to the featured section
          </p>
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {menuItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleToggleFeatured(item.id)}
                className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedItems.includes(item.id)
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 bg-white dark:bg-dark-600'
                }`}
              >
                <img
                  src={item.imageUrl || '/placeholder.jpg'}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-dark dark:text-white truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm text-dark/60 dark:text-white/60">{item.category?.name}</p>
                  <p className="text-sm font-semibold text-primary">
                    {formatPrice(item.price)}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {selectedItems.includes(item.id) ? (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Items Preview */}
        <div className="bg-white dark:bg-dark-700 rounded-xl shadow-soft p-6 border border-gray-100 dark:border-white/10">
          <h2 className="text-xl font-bold text-dark dark:text-white mb-4">
            Featured Items Preview
          </h2>
          <p className="text-sm text-dark/60 dark:text-white/60 mb-4">
            These items will appear on the homepage in this order
          </p>
          {selectedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <svg className="w-16 h-16 text-gray-300 dark:text-white/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p className="text-gray-500 dark:text-white/50">No items selected</p>
              <p className="text-sm text-gray-400 dark:text-white/40 mt-1">
                Select items from the left to add them here
              </p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="featured-items">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3 max-h-[600px] overflow-y-auto"
                  >
                    {selectedItems.map((itemId, index) => {
                      const menuItem = getMenuItemById(itemId);
                      if (!menuItem) return null;

                      return (
                        <Draggable key={itemId} draggableId={itemId} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`flex items-center gap-4 p-4 rounded-lg border-2 bg-white dark:bg-dark-600 transition-all ${
                                snapshot.isDragging
                                  ? 'border-primary shadow-lg'
                                  : 'border-gray-200 dark:border-white/10'
                              }`}
                            >
                              <div className="flex-shrink-0 text-gray-400 dark:text-white/40">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                              </div>
                              <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                                {index + 1}
                              </div>
                              <img
                                src={menuItem.imageUrl || '/placeholder.jpg'}
                                alt={menuItem.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-dark dark:text-white truncate">
                                  {menuItem.name}
                                </h3>
                                <p className="text-sm text-dark/60 dark:text-white/60">{menuItem.category?.name}</p>
                              </div>
                              <div className="flex flex-col gap-1">
                                <button
                                  onClick={() => handleMoveUp(index)}
                                  disabled={index === 0}
                                  className={`p-1 rounded ${
                                    index === 0
                                      ? 'text-gray-300 dark:text-white/20 cursor-not-allowed'
                                      : 'text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/10'
                                  }`}
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleMoveDown(index)}
                                  disabled={index === selectedItems.length - 1}
                                  className={`p-1 rounded ${
                                    index === selectedItems.length - 1
                                      ? 'text-gray-300 dark:text-white/20 cursor-not-allowed'
                                      : 'text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/10'
                                  }`}
                                >
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </div>
                              <button
                                onClick={() => handleToggleFeatured(itemId)}
                                className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <div className="flex gap-3">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">How it works</h3>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Click on menu items to add/remove them from the featured section</li>
              <li>• Drag and drop items in the preview to reorder them</li>
              <li>• The order in the preview is the order they'll appear on the homepage</li>
              <li>• Click "Save Changes" to update the homepage</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFeaturedPage;
