// Seed script to add initial product owner
import dotenv from 'dotenv';
import { ProductOwner, sequelize } from '../models';

dotenv.config();

const seedProductOwner = async (): Promise<void> => {
  try {
    // Check if owner already exists
    const existingOwner = await ProductOwner.findOne({
      where: { email: 'miansherraz1@gmail.com' }
    });

    if (existingOwner) {
      console.log('Product owner already exists:', existingOwner.name);
      return;
    }

    // Create the owner
    const owner = await ProductOwner.create({
      name: 'Muhammad Sharaz',
      email: 'miansherraz1@gmail.com'
    });

    console.log('Product owner seeded successfully:', owner.name);
  } catch (error) {
    console.error('Error seeding product owner:', error);
    throw error;
  }
};

// Run seed if called directly
if (require.main === module) {
  (async () => {
    try {
      // Connect to database
      await sequelize.authenticate();
      console.log('Connected to database for seeding');

      // Sync models
      await sequelize.sync({ alter: true });

      await seedProductOwner();
      process.exit(0);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  })();
}

export default seedProductOwner;
