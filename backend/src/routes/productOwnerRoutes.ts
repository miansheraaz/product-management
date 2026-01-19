// ProductOwner routes
import express from 'express';
import productOwnerController from '../controllers/productOwnerController';
import { validateProductOwner } from '../middleware/validation';

const router = express.Router();

// GET /api/product-owners - Get all product owners
router.get('/', productOwnerController.getAllOwners);

// POST /api/product-owners - Create new product owner
router.post('/', validateProductOwner, productOwnerController.createProductOwner);

// GET /api/product-owners/:id - Get product owner by ID
router.get('/:id', productOwnerController.getOwnerById);

export default router;
