// Product model using Sequelize
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ProductAttributes {
  id: number;
  name: string;
  sku: string;
  price: number;
  inventory: number;
  status: 'active' | 'inactive' | 'discontinued';
  owner_id: number;
  image?: string | null;
  description?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'image' | 'description' | 'created_at' | 'updated_at'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public sku!: string;
  public price!: number;
  public inventory!: number;
  public status!: 'active' | 'inactive' | 'discontinued';
  public owner_id!: number;
  public image?: string | null;
  public description?: string | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Associations (will be set in index.ts)
  public owner?: any;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    sku: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    inventory: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'discontinued'),
      allowNull: false,
      defaultValue: 'active'
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'product_owners',
        key: 'id'
      }
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default Product;
