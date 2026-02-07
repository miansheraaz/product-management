import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { productOwnerService } from '../../services/productOwnerService';
import './ProductOwnerForm.css';

type ProductOwnerFormValues = {
  name: string;
  email: string;
};

const getApiErrorMessage = (error: unknown, fallback: string): string => {
  const maybeAxiosError = error as { response?: { data?: unknown } };
  const data = maybeAxiosError.response?.data as
    | { error?: unknown; errors?: Array<{ msg?: unknown }> }
    | undefined;

  if (typeof data?.error === 'string') return data.error;
  if (typeof (data?.error as { message?: unknown } | undefined)?.message === 'string') {
    return (data?.error as { message: string }).message;
  }
  const firstMsg = data?.errors?.[0]?.msg;
  if (typeof firstMsg === 'string') return firstMsg;
  return fallback;
};

const schema: yup.ObjectSchema<ProductOwnerFormValues> = yup
  .object({
    name: yup.string().trim().required('Name is required'),
    email: yup.string().trim().email('Please enter a valid email').required('Email is required')
  })
  .required();

const ProductOwnerForm: React.FC = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProductOwnerFormValues>({
    defaultValues: { name: '', email: '' },
    resolver: yupResolver(schema),
    mode: 'onSubmit'
  });

  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (values: ProductOwnerFormValues): Promise<void> => {
    try {
      setSubmitError(null);
      await productOwnerService.createOwner({ name: values.name.trim(), email: values.email.trim() });
      navigate('/product-owners');
    } catch (error: unknown) {
      console.error('Error creating product owner:', error);
      setSubmitError(getApiErrorMessage(error, 'Failed to create product owner'));
    }
  };

  return (
    <div className="product-owner-form">
      <h1>Add Product Owner</h1>
      {submitError && <div className="error-banner">{submitError}</div>}

      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email.message}</span>}
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate('/product-owners')}>
            Cancel
          </button>
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Create Owner'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductOwnerForm;
