import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import ProductCard from '../../components/ProductCard/ProductCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import FilterBar from '../../components/FilterBar/FilterBar';
import SortBar from '../../components/SortBar/SortBar';
import Pagination from '../../components/Pagination/Pagination';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { deleteProductById, fetchProducts } from '../../store/productsSlice';
import { fetchOwners } from '../../store/ownersSlice';
import { Product, ProductFilters, SortField, SortOrder } from '../../types';
import './ProductList.css';

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector((s) => s.products.items);
  const pagination = useAppSelector((s) => s.products.pagination);
  const loading = useAppSelector((s) => s.products.loading);
  const error = useAppSelector((s) => s.products.error);
  const owners = useAppSelector((s) => s.owners.items);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sortBy, setSortBy] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('DESC');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(4);

  useEffect(() => {
    dispatch(fetchOwners());
  }, [dispatch]);

  const filtersWithSearch = useMemo(
    () => ({
      ...filters,
      search: searchTerm || undefined
    }),
    [filters, searchTerm]
  );

  useEffect(() => {
    dispatch(
      fetchProducts({
        filters: filtersWithSearch,
        page,
        limit,
        sortBy,
        sortOrder
      })
    );
  }, [dispatch, filtersWithSearch, page, limit, sortBy, sortOrder]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page on search
  };

  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page on filter change
  };

  const handleSortChange = (newSortBy: SortField, newSortOrder: SortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(1); // Reset to first page on sort change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLimit = parseInt(e.target.value, 10);
    setLimit(nextLimit);
    setPage(1);
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await dispatch(deleteProductById(id));
    }
  };

  if (loading && !products.length) {
    return <div className="loading">Loading products...</div>;
  }

  if (error && !products.length) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="product-list">
      <div className="product-list-header">
        <h1>Products</h1>
        <Link to="/products/new" className="btn-primary">
          <FaPlus className="btn-icon" /> Add New Product
        </Link>
      </div>

      <SearchBar
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search by name or SKU..."
      />

      <FilterBar filters={filters} onFilterChange={handleFilterChange} owners={owners} />

      <SortBar sortBy={sortBy} sortOrder={sortOrder} onSortChange={handleSortChange} />

      <div className="product-list-controls">
        <label className="page-limit">
          Items per page:
          <select value={limit} onChange={handleLimitChange}>
            <option value={4}>4</option>
            <option value={8}>8</option>
            <option value={12}>12</option>
            <option value={20}>20</option>
          </select>
        </label>
      </div>

      {loading && products.length > 0 && (
        <div className="loading-overlay">Loading...</div>
      )}

      {error && products.length > 0 && (
        <div className="error-banner">{error}</div>
      )}

      {products.length === 0 ? (
        <div className="empty-state">
          <p>No products found.</p>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} onDelete={handleDelete} />
            ))}
          </div>

          {pagination && (
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </div>
  );
};

export default ProductList;
