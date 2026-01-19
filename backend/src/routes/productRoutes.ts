// Product routes
import express from 'express';
import productController from '../controllers/productController';
import { validateProduct } from '../middleware/validation';
import upload from '../middleware/upload';

const router = express.Router();

// GET /api/products - Get all products
router.get('/', productController.getAllProducts);

// GET /api/products/:id - Get product by ID
router.get('/:id', productController.getProductById);

// POST /api/products - Create new product (with file upload)
router.post('/', upload.single('image'), validateProduct, productController.createProduct);

// PUT /api/products/:id - Update product (with file upload)
router.put('/:id', upload.single('image'), validateProduct, productController.updateProduct);

// DELETE /api/products/:id - Delete product
router.delete('/:id', productController.deleteProduct);

export default router;
