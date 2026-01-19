// ProductForm page component
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { productOwnerService } from '../../services/productOwnerService';
import { ProductOwner, ProductFormData } from '../../types';
import './ProductForm.css';

interface FormErrors {
  [key: string]: string;
}

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    sku: '',
    price: '',
    inventory: '',
    status: 'active',
    ownerId: '',
    image: '',
    description: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [owners, setOwners] = useState<ProductOwner[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
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
      setFormData({
        name: data.name || '',
        sku: data.sku || '',
        price: data.price?.toString() || '',
        inventory: data.inventory?.toString() || '',
        status: data.status || 'active',
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

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (!formData.price || parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be a non-negative number';
    }

    if (formData.inventory === '' || parseInt(formData.inventory) < 0) {
      newErrors.inventory = 'Inventory must be a non-negative number';
    }

    if (!formData.ownerId) {
      newErrors.ownerId = 'Product owner is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (!id && isEdit) return;

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        sku: formData.sku,
        price: parseFloat(formData.price),
        inventory: parseInt(formData.inventory),
        status: formData.status,
        ownerId: parseInt(formData.ownerId),
        description: formData.description || null
      };

      if (isEdit && id) {
        await productService.updateProduct(id, payload, imageFile);
      } else {
        await productService.createProduct(payload, imageFile);
      }

      navigate('/products');
    } catch (error: any) {
      console.error('Error saving product:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.errors?.[0]?.msg || 'Failed to save product';
      alert(errorMessage);
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

      <form onSubmit={handleSubmit} className="form" encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="name">Product Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="sku">SKU *</label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className={errors.sku ? 'error' : ''}
          />
          {errors.sku && <span className="error-message">{errors.sku}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">Price *</label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              className={errors.price ? 'error' : ''}
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="inventory">Inventory *</label>
            <input
              type="number"
              id="inventory"
              name="inventory"
              min="0"
              value={formData.inventory}
              onChange={handleChange}
              className={errors.inventory ? 'error' : ''}
            />
            {errors.inventory && <span className="error-message">{errors.inventory}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
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
              name="ownerId"
              value={formData.ownerId}
              onChange={handleChange}
              className={errors.ownerId ? 'error' : ''}
            >
              <option value="">Select Owner</option>
              {owners.map(owner => (
                <option key={owner.id} value={owner.id}>
                  {owner.name}
                </option>
              ))}
            </select>
            {errors.ownerId && <span className="error-message">{errors.ownerId}</span>}
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
          {(imagePreview || (!imageFile && formData.image)) && (
            <div className="image-preview">
              <img 
                src={imagePreview || (formData.image.startsWith('http') ? formData.image : `http://localhost:3001${formData.image}`)} 
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
            name="description"
            value={formData.description}
            onChange={handleChange}
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
            disabled={loading}
            className="btn-submit"
          >
            {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
