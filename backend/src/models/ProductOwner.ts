// ProductOwner model using Sequelize
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ProductOwnerAttributes {
  id: number;
  name: string;
  email: string;
  created_at?: Date;
  updated_at?: Date;
}

interface ProductOwnerCreationAttributes extends Optional<ProductOwnerAttributes, 'id' | 'created_at' | 'updated_at'> {}

class ProductOwner extends Model<ProductOwnerAttributes, ProductOwnerCreationAttributes> implements ProductOwnerAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Associations (will be set in index.ts)
  public products?: any[];
}

ProductOwner.init(
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
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    }
  },
  {
    sequelize,
    tableName: 'product_owners',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
);

export default ProductOwner;
