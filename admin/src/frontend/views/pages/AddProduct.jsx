import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HexColorPicker } from 'react-colorful';
import { productService } from '../../services/productService';
import Header from '../components/headeradmin';
import Footer from '../components/footer';
import '../styles/AddProduct.css';
// Assuming a CSS file for styles, or I can use inline styles/existing utilities

const AddProduct = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: '',
        category: '',
        price: '',
        description: '',
        sizes: '',
        colors: [],
        is_new: false,
        is_best_seller: false
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [color, setColor] = useState('#aabbcc'); // Current picker color
    const [showPicker, setShowPicker] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const addColor = () => {
        if (!product.colors.includes(color)) {
            setProduct(prev => ({
                ...prev,
                colors: [...prev.colors, color]
            }));
        }
        setShowPicker(false);
    };

    const removeColor = (colorToRemove) => {
        setProduct(prev => ({
            ...prev,
            colors: prev.colors.filter(c => c !== colorToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let imageUrl = '';
            if (imageFile) {
                imageUrl = await productService.uploadImage(imageFile);
            }

            const productData = {
                ...product,
                // price: parseFloat(product.price),
                sizes: product.sizes.split(',').map(s => s.trim()).join(','), // store as comma separated or array depending on DB
                colors: product.colors.join(','),
                images: imageUrl, // Storing single image for now as CSV or just string
                created_at: new Date().toISOString()
            };

            await productService.createProduct(productData);
            navigate('/products');
        } catch (err) {
            setError('Failed to add product: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-product-page">
            <Header />
            <main className="add-product-container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                <h1>Ajouter un Produit</h1>
                {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    <div className="form-group">
                        <label>Nom du produit</label>
                        <input
                            type="text"
                            name="name"
                            value={product.name}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Catégorie</label>
                        <select
                            name="category"
                            value={product.category}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.5rem' }}
                        >
                            <option value="">Sélectionner une catégorie</option>
                            <option value="Abaya">Abaya</option>
                            <option value="Robes">Robes</option>
                            <option value="Ensembles">Ensembles</option>
                            <option value="Pantalons">Pantalons</option>
                            <option value="Hauts">Hauts</option>
                            {/* Fetch categories dynamically if preferred */}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Prix (DA)</label>
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Tailles (séparées par des virgules, ex: S, M, L)</label>
                        <input
                            type="text"
                            name="sizes"
                            value={product.sizes}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Couleurs</label>
                        <div className="colors-selection" style={{ marginBottom: '0.5rem' }}>
                            {product.colors.map(c => (
                                <span key={c} style={{
                                    display: 'inline-block',
                                    width: '24px',
                                    height: '24px',
                                    backgroundColor: c,
                                    marginRight: '0.5rem',
                                    borderRadius: '50%',
                                    border: '1px solid #ddd',
                                    cursor: 'pointer'
                                }}
                                    onClick={() => removeColor(c)}
                                    title="Click to remove"
                                />
                            ))}
                            <button type="button" onClick={() => setShowPicker(!showPicker)} style={{ padding: '0.2rem 0.5rem' }}>
                                {showPicker ? 'Fermer' : 'Ajouter une couleur'}
                            </button>
                        </div>
                        {showPicker && (
                            <div className="color-picker-wrapper" style={{ position: 'absolute', zIndex: 10 }}>
                                <HexColorPicker color={color} onChange={setColor} />
                                <button type="button" onClick={addColor} style={{ marginTop: '0.5rem' }}>Valider</button>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                        />
                    </div>

                    <div className="form-group" style={{ display: 'flex', gap: '2rem' }}>
                        <label>
                            <input
                                type="checkbox"
                                name="is_new"
                                checked={product.is_new}
                                onChange={handleChange}
                            /> Nouveau
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="is_best_seller"
                                checked={product.is_best_seller}
                                onChange={handleChange}
                            /> Best Seller
                        </label>
                    </div>

                    <button type="submit" disabled={loading} style={{
                        padding: '1rem',
                        backgroundColor: '#000',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        marginTop: '1rem'
                    }}>
                        {loading ? 'Publication...' : 'Publier le produit'}
                    </button>

                </form>
            </main>
            <Footer />
        </div>
    );
};

export default AddProduct;
