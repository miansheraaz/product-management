// Express server setup
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { sequelize } from './models';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Sequelize models and associations
import './models';
import seedProductOwner from './scripts/seed';
import seedProducts from './scripts/seedProducts';

// Sync database schema with models
sequelize.sync({ alter: true })
  .then(async () => {
    console.log('Database synced successfully');
    // Seed initial product owner
    await seedProductOwner();
    // Seed furniture products
    await seedProducts();
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
import productRoutes from './routes/productRoutes';
import productOwnerRoutes from './routes/productOwnerRoutes';

app.use('/api/products', productRoutes);
app.use('/api/product-owners', productOwnerRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status((err as any).status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
