import React from 'react';
// import './ProductCard.css'; // Assuming CSS exists or use inline

const ProductCard = ({ image, name, category, price, oldPrice, isNew, status, productId }) => {
    return (
        <div className="product-card" style={{ cursor: 'pointer' }}>
            <div className="product-image-container" style={{ position: 'relative', width: '100%', aspectRatio: '3/4', overflow: 'hidden', borderRadius: '8px' }}>
                {isNew && (
                    <span className="product-badge new" style={{ position: 'absolute', top: '10px', left: '10px', background: 'black', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', zIndex: 5 }}>
                        Nouveau
                    </span>
                )}
                <img
                    src={image || 'https://via.placeholder.com/300x400'}
                    alt={name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
            </div>
            <div className="product-info" style={{ marginTop: '10px' }}>
                <p className="product-category" style={{ color: '#666', fontSize: '12px', textTransform: 'uppercase' }}>{category}</p>
                <h3 className="product-name" style={{ margin: '5px 0', fontSize: '16px' }}>{name}</h3>
                <div className="product-price" style={{ fontWeight: 'bold' }}>
                    {price} DA
                    {oldPrice && <span className="old-price" style={{ textDecoration: 'line-through', color: '#999', marginLeft: '10px', fontSize: '14px' }}>{oldPrice} DA</span>}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
