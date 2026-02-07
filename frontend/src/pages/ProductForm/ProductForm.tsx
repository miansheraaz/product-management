// ProductForm page component
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { productService } from '../../services/productService';
import { productOwnerService } from '../../services/productOwnerService';
import { BACKEND_BASE_URL } from '../../services/api';
import { ProductOwner } from '../../types';
import './ProductForm.css';

type ProductFormValues = {
  name: string;
  sku: string;
  price: string;
  inventory: string;
  status: 'active' | 'inactive' | 'discontinued';
  ownerId: string;
  image: string;
  description: string;
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

const schema: yup.ObjectSchema<ProductFormValues> = yup
  .object({
    name: yup.string().trim().required('Name is required'),
    sku: yup.string().trim().required('SKU is required'),
    price: yup
      .string()
      .required('Price is required')
      .test('is-non-negative', 'Price must be a non-negative number', (value) => {
        if (value === undefined || value === null || value === '') return false;
        const n = Number(value);
        return Number.isFinite(n) && n >= 0;
      }),
    inventory: yup
      .string()
      .required('Inventory is required')
      .test('is-non-negative-int', 'Inventory must be a non-negative number', (value) => {
        if (value === undefined || value === null || value === '') return false;
        const n = Number(value);
        return Number.isInteger(n) && n >= 0;
      }),
    status: yup
      .mixed<ProductFormValues['status']>()
      .oneOf(['active', 'inactive', 'discontinued'])
      .required(),
    ownerId: yup.string().required('Product owner is required'),
    image: yup.string().default(''),
    description: yup.string().default('')
  })
  .required();

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: '',
      sku: '',
      price: '',
      inventory: '',
      status: 'active',
      ownerId: '',
      image: '',
      description: ''
    },
    resolver: yupResolver(schema),
    mode: 'onSubmit'
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [owners, setOwners] = useState<ProductOwner[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    loadOwners();
    if (isEdit && id) {
      loadProduct();
    }
  }, [id]);

  const loadOwners = async (): Promise<void> => {
    try {
      const data = await productOwnerService.getAllOwners();
      setOwners(data);
    } catch (error) {
      console.error('Error loading owners:', error);
    }
  };

  const loadProduct = async (): Promise<void> => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await productService.getProductById(id);
      reset({
        name: data.name || '',
        sku: data.sku || '',
        price: data.price?.toString() || '',
        inventory: data.inventory?.toString() || '',
        status: (data.status || 'active') as ProductFormValues['status'],
        ownerId: data.ownerId?.toString() || '',
        image: data.image || '',
        description: data.description || ''
      });
      // Don't set imagePreview here - we'll use formData.image for display
      // imagePreview is only for newly selected files
    } catch (error) {
      console.error('Error loading product:', error);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const formImage = watch('image');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        setSubmitError('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSubmitError('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      setSubmitError(null);
      // Keep the existing image URL in form state intact; upload overrides on submit.
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: ProductFormValues): Promise<void> => {
    try {
      setLoading(true);
      setSubmitError(null);
      const payload = {
        name: values.name,
        sku: values.sku,
        price: parseFloat(values.price),
        inventory: parseInt(values.inventory, 10),
        status: values.status,
        ownerId: parseInt(values.ownerId, 10),
        description: values.description || null
      };

      if (isEdit && id) {
        await productService.updateProduct(id, payload, imageFile);
      } else {
        await productService.createProduct(payload, imageFile);
      }

      navigate('/products');
    } catch (error: unknown) {
      console.error('Error saving product:', error);
      setSubmitError(getApiErrorMessage(error, 'Failed to save product'));
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return <div className="loading">Loading product...</div>;
  }

  return (
    <div className="product-form">
      <h1>{isEdit ? 'Edit Product' : 'Create New Product'}</h1>
      {submitError && <div className="error-banner">{submitError}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="form" encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="name">Product Name *</label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="sku">SKU *</label>
          <input
            type="text"
            id="sku"
            {...register('sku')}
            className={errors.sku ? 'error' : ''}
          />
          {errors.sku && <span className="error-message">{errors.sku.message}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price *</label>
            <input
              type="number"
              id="price"
              step="0.01"
              min="0"
              {...register('price')}
              className={errors.price ? 'error' : ''}
            />
            {errors.price && <span className="error-message">{errors.price.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="inventory">Inventory *</label>
            <input
              type="number"
              id="inventory"
              min="0"
              {...register('inventory')}
              className={errors.inventory ? 'error' : ''}
            />
            {errors.inventory && <span className="error-message">{errors.inventory.message}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              {...register('status')}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="discontinued">Discontinued</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="ownerId">Product Owner *</label>
            <select
              id="ownerId"
              {...register('ownerId')}
              className={errors.ownerId ? 'error' : ''}
            >
              <option value="">Select Owner</option>
              {owners.map((owner: ProductOwner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name}
                </option>
              ))}
            </select>
            {errors.ownerId && <span className="error-message">{errors.ownerId.message}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="imageFile">Product Image</label>
          <input
            type="file"
            id="imageFile"
            name="imageFile"
            accept="image/*"
            onChange={handleFileChange}
          />
          {(imagePreview || (!imageFile && formImage)) && (
            <div className="image-preview">
              <img 
                src={imagePreview || (formImage.startsWith('http') ? formImage : `${BACKEND_BASE_URL}${formImage}`)} 
                alt={imagePreview ? "Preview" : "Current"} 
              />
            </div>
          )}
          <p className="image-help">Upload an image file (JPEG, PNG, GIF, WebP - Max 5MB)</p>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            {...register('description')}
            rows={4}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="btn-cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || isSubmitting}
            className="btn-submit"
          >
            {loading || isSubmitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
