// Main App component
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout/Layout';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import ProductList from './pages/ProductList/ProductList';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import ProductForm from './pages/ProductForm/ProductForm';
import ProductOwnerList from './pages/ProductOwnerList/ProductOwnerList';
import ProductOwnerForm from './pages/ProductOwnerForm/ProductOwnerForm';

function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/products/:id/edit" element={<ProductForm />} />
            <Route path="/product-owners" element={<ProductOwnerList />} />
            <Route path="/product-owners/new" element={<ProductOwnerForm />} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
