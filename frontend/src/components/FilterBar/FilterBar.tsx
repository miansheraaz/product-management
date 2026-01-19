import React from 'react';
import { FaFilter, FaTag, FaUser, FaDollarSign, FaTimes } from 'react-icons/fa';
import { ProductOwner, ProductFilters } from '../../types';
import './FilterBar.css';

interface FilterBarProps {
  filters: ProductFilters;
  onFilterChange: (filters: ProductFilters) => void;
  owners?: ProductOwner[];
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, owners = [] }) => {
  const hasActiveFilters = filters.status || filters.ownerId || filters.minPrice || filters.maxPrice;

  const clearFilters = () => {
    onFilterChange({});
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar-header">
        <div className="filter-bar-title">
          <FaFilter className="filter-icon" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            <FaTimes /> Clear All
          </button>
        )}
      </div>

      <div className="filter-bar-content">
        <div className="filter-group">
          <label className="filter-label">
            <FaTag className="label-icon" />
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value || undefined })}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="discontinued">Discontinued</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">
            <FaUser className="label-icon" />
            Owner
          </label>
          <select
            value={filters.ownerId || ''}
            onChange={(e) => onFilterChange({ ...filters, ownerId: e.target.value || undefined })}
            className="filter-select"
          >
            <option value="">All Owners</option>
            {owners.map(owner => (
              <option key={owner.id} value={owner.id}>
                {owner.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group price-filter-group">
          <label className="filter-label">
            <FaDollarSign className="label-icon" />
            Price Range
          </label>
          <div className="price-range">
            <div className="price-input-wrapper">
              <span className="price-prefix">$</span>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice || ''}
                onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value || undefined })}
                className="filter-input price-input"
                min="0"
                step="0.01"
              />
            </div>
            <span className="price-separator">to</span>
            <div className="price-input-wrapper">
              <span className="price-prefix">$</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice || ''}
                onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value || undefined })}
                className="filter-input price-input"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
