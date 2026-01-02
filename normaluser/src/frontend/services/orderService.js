import { supabase } from '../config/supabase';
import { productService } from './productService';
import emailjs from 'emailjs-com';

export const orderService = {
  /**
   * Create a new order with order items
   * @param {Object} orderData - Order data including customer info and cart items
   * @returns {Promise<Object>} Created order
   */
  async createOrder(orderData) {
    try {
      const { full_name, phone, email, wilaya, address, notes, cartItems } = orderData;

      // Validate required fields
      if (!full_name || !phone || !email || !wilaya || !address) {
        throw new Error('Tous les champs requis doivent être remplis');
      }

      // cartItems is required and should always be present if we reach this point
      if (!cartItems) {
        throw new Error('Erreur: données du panier manquantes');
      }

      // 1. Create the order
      // Based on database schema: id, full_name, phone, wilaya, address, status, created_at, email
      // Defensive allowed status logic
      const allowedStatuses = ["en attente", "en cours", "livrée", "retour"];
      let status = (orderData.status || "en attente").trim().toLowerCase();
      if (!allowedStatuses.includes(status)) status = "en attente";

      const orderPayload = {
        full_name: full_name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        wilaya: wilaya.trim(),
        address: address.trim(),
        status, // always DB-compliant value
      };

      // Note: If notes field exists in your database, uncomment below
      // if (notes && notes.trim()) {
      //   orderPayload.notes = notes.trim();
      // }

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert(orderPayload)
        .select()
        .single();

      if (orderError) {
        console.error('Order creation error:', orderError);
        throw new Error(orderError.message || 'Erreur lors de la création de la commande');
      }

      if (!order || !order.id) {
        throw new Error('La commande n\'a pas pu être créée');
      }

      // 2. Create order items - ensure price_at_order is an integer
      const orderItems = cartItems.map((item) => {
        if (!item.productId || !item.size || !item.quantity || !item.price) {
          throw new Error('Données de produit invalides dans le panier');
        }
        return {
          order_id: order.id,
          product_id: item.productId,
          size: String(item.size).trim(),
          quantity: parseInt(item.quantity, 10),
          price_at_order: Math.round(parseFloat(item.price)), // Ensure integer
        };
      });

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Order items creation error:', itemsError);
        // Try to delete the order if items failed
        await supabase.from('orders').delete().eq('id', order.id);
        throw new Error(itemsError.message || 'Erreur lors de la création des articles de commande');
      }

      // 3. Send confirmation email
      try {
        await this.sendOrderConfirmationEmail(order, cartItems, orderData);
        console.log('✅ Order confirmation email sent successfully to:', orderData.email);
      } catch (emailError) {
        // Log detailed error for debugging
        console.error('❌ Error sending confirmation email:', {
          error: emailError,
          message: emailError?.text || emailError?.message || 'Unknown error',
          status: emailError?.status || 'N/A',
          recipient: orderData.email,
          orderId: order.id,
        });
        // Don't fail the order if email fails, but log it clearly
        // The order is still created successfully
      }

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  /**
   * Send order confirmation email to customer
   * @param {Object} order - Created order
   * @param {Array} cartItems - Cart items
   * @param {Object} orderData - Original order data
   */
  async sendOrderConfirmationEmail(order, cartItems, orderData) {
    try {
      // Fetch product details for email
      const productDetails = await Promise.all(
        cartItems.map(async (item) => {
          try {
            const product = await productService.getProduct(item.productId);
            return {
              name: product?.name || item.name,
              color: item.color || 'N/A',
              quantity: item.quantity,
              price: item.price,
            };
          } catch (err) {
            console.error(`Error fetching product ${item.productId}:`, err);
            return {
              name: item.name || 'Produit',
              color: item.color || 'N/A',
              quantity: item.quantity,
              price: item.price,
            };
          }
        })
      );

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

      // Format delivery address
      const deliveryAddress = `${orderData.wilaya}, ${orderData.address}`;

      // Format ordered items
      const itemsList = productDetails
        .map((item) => `${item.name} - ${item.color} × ${item.quantity}`)
        .join('\n');

      // Calculate total
      const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const totalFormatted = `${Math.round(total).toLocaleString('fr-FR')} DZD`;

      // Prepare email content according to the template
      const emailSubject = 'Confirmation de commande Sutraty';
      const emailMessage = `Bonjour ${orderData.full_name},

Merci pour votre commande !
Nous avons bien reçu votre commande et celle-ci est actuellement en cours de traitement.

Détails de la commande :
Date de la commande : ${orderDate}
Adresse de livraison : ${deliveryAddress}
Mode de paiement : Paiement à la livraison
Articles commandés :
${itemsList}

Total à payer : ${totalFormatted}

Votre commande sera livrée dans les plus brefs délais.

Si vous avez des questions, n'hésitez pas à nous contacter à : sutratyco@gmail.com

Merci de votre confiance et de votre achat chez Sutraty Store !

Cordialement,
Sutraty Store`;

      // Prepare email template parameters for EmailJS
      const templateParams = {
        to_name: orderData.full_name,
        to_email: orderData.email,
        subject: emailSubject,
        message: emailMessage,
        order_date: orderDate,
        delivery_address: deliveryAddress,
        ordered_items: itemsList,
        total_amount: totalFormatted,
      };

      // Validate email address before sending
      if (!orderData.email || !orderData.email.includes('@')) {
        throw new Error('Invalid email address: ' + orderData.email);
      }

      // Send email using EmailJS
      console.log('📧 Attempting to send email to:', orderData.email);
      console.log('📧 Using EmailJS service:', 'service_qvou8fu');
      console.log('📧 Using EmailJS template:', 'template_930wrjx');
      console.log('📧 Email parameters:', {
        to_name: orderData.full_name,
        to_email: orderData.email,
        subject: emailSubject,
      });

      // IMPORTANT: The template MUST have "To Email Address" set to {{to_email}}
      // If your template uses different variable names, update them here
      const emailParams = {
        to_name: orderData.full_name,
        to_email: orderData.email, // ⚠️ CRITICAL: Template "To" field MUST be {{to_email}}
        email: orderData.email, // Fallback variable name (some templates use {{email}})
        from_name: 'Sutraty Store',
        subject: emailSubject,
        message: emailMessage,
        // Additional variables for template
        order_date: orderDate,
        delivery_address: deliveryAddress,
        ordered_items: itemsList,
        total_amount: totalFormatted,
        customer_name: orderData.full_name,
        customer_email: orderData.email,
      };

      const emailResult = await emailjs.send(
        'service_j0tmr7g', // Service ID
        'template_pywan6o', // Template ID - MUST be configured in EmailJS dashboard
        emailParams,
        'dnotdgi_FL1bPL9Nr' // Public Key (User ID)
      );

      console.log('✅ EmailJS response:', emailResult);
      console.log('✅ Email sent successfully! Status:', emailResult.status);
      console.log('✅ Response text:', emailResult.text);
      
      if (emailResult.status !== 200) {
        throw new Error(`EmailJS returned status ${emailResult.status}: ${emailResult.text}`);
      }

      // Verify the email was actually sent
      if (!emailResult.text || emailResult.text.includes('error')) {
        throw new Error('EmailJS returned an error: ' + emailResult.text);
      }
    } catch (error) {
      console.error('❌ Error sending order confirmation email:', {
        error: error,
        errorText: error?.text || error?.message,
        errorStatus: error?.status,
        recipient: orderData.email,
      });
      // Re-throw to be caught by caller for logging
      throw error;
    }
  },

  /**
   * Fetch all orders (for admin)
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
};

