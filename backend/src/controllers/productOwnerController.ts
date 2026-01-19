// ProductOwner controller using Sequelize
import { ProductOwner, Product } from '../models';
import { validationResult } from 'express-validator';
import { Response, NextFunction } from 'express';
import { CustomRequest, FormattedProductOwner } from '../types';

// Helper function to format owner
const formatOwner = (owner: any, productCount: number): FormattedProductOwner => {
  return {
    id: owner.id,
    name: owner.name,
    email: owner.email,
    productCount: productCount || 0
  };
};

class ProductOwnerController {
  async getAllOwners(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const owners = await ProductOwner.findAll({
        order: [['name', 'ASC']]
      });

      // Format owners with product count
      const formattedOwners = await Promise.all(
        owners.map(async (owner) => {
          const productCount = await Product.count({
            where: { owner_id: owner.id }
          });
          return formatOwner(owner, productCount);
        })
      );

      res.json(formattedOwners);
    } catch (error) {
      next(error);
    }
  }

  async getOwnerById(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const owner = await ProductOwner.findByPk(req.params.id);

      if (!owner) {
        res.status(404).json({ error: 'Product owner not found' });
        return;
      }

      const productCount = await Product.count({
        where: { owner_id: owner.id }
      });

      res.json(formatOwner(owner, productCount));
    } catch (error) {
      next(error);
    }
  }

  async createProductOwner(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const owner = await ProductOwner.create({
        name: req.body.name,
        email: req.body.email
      });

      res.status(201).json(formatOwner(owner, 0));
    } catch (error: any) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        res.status(400).json({ error: 'Email already exists' });
        return;
      }
      if (error.name === 'SequelizeValidationError') {
        res.status(400).json({ 
          error: 'Validation error',
          details: error.errors.map((e: any) => e.message)
        });
        return;
      }
      next(error);
    }
  }
}

export default new ProductOwnerController();
