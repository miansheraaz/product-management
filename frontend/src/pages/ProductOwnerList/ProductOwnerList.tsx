import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaBox } from 'react-icons/fa';
import { productOwnerService } from '../../services/productOwnerService';
import { ProductOwner } from '../../types';
import './ProductOwnerList.css';

const ProductOwnerList: React.FC = () => {
  const [owners, setOwners] = useState<ProductOwner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadOwners();
  }, []);

  const loadOwners = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await productOwnerService.getAllOwners();
      setOwners(data);
    } catch (error) {
      console.error('Error loading owners:', error);
      alert('Failed to load product owners');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading product owners...</div>;
  }

  return (
    <div className="product-owner-list">
      <h1>Product Owners</h1>
      
      <div className="owner-grid">
        {owners.map(owner => (
          <div key={owner.id} className="owner-card">
            <h3>{owner.name}</h3>
            <p className="owner-email">
              <FaEnvelope className="email-icon" /> {owner.email}
            </p>
            <div className="owner-products">
              <span className="product-count">
                <FaBox className="product-count-icon" /> {owner.productCount || 0} Product{owner.productCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductOwnerList;
