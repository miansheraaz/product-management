// Sequelize database configuration
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'products_db',
  process.env.DB_USER || 'phamphong',
  process.env.DB_PASSWORD || 'phamphong9981',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test connection
sequelize.authenticate()
  .then(() => {
    console.log('Connected to PostgreSQL database via Sequelize');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

export default sequelize;
