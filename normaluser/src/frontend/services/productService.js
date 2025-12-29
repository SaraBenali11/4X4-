import { supabase } from '../config/supabase';

export const productService = {
    /**
     * Fetch all products
     */
    async getProducts() {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*, product_images(*), categories(*), product_sizes(*), product_colors(*)')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    /**
     * Fetch a single product by ID
     * @param {string} id 
     */
    async getProduct(id) {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*, product_images(*), categories(*), product_sizes(*), product_colors(*)')
                .eq('id', id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    },

    /**
     * Fetch all categories
     */
    async getCategories() {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('category');

            if (error) throw error;

            const categories = [...new Set(data.map(item => item.category))];
            return categories.map(cat => ({ name: cat }));
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }
};
