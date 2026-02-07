import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { productOwnerService } from '../../services/productOwnerService';
import './ProductOwnerForm.css';

interface FormErrors {
  name?: string;
  email?: string;
}

const ProductOwnerForm: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!name.trim()) next.name = 'Name is required';
    if (!email.trim()) {
      next.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      next.email = 'Please enter a valid email';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setSubmitError(null);
      await productOwnerService.createOwner({ name: name.trim(), email: email.trim() });
      navigate('/product-owners');
    } catch (error: any) {
      console.error('Error creating product owner:', error);
      const apiError = error.response?.data;
      const message =
        (typeof apiError?.error === 'string' && apiError.error) ||
        (typeof apiError?.error?.message === 'string' && apiError.error.message) ||
        'Failed to create product owner';
      setSubmitError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-owner-form">
      <h1>Add Product Owner</h1>
      {submitError && <div className="error-banner">{submitError}</div>}

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/product-owners')}>
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Saving...' : 'Create Owner'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductOwnerForm;
