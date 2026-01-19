// Pagination component
import React from 'react';
import { PaginationInfo } from '../../types';
import './Pagination.css';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pagination, onPageChange }) => {
  const { page, totalPages, hasNextPage, hasPrevPage } = pagination;

  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(page - 1);
        pages.push(page);
        pages.push(page + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={!hasPrevPage}
        className="pagination-btn"
      >
        Previous
      </button>
      
      <div className="pagination-numbers">
        {getPageNumbers().map((pageNum, index) => (
          pageNum === '...' ? (
            <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
          ) : (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum as number)}
              className={`pagination-number ${pageNum === page ? 'active' : ''}`}
            >
              {pageNum}
            </button>
          )
        ))}
      </div>
      
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={!hasNextPage}
        className="pagination-btn"
      >
        Next
      </button>
      
      <span className="pagination-info">
        Page {page} of {totalPages}
      </span>
    </div>
  );
};

export default Pagination;
