import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBox, FaShoppingBag, FaUsers } from 'react-icons/fa';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="layout-header-content">
          <Link to="/products" className="layout-logo">
            <FaBox className="logo-icon" />
            <span className="logo-text">Product Manager</span>
          </Link>
          <nav className="layout-nav">
            <Link
              to="/products"
              className={`nav-link ${location.pathname.startsWith('/products') ? 'active' : ''}`}
            >
              <FaShoppingBag className="nav-icon" />
              <span className="nav-text">Products</span>
            </Link>
            <Link
              to="/product-owners"
              className={`nav-link ${location.pathname.startsWith('/product-owners') ? 'active' : ''}`}
            >
              <FaUsers className="nav-icon" />
              <span className="nav-text">Product Owners</span>
            </Link>
          </nav>
        </div>
      </header>
      <main className="layout-main">
        {children}
      </main>
    </div>
  );
};

export default Layout;
