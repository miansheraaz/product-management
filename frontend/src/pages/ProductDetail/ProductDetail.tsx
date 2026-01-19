import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTag, FaBox, FaUser, FaEdit, FaTrash } from 'react-icons/fa';
import { productService } from '../../services/productService';
import { Product } from '../../types';
import './ProductDetail.css';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async (): Promise<void> => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (error) {
      console.error('Error loading product:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        navigate('/products');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  if (loading) {
    return <div className="product-detail-loading">Loading product...</div>;
  }

  if (!product) {
    return <div className="product-detail-error">Product not found</div>;
  }

  const imageUrl = product.image 
    ? (product.image.startsWith('http') ? product.image : `http://localhost:3001${product.image}`)
    : null;

  return (
    <div className="product-detail">
      {/* Header Section */}
      <div className="product-detail-header">
        <Link to="/products" className="back-link">
          <FaArrowLeft /> Back to Products
        </Link>
        <div className="product-detail-actions">
          <Link to={`/products/${id}/edit`} className="btn-edit">
            <FaEdit /> Edit
          </Link>
          <button onClick={handleDelete} className="btn-delete">
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="product-detail-hero">
        {imageUrl && (
          <div className="product-detail-image-wrapper">
            <div className="product-detail-image">
              <img src={imageUrl} alt={product.name} />
            </div>
          </div>
        )}
        
        <div className="product-detail-hero-content">
          <div className="product-detail-title-section">
            <h1 className="product-detail-title">{product.name}</h1>
            <span className={`product-detail-status status status-${product.status}`}>
              {product.status}
            </span>
          </div>
          <div className="product-detail-price">${product.price}</div>
          {product.description && (
            <div className="product-detail-description">
              <p>{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="product-detail-info-grid">
        <div className="info-card">
          <div className="info-card-icon">
            <FaTag />
          </div>
          <div className="info-card-content">
            <label>SKU</label>
            <span>{product.sku}</span>
          </div>
        </div>

        <div className="info-card">
          <div className="info-card-icon">
            <FaBox />
          </div>
          <div className="info-card-content">
            <label>Inventory</label>
            <span>{product.inventory} units</span>
          </div>
        </div>

        <div className="info-card">
          <div className="info-card-icon">
            <FaUser />
          </div>
          <div className="info-card-content">
            <label>Product Owner</label>
            <span>{product.owner?.name || 'Unassigned'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
