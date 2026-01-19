import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaEllipsisV, FaEdit, FaTrash } from 'react-icons/fa';
import { Product } from '../../types';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  onDelete?: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Handle image URL - if it's a local path, prepend API base URL
  const getImageUrl = (image: string | null): string | undefined => {
    if (!image) return undefined;
    if (image.startsWith('http')) return image;
    return `http://localhost:3001${image}`;
  };

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when opening menu
    setIsMenuOpen(prev => !prev);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/products/${product.id}/edit`);
    setIsMenuOpen(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (onDelete) {
      onDelete(product.id);
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-card-menu" ref={menuRef}>
        <button className="menu-button" onClick={handleMenuToggle}>
          <FaEllipsisV />
        </button>
        {isMenuOpen && (
          <div className="dropdown-menu">
            <button onClick={handleEditClick} className="dropdown-item">
              <FaEdit /> Edit
            </button>
            {onDelete && (
              <button onClick={handleDeleteClick} className="dropdown-item delete-item">
                <FaTrash /> Delete
              </button>
            )}
          </div>
        )}
      </div>

      {product.image && (
        <div className="product-card-image">
          <img src={getImageUrl(product.image)} alt={product.name} />
        </div>
      )}
      <div className="product-card-content">
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-sku">SKU: {product.sku}</p>
        <p className="product-card-price">${product.price}</p>
        <p className="product-card-inventory">
          <FaBox className="inventory-icon" />
          <span>Stock: {product.inventory}</span>
        </p>
        <span className={`product-card-status status status-${product.status}`}>
          {product.status}
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
