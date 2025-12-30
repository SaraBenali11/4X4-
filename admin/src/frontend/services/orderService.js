import { supabase } from '../config/supabase';
import emailjs from '@emailjs/browser';

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
   * Delete an order and send rejection email to customer
   * @param {string} orderId - Order ID
   * @returns {Promise<void>}
   */
  async deleteOrder(orderId) {
    try {
      // First, fetch the order to get customer email before deleting
      const { data: order, error: fetchError } = await supabase
        .from('orders')
        .select('*, order_items(*, product:products(name))')
        .eq('id', orderId)
        .single();

      if (fetchError) throw fetchError;

      // Send rejection email to customer before deleting
      if (order && order.email) {
        try {
          await this.sendOrderRejectionEmail(order);
          console.log('✅ Order rejection email sent to:', order.email);
        } catch (emailError) {
          console.error('❌ Error sending rejection email:', emailError);
          // Don't fail the deletion if email fails
        }
      }

      // Delete order items (due to foreign key constraint)
      const { error: itemsError } = await supabase
        .from('order_items')
        .delete()
        .eq('order_id', orderId);

      if (itemsError) throw itemsError;

      // Delete the order
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

  /**
   * Send order rejection email to customer
   * @param {Object} order - Order object with customer info and items
   */
  async sendOrderRejectionEmail(order) {
    try {
      if (!order.email || !order.email.includes('@')) {
        throw new Error('Invalid email address: ' + order.email);
      }

      // Format order date
      const orderDate = order.created_at
        ? new Date(order.created_at).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : new Date().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

      // Format ordered items
      const itemsList = order.order_items
        ?.map((item) => `${item.product?.name || 'Produit'} - Taille: ${item.size} × ${item.quantity}`)
        .join('\n') || 'Produits commandés';

      // Calculate total
      const total = order.order_items?.reduce(
        (sum, item) => sum + (item.price_at_order || 0) * (item.quantity || 0),
        0
      ) || 0;
      const totalFormatted = `${Math.round(total).toLocaleString('fr-FR')} DZD`;

      // Prepare email content
      const emailSubject = 'Annulation de votre commande - Sutraty';
      const emailMessage = `Bonjour ${order.full_name},

Nous vous informons que votre commande du ${orderDate} a été annulée.

Détails de la commande annulée :
Date de la commande : ${orderDate}
Adresse de livraison : ${order.wilaya}, ${order.address}
Articles commandés :
${itemsList}

Total : ${totalFormatted}

Si vous avez des questions concernant cette annulation, n'hésitez pas à nous contacter à : sutratyco@gmail.com

Nous nous excusons pour tout désagrément et espérons vous servir à nouveau dans le futur.

Cordialement,
Sutraty Store`;

      // Send email using EmailJS
      console.log('📧 Sending order rejection email to:', order.email);

      const emailParams = {
        to_name: order.full_name,
        to_email: order.email,
        email: order.email,
        customer_email: order.email,
        from_name: 'Sutraty Store',
        subject: emailSubject,
        message: emailMessage,
        order_date: orderDate,
        delivery_address: `${order.wilaya}, ${order.address}`,
        ordered_items: itemsList,
        total_amount: totalFormatted,
      };

      const emailResult = await emailjs.send(
        'service_j0tmr7g', // Service ID (same as order confirmation)
        'template_7jdqgcw', // Template ID - you may want to create a separate rejection template
        emailParams,
        'dnotdgi_FL1bPL9Nr' // Public Key (User ID)
      );

      console.log('✅ Rejection email sent successfully. Status:', emailResult.status);
      
      if (emailResult.status !== 200) {
        throw new Error(`EmailJS returned status ${emailResult.status}: ${emailResult.text}`);
      }
    } catch (error) {
      console.error('❌ Error sending order rejection email:', {
        error: error,
        errorText: error?.text || error?.message,
        errorStatus: error?.status,
        recipient: order.email,
      });
      throw error;
    }
  },
};

