import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import ProductCard from '../../components/ProductCard/ProductCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import FilterBar from '../../components/FilterBar/FilterBar';
import SortBar from '../../components/SortBar/SortBar';
import Pagination from '../../components/Pagination/Pagination';
import { productService } from '../../services/productService';
import { productOwnerService } from '../../services/productOwnerService';
import { Product, ProductOwner, ProductFilters, SortField, SortOrder, PaginationInfo } from '../../types';
import './ProductList.css';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [owners, setOwners] = useState<ProductOwner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sortBy, setSortBy] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('DESC');
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(5);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filtersWithSearch = {
        ...filters,
        search: searchTerm || undefined
      };

      const response = await productService.getAllProducts({
        filters: filtersWithSearch,
        page,
        limit,
        sortBy,
        sortOrder
      });

      setProducts(response.products);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm, page, limit, sortBy, sortOrder]);

  useEffect(() => {
    const loadOwners = async () => {
      try {
        const ownersData = await productOwnerService.getAllOwners();
        setOwners(ownersData);
      } catch (err) {
        console.error('Error loading owners:', err);
      }
    };
    loadOwners();
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

  const handleDelete = async (id: number): Promise<void> => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        loadData();
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Failed to delete product');
      }
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
            {products.map(product => (
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
