import React, { useEffect } from 'react';
import { FaEnvelope, FaBox } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchOwners } from '../../store/ownersSlice';
import type { ProductOwner } from '../../types';
import './ProductOwnerList.css';

const ProductOwnerList: React.FC = () => {
  const dispatch = useAppDispatch();
  const owners = useAppSelector((s) => s.owners.items);
  const loading = useAppSelector((s) => s.owners.loading);
  const error = useAppSelector((s) => s.owners.error);

  useEffect(() => {
    dispatch(fetchOwners());
  }, [dispatch]);

  if (loading) {
    return <div className="loading">Loading product owners...</div>;
  }

  return (
    <div className="product-owner-list">
      <div className="product-owner-list-header">
        <h1>Product Owners</h1>
        <Link to="/product-owners/new" className="btn-primary">
          Add Owner
        </Link>
      </div>
      {error && <div className="error-banner">{error}</div>}
      
      <div className="owner-grid">
        {owners.map((owner: ProductOwner) => (
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
