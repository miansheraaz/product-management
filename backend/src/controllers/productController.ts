// Product controller using Sequelize
import { Product, ProductOwner } from '../models';
import { Op } from 'sequelize';
import { validationResult } from 'express-validator';
import { Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { CustomRequest, FormattedProduct } from '../types';

// Helper function to format product
const formatProduct = (product: any): FormattedProduct => {
  // If image exists and is a local path, convert to URL
  let imageUrl = product.image;
  if (imageUrl && !imageUrl.startsWith('http')) {
    imageUrl = `/uploads/${path.basename(imageUrl)}`;
  }

  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    price: parseFloat(product.price),
    inventory: parseInt(product.inventory),
    status: product.status,
    image: imageUrl,
    description: product.description,
    ownerId: product.owner_id,
    owner: product.owner ? {
      id: product.owner.id,
      name: product.owner.name,
      email: product.owner.email
    } : null,
    createdAt: product.created_at,
    updatedAt: product.updated_at
  };
};

class ProductController {
  async getAllProducts(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        status: req.query.status as string | undefined,
        ownerId: req.query.ownerId as string | undefined,
        search: (req.query.search || req.query.q) as string | undefined,
        minPrice: req.query.minPrice as string | undefined,
        maxPrice: req.query.maxPrice as string | undefined
      };

      // Pagination
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;

      // Sorting - map frontend field names to database column names
      const sortBy = (req.query.sortBy as string) || 'createdAt';
      const sortOrder = (req.query.sortOrder as string)?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
      const fieldMapping: { [key: string]: string } = {
        'name': 'name',
        'sku': 'sku',
        'price': 'price',
        'inventory': 'inventory',
        'status': 'status',
        'createdAt': 'created_at',
        'updatedAt': 'updated_at'
      };
      const orderBy = fieldMapping[sortBy] || 'created_at';

      const where: any = {};
      
      if (filters.status) {
        where.status = filters.status;
      }

      if (filters.ownerId) {
        where.owner_id = parseInt(filters.ownerId);
      }

      if (filters.search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${filters.search}%` } },
          { sku: { [Op.iLike]: `%${filters.search}%` } }
        ];
      }

      // Price range filter
      if (filters.minPrice || filters.maxPrice) {
        where.price = {};
        if (filters.minPrice) {
          where.price[Op.gte] = parseFloat(filters.minPrice);
        }
        if (filters.maxPrice) {
          where.price[Op.lte] = parseFloat(filters.maxPrice);
        }
      }

      const { count, rows: products } = await Product.findAndCountAll({
        where,
        include: [{
          model: ProductOwner,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        }],
        order: [[orderBy, sortOrder]],
        limit,
        offset
      });

      const formattedProducts = products.map(product => formatProduct(product));
      
      res.json({
        products: formattedProducts,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
          hasNextPage: page < Math.ceil(count / limit),
          hasPrevPage: page > 1
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await Product.findByPk(req.params.id, {
        include: [{
          model: ProductOwner,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        }]
      });

      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      res.json(formatProduct(product));
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // If file was uploaded, delete it before returning error
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        res.status(400).json({ errors: errors.array() });
        return;
      }

      // Handle file upload
      let imagePath: string | null = null;
      if (req.file) {
        imagePath = req.file.filename;
      } else if (req.body.image) {
        // Allow URL fallback if no file uploaded
        imagePath = req.body.image;
      }

      const productData = {
        name: req.body.name,
        sku: req.body.sku,
        price: req.body.price,
        inventory: req.body.inventory,
        status: req.body.status || 'active',
        owner_id: req.body.ownerId,
        image: imagePath,
        description: req.body.description || null
      };

      const product = await Product.create(productData);
      const productWithOwner = await Product.findByPk(product.id, {
        include: [{
          model: ProductOwner,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        }]
      });

      if (!productWithOwner) {
        res.status(500).json({ error: 'Failed to create product' });
        return;
      }

      res.status(201).json(formatProduct(productWithOwner));
    } catch (error: any) {
      // Delete uploaded file if product creation fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ error: 'SKU already exists' });
        return;
      }
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        res.status(400).json({ error: 'Invalid product owner' });
        return;
      }
      next(error);
    }
  }

  async updateProduct(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // If file was uploaded, delete it before returning error
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const product = await Product.findByPk(req.params.id);

      if (!product) {
        // Delete uploaded file if product not found
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      // Handle file upload - delete old image if new one is uploaded
      let imagePath: string | null = product.image || null; // Keep existing image by default
      if (req.file) {
        // Delete old image file if it exists and is local
        if (product.image && !product.image.startsWith('http')) {
          const oldImagePath = path.join(__dirname, '../uploads', path.basename(product.image));
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        imagePath = req.file.filename;
      } else if (req.body.image) {
        // Allow URL update if no file uploaded
        imagePath = req.body.image;
      }

      const updateData = {
        name: req.body.name,
        sku: req.body.sku,
        price: req.body.price,
        inventory: req.body.inventory,
        status: req.body.status,
        owner_id: req.body.ownerId,
        image: imagePath,
        description: req.body.description || null
      };

      await product.update(updateData);
      const updatedProduct = await Product.findByPk(product.id, {
        include: [{
          model: ProductOwner,
          as: 'owner',
          attributes: ['id', 'name', 'email']
        }]
      });

      if (!updatedProduct) {
        res.status(500).json({ error: 'Failed to update product' });
        return;
      }

      res.json(formatProduct(updatedProduct));
    } catch (error: any) {
      // Delete uploaded file if update fails
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ error: 'SKU already exists' });
        return;
      }
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        res.status(400).json({ error: 'Invalid product owner' });
        return;
      }
      next(error);
    }
  }

  async deleteProduct(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await Product.findByPk(req.params.id);

      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      // Delete associated image file if it exists and is local
      if (product.image && !product.image.startsWith('http')) {
        const imagePath = path.join(__dirname, '../uploads', path.basename(product.image));
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await product.destroy();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

}

export default new ProductController();
