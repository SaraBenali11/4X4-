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
                .select('*')
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
     * Note: If categories are just distinct values in products table, we can fetch distinct.
     * If there is a separate categories table, fetch from there.
     * For now, assuming distinct mapping or separate table if one exists. 
     * If not, we can return hardcoded or extract from products.
     */
    /**
     * Fetch all categories
     */
    async getCategories() {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name');

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    },

    /**
     * Create a new product
     * @param {Object} productData 
     */
    /**
     * Create a new product with relations
     * @param {Object} productData 
     */
    async createProduct(productData) {
        try {
            // 1. Separate main product data from relations
            const { sizes, colors, image, ...mainProductData } = productData;

            // Ensure numeric values
            if (mainProductData.price) mainProductData.price = parseFloat(mainProductData.price);
            if (mainProductData.promo_price) mainProductData.promo_price = parseFloat(mainProductData.promo_price);

            // 2. Insert into products table
            const { data: product, error } = await supabase
                .from('products')
                .insert([mainProductData])
                .select()
                .single();

            if (error) throw error;
            const productId = product.id;

            // 3. Insert Relations
            const promises = [];

            // Sizes
            if (sizes && sizes.length > 0) {
                const sizesPayload = sizes.map(s => ({ product_id: productId, size: s }));
                promises.push(supabase.from('product_sizes').insert(sizesPayload));
            }

            // Colors
            if (colors && colors.length > 0) {
                const colorsPayload = colors.map(c => ({ product_id: productId, color: c }));
                promises.push(supabase.from('product_colors').insert(colorsPayload));
            }

            // Images (Assuming single image for now based on UI)
            if (image) {
                promises.push(supabase.from('product_images').insert([{ product_id: productId, image_url: image }]));
            }

            if (promises.length > 0) {
                await Promise.all(promises);
            }

            return product;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },

    /**
     * Update a product and its relations
     * @param {string} id 
     * @param {Object} productData 
     */
    async updateProduct(id, productData) {
        try {
            // 1. Separate main product data from relations
            const { sizes, colors, image, ...mainProductData } = productData;

            // Ensure numeric values
            if (mainProductData.price) mainProductData.price = parseFloat(mainProductData.price);
            if (mainProductData.promo_price) mainProductData.promo_price = parseFloat(mainProductData.promo_price);

            // 2. Update products table
            const { error } = await supabase
                .from('products')
                .update(mainProductData)
                .eq('id', id);

            if (error) throw error;

            // 3. Update Relations (Strategy: Delete and Re-insert)

            // Sizes
            if (sizes) { // Only update if sizes is provided in payload
                await supabase.from('product_sizes').delete().eq('product_id', id);
                if (sizes.length > 0) {
                    const sizesPayload = sizes.map(s => ({ product_id: id, size: s }));
                    await supabase.from('product_sizes').insert(sizesPayload);
                }
            }

            // Colors
            if (colors) {
                await supabase.from('product_colors').delete().eq('product_id', id);
                if (colors.length > 0) {
                    const colorsPayload = colors.map(c => ({ product_id: id, color: c }));
                    await supabase.from('product_colors').insert(colorsPayload);
                }
            }

            // Images
            if (image) {
                // If we want to replace the image
                await supabase.from('product_images').delete().eq('product_id', id);
                await supabase.from('product_images').insert([{ product_id: id, image_url: image }]);
            }

            return 'Product updated successfully';
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    /**
     * Delete a product
     * @param {string} id 
     */
    async deleteProduct(id) {
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    },

    /**
     * Upload product image
     * @param {File} file 
     */
    async uploadImage(file) {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Use Signed URL to match Outfit logic (valid for 10 years)
            const { data, error: urlError } = await supabase.storage
                .from('product-images')
                .createSignedUrl(filePath, 315360000);

            if (urlError) throw urlError;

            return data.signedUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }
};
