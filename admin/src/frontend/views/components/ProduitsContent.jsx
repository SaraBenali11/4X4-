import React, { useState, useEffect } from "react";
import { productService } from "../../services/productService";
import { supabase } from "../../config/supabase";
import { FaEdit, FaTrash, FaPlus, FaCheck, FaTimes } from "react-icons/fa";

export default function ProduitsContent() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    promo_price: "",
    category_id: "",
    status: "new",
    image: "", // This will store the URL (existing or new)
    sizes: "",
    colors: ""
  });
  const [imageFile, setImageFile] = useState(null); // File to upload
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([
        productService.getProducts(),
        productService.getCategories(),
      ]);
      setProducts(prods || []);
      if (cats && cats.length > 0) {
        setCategories(cats);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    setImageFile(null); // Reset file
    if (product) {
      setCurrentProduct(product);
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price,
        promo_price: product.promo_price || "",
        category_id: product.category_id || (categories.find(c => c.name === product.category)?.id) || "",
        status: product.status || "new",
        image: product.image_url || ((product.product_images && product.product_images[0] && product.product_images[0].image_url) || ""),
        sizes: product.product_sizes ? product.product_sizes.map(s => s.size).join(', ') : "",
        colors: product.product_colors ? product.product_colors.map(c => c.color).join(', ') : ""
      });
    } else {
      setCurrentProduct(null);
      setFormData({
        name: "",
        description: "",
        price: "",
        promo_price: "",
        category_id: "",
        status: "new",
        image: "",
        sizes: "",
        colors: ""
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
    setImageFile(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Upload Logic matching Outfits (Client-Side)
  const uploadImageToSupabase = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload to 'product-images' bucket
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    // Get Public URL
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      let finalImageUrl = formData.image;

      // 1. Upload new image if selected
      if (imageFile) {
        try {
          // Use the service which now has the correct signed URL logic
          finalImageUrl = await productService.uploadImage(imageFile);
        } catch (uploadErr) {
          console.error(uploadErr);
          alert("Erreur lors de l'upload de l'image");
          setUploading(false);
          return;
        }
      }

      // 2. Prepare Payload
      const payload = {
        ...formData,
        image: finalImageUrl, // Send the URL to backend
        price: parseFloat(formData.price),
        promo_price: formData.promo_price ? parseFloat(formData.promo_price) : null,
        sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
        colors: formData.colors ? formData.colors.split(',').map(c => c.trim()).filter(Boolean) : []
      };

      // 3. Send to Backend
      if (currentProduct) {
        const updatePayload = { ...payload };
        // If updating, you might need to handle relations specifically if your productService.updateProduct doesn't.
        // But the user code assumes productService handles it or the backend handles it.
        // Given I implemented updateProduct in Supabase earlier, let's trust it for now as a base.
        await productService.updateProduct(currentProduct.id, updatePayload);
      } else {
        await productService.createProduct(payload);
      }

      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement: " + (error.message || error));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        await productService.deleteProduct(id);
        fetchData();
      } catch (error) {
        console.error(error);
        alert("Erreur lors de la suppression: " + (error.message || error));
      }
    }
  };

  const getCategoryName = (catId) => {
    const cat = categories.find(c => c.id === catId);
    return cat ? cat.name : '-';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new': return <span style={{ backgroundColor: '#6c5ce7', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>Nouveau</span>;
      case 'best_seller': return <span style={{ backgroundColor: '#00b894', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>Best Seller</span>;
      case 'out_of_stock': return <span style={{ backgroundColor: '#d63031', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>Rupture</span>;
      case 'promo': return <span style={{ backgroundColor: '#e17055', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>Promo</span>;
      default: return <span style={{ backgroundColor: '#b2bec3', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{status}</span>;
    }
  };

  return (
    <div>
      <div className="panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 className="panel-title" style={{ margin: 0 }}>Gestion des Produits</h2>
        <button className="btn-add-product" onClick={() => handleOpenModal()} style={{ backgroundColor: '#8b7355', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FaPlus /> Ajouter Produit
        </button>
      </div>

      <div className="table-container" style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f9f9f9', borderBottom: '2px solid #eee' }}>
            <tr>
              <th style={{ padding: '15px', textAlign: 'left', color: '#666' }}>Produit</th>
              <th style={{ padding: '15px', textAlign: 'left', color: '#666' }}>Catégorie</th>
              <th style={{ padding: '15px', textAlign: 'left', color: '#666' }}>Prix</th>
              <th style={{ padding: '15px', textAlign: 'left', color: '#666' }}>Statut</th>
              <th style={{ padding: '15px', textAlign: 'right', color: '#666' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Chargement...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>Aucun produit trouvé</td></tr>
            ) : (
              products.map((p) => {
                const imgUrl = p.image_url || (p.product_images && p.product_images[0]?.image_url);
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                      {imgUrl ? (
                        <img src={imgUrl} alt={p.name} style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', backgroundColor: '#eee', borderRadius: '4px' }}></div>
                      )}
                      <span style={{ fontWeight: '500' }}>{p.name}</span>
                    </td>
                    <td style={{ padding: '15px', color: '#666' }}>{p.categories?.name || getCategoryName(p.category_id)}</td>
                    <td style={{ padding: '15px', fontWeight: '500' }}>
                      {p.promo_price ? (
                        <div>
                          <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '0.9em' }}>{p.price}</span>
                          <span style={{ color: '#e74c3c', marginLeft: '5px' }}>{p.promo_price} DA</span>
                        </div>
                      ) : (
                        <span>{p.price} DA</span>
                      )}
                    </td>
                    <td style={{ padding: '15px' }}>
                      {getStatusBadge(p.status)}
                    </td>
                    <td style={{ padding: '15px', textAlign: 'right' }}>
                      <button onClick={() => handleOpenModal(p)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', marginRight: '10px' }} title="Modifier">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer' }} title="Supprimer">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>{currentProduct ? 'Modifier le Produit' : 'Ajouter un Produit'}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontSize: '14px' }}>Nom du produit</label>
                <input name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontSize: '14px' }}>Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '80px' }} />
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontSize: '14px' }}>Prix (DA)</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} required style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontSize: '14px' }}>Prix Promo (Optionnel)</label>
                  <input type="number" name="promo_price" value={formData.promo_price} onChange={handleInputChange} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontSize: '14px' }}>Catégorie</label>
                <select name="category_id" value={formData.category_id} onChange={handleInputChange} required style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <option value="">Sélectionner</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontSize: '14px' }}>Statut</label>
                <select name="status" value={formData.status} onChange={handleInputChange} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                  <option value="new">Nouveau</option>
                  <option value="best_seller">Best Seller</option>
                  <option value="out_of_stock">Rupture de Stock</option>
                  <option value="promo">Promo</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontSize: '14px' }}>Image</label>
                <input type="file" onChange={handleFileChange} accept="image/*" style={{ marginBottom: '5px' }} />

                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                  {(imageFile || formData.image) && "Aperçu:"}
                </div>
                {(imageFile ? (
                  <img src={URL.createObjectURL(imageFile)} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                ) : (
                  formData.image && <img src={formData.image} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                ))}
                {uploading && <div style={{ fontSize: '12px', color: '#8b7355', marginTop: '5px' }}>Upload en cours...</div>}
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontSize: '14px' }}>Tailles (ex: S, M, L)</label>
                  <input name="sizes" value={formData.sizes} onChange={handleInputChange} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontSize: '14px' }}>Couleurs (ex: Rouge, Noir)</label>
                  <input name="colors" value={formData.colors} onChange={handleInputChange} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={handleCloseModal} style={{ padding: '10px 20px', border: '1px solid #ddd', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>Annuler</button>
                <button type="submit" disabled={uploading} style={{ padding: '10px 20px', border: 'none', background: '#8b7355', color: 'white', borderRadius: '4px', cursor: 'pointer', opacity: uploading ? 0.7 : 1 }}>
                  {uploading ? 'Enregistrement...' : (currentProduct ? 'Mettre à jour' : 'Ajouter')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
