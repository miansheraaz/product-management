// Validation middleware
import { body } from 'express-validator';

export const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Product name must be between 1 and 255 characters'),

  body('sku')
    .trim()
    .notEmpty()
    .withMessage('SKU is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('SKU must be between 1 and 100 characters'),

  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a non-negative number'),

  body('inventory')
    .isInt({ min: 0 })
    .withMessage('Inventory must be a non-negative integer'),

  body('status')
    .optional()
    .isIn(['active', 'inactive', 'discontinued'])
    .withMessage('Status must be one of: active, inactive, discontinued'),

  body('ownerId')
    .notEmpty()
    .withMessage('Product owner is required')
    .isInt({ min: 1 })
    .withMessage('Product owner ID must be a valid integer'),

  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters')
];

export const validateProductOwner = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product owner name is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Product owner name must be between 1 and 255 characters'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be a valid email address')
    .isLength({ max: 255 })
    .withMessage('Email must not exceed 255 characters')
];
