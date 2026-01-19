// Models index file to initialize Sequelize associations
import sequelize from '../config/database';
import ProductOwner from './ProductOwner';
import Product from './Product';

// Define associations
ProductOwner.hasMany(Product, {
  foreignKey: 'owner_id',
  as: 'products'
});

Product.belongsTo(ProductOwner, {
  foreignKey: 'owner_id',
  as: 'owner'
});

export {
  sequelize,
  ProductOwner,
  Product
};
