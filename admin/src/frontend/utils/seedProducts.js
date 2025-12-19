import { supabase } from "../config/supabase";

export const seedDatabase = async () => {
    console.log("Starting seed...");
    try {
        // 1. Ensure a category exists
        let { data: categories, error: catError } = await supabase
            .from('categories')
            .select('id')
            .limit(1);

        if (catError) throw catError;

        let categoryId;

        if (categories.length === 0) {
            console.log("Creating default category...");
            const { data: newCat, error: newCatError } = await supabase
                .from('categories')
                .insert({ name: 'Collection 2024' })
                .select()
                .single();

            if (newCatError) throw newCatError;
            categoryId = newCat.id;
        } else {
            categoryId = categories[0].id;
        }

        // 2. Check if products exist
        const { count, error: countError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });

        if (countError) throw countError;

        if (count === 0) {
            console.log("Seeding products...");
            const products = [
                {
                    name: "Abaya Élégante Beige",
                    description: "Une abaya fluide et élégante pour toutes les occasions.",
                    price: 8500,
                    category_id: categoryId,
                    image_url: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?q=80&w=1000&auto=format&fit=crop",
                    status: 'new'
                },
                {
                    name: "Robe Longue Crème",
                    description: "Robe longue en tissu de haute qualité.",
                    price: 6500,
                    category_id: categoryId,
                    image_url: "https://images.unsplash.com/photo-1618932260643-be4bf999e9d7?q=80&w=1000&auto=format&fit=crop",
                    status: 'best_seller'
                },
                {
                    name: "Ensemble Chic Nude",
                    description: "Ensemble deux pièces moderne et confortable.",
                    price: 7200,
                    category_id: categoryId,
                    image_url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop",
                    status: 'new'
                },
                {
                    name: "Kimono Noir Satin",
                    description: "Kimono en satin noir avec détails dorés.",
                    price: 5500,
                    category_id: categoryId,
                    image_url: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=1000&auto=format&fit=crop",
                    status: 'new'
                },
                {
                    name: "Hijab Soie Médine",
                    description: "Hijab soyeux et opaque, parfait pour le quotidien.",
                    price: 1500,
                    category_id: categoryId,
                    image_url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop",
                    status: 'new'
                }
            ];

            const { error: insError } = await supabase
                .from('products')
                .insert(products);

            if (insError) throw insError;
            console.log("Products seeded successfully.");
            return { success: true, message: "Produits ajoutés avec succès!" };
        } else {
            console.log("Products already exist.");
            return { success: true, message: "Des produits existent déjà." };
        }

    } catch (err) {
        console.error("Seed error:", err);
        return { success: false, message: "Erreur lors du seed: " + err.message };
    }
};
