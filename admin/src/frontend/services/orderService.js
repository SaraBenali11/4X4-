import { supabase } from '../config/supabase';

export const orderService = {
  /**
   * Fetch all orders with order items
   * @returns {Promise<Array>} List of orders with items
   */
  async getOrders() {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (
              id,
              name,
              product_images (
                image_url
              )
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  /**
   * Update order status
   * @param {string} orderId - Order ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated order
   */
  async updateOrderStatus(orderId, status) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  /**
   * Delete an order
   * @param {string} orderId - Order ID
   * @returns {Promise<void>}
   */
  async deleteOrder(orderId) {
    try {
      // First delete order items (due to foreign key constraint)
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;

      // Then delete the order
      const { error: orderError } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (orderError) throw orderError;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  },
};

