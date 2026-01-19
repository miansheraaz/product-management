// SortBar component
import React from 'react';
import { SortField, SortOrder } from '../../types';
import './SortBar.css';

interface SortBarProps {
  sortBy: SortField;
  sortOrder: SortOrder;
  onSortChange: (sortBy: SortField, sortOrder: SortOrder) => void;
}

const SortBar: React.FC<SortBarProps> = ({ sortBy, sortOrder, onSortChange }) => {
  const sortFields: { value: SortField; label: string }[] = [
    { value: 'name', label: 'Name' },
    { value: 'sku', label: 'SKU' },
    { value: 'price', label: 'Price' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'status', label: 'Status' },
    { value: 'createdAt', label: 'Created Date' },
    { value: 'updatedAt', label: 'Updated Date' }
  ];

  return (
    <div className="sort-bar">
      <label>Sort by:</label>
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortField, sortOrder)}
        className="sort-select"
      >
        {sortFields.map(field => (
          <option key={field.value} value={field.value}>
            {field.label}
          </option>
        ))}
      </select>
      <button
        onClick={() => onSortChange(sortBy, sortOrder === 'ASC' ? 'DESC' : 'ASC')}
        className="sort-order-btn"
        title={sortOrder === 'ASC' ? 'Ascending' : 'Descending'}
      >
        {sortOrder === 'ASC' ? '↑' : '↓'}
      </button>
    </div>
  );
};

export default SortBar;
