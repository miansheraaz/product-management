// Seed script to add professional furniture products
import dotenv from 'dotenv';
import { Product, ProductOwner, sequelize } from '../models';

dotenv.config();

const seedProducts = async (): Promise<void> => {
  try {
    // Find the product owner (Muhammad Sharaz)
    const owner = await ProductOwner.findOne({
      where: { email: 'miansherraz1@gmail.com' }
    });

    if (!owner) {
      console.log('Product owner not found. Please run seed script first.');
      return;
    }

    // Check if products already exist
    const existingProducts = await Product.count();
    if (existingProducts > 0) {
      console.log(`Products already exist (${existingProducts} products). Skipping product seeding.`);
      return;
    }

    const furnitureProducts = [
      {
        name: 'Modern Wooden Dining Table',
        sku: 'FURN-001',
        price: 599.99,
        inventory: 15,
        status: 'active',
        owner_id: owner.id,
        description: 'Beautiful modern dining table made from solid oak wood. Seats 6 people comfortably. Perfect for family dinners and entertaining guests. Features a smooth finish and sturdy construction.',
        image: null
      },
      {
        name: 'Ergonomic Office Chair',
        sku: 'FURN-002',
        price: 349.99,
        inventory: 25,
        status: 'active',
        owner_id: owner.id,
        description: 'Comfortable ergonomic office chair with lumbar support and adjustable height. Ideal for long work hours. Features breathable mesh back and padded seat for maximum comfort.',
        image: null
      },
      {
        name: 'Leather Sofa Set',
        sku: 'FURN-003',
        price: 1299.99,
        inventory: 8,
        status: 'active',
        owner_id: owner.id,
        description: 'Luxurious 3-seater leather sofa set with matching armchairs. Premium quality genuine leather upholstery. Includes throw pillows and elegant design perfect for living rooms.',
        image: null
      },
      {
        name: 'Bookshelf with 5 Shelves',
        sku: 'FURN-004',
        price: 199.99,
        inventory: 30,
        status: 'active',
        owner_id: owner.id,
        description: 'Sturdy wooden bookshelf with 5 adjustable shelves. Perfect for organizing books, decor, and storage. Made from high-quality MDF with elegant finish. Easy to assemble.',
        image: null
      },
      {
        name: 'Coffee Table with Storage',
        sku: 'FURN-005',
        price: 249.99,
        inventory: 20,
        status: 'active',
        owner_id: owner.id,
        description: 'Modern coffee table with hidden storage compartment. Made from high-quality MDF with elegant finish. Perfect for keeping living room organized. Features smooth edges and contemporary design.',
        image: null
      },
      {
        name: 'Bed Frame Queen Size',
        sku: 'FURN-006',
        price: 449.99,
        inventory: 12,
        status: 'active',
        owner_id: owner.id,
        description: 'Solid wood queen-size bed frame with headboard. Easy assembly with all hardware included. Features elegant design and sturdy construction. Perfect for modern bedrooms.',
        image: null
      },
      {
        name: 'Wardrobe Closet',
        sku: 'FURN-007',
        price: 799.99,
        inventory: 10,
        status: 'active',
        owner_id: owner.id,
        description: 'Spacious 4-door wardrobe closet with hanging space and shelves. Perfect for bedroom organization. Features sliding doors and multiple compartments for efficient storage.',
        image: null
      },
      {
        name: 'TV Stand Entertainment Center',
        sku: 'FURN-008',
        price: 399.99,
        inventory: 18,
        status: 'active',
        owner_id: owner.id,
        description: 'Modern TV stand with cable management and storage compartments. Accommodates TVs up to 65 inches. Features open shelves and closed cabinets for media organization.',
        image: null
      },
      {
        name: 'Dining Chairs Set of 4',
        sku: 'FURN-009',
        price: 299.99,
        inventory: 22,
        status: 'active',
        owner_id: owner.id,
        description: 'Set of 4 comfortable dining chairs with padded seats. Matching design for your dining table. Features sturdy construction and elegant upholstery. Perfect for family dining.',
        image: null
      },
      {
        name: 'Desk with Drawers',
        sku: 'FURN-010',
        price: 379.99,
        inventory: 16,
        status: 'active',
        owner_id: owner.id,
        description: 'Spacious office desk with 3 drawers for storage. Perfect for home office or study room. Features smooth surface and ample workspace. Includes cable management system.',
        image: null
      },
      {
        name: 'Recliner Armchair',
        sku: 'FURN-011',
        price: 549.99,
        inventory: 14,
        status: 'active',
        owner_id: owner.id,
        description: 'Comfortable recliner armchair with footrest. Perfect for relaxation and reading. Features plush padding and smooth reclining mechanism. Available in multiple colors.',
        image: null
      },
      {
        name: 'Side Table Nightstand',
        sku: 'FURN-012',
        price: 129.99,
        inventory: 28,
        status: 'active',
        owner_id: owner.id,
        description: 'Elegant side table nightstand with drawer. Perfect for bedrooms. Features compact design and storage drawer. Made from solid wood with smooth finish.',
        image: null
      },
      {
        name: 'Bar Stool Set of 2',
        sku: 'FURN-013',
        price: 179.99,
        inventory: 20,
        status: 'active',
        owner_id: owner.id,
        description: 'Modern bar stool set of 2 with adjustable height. Perfect for kitchen islands and bars. Features comfortable padded seats and sturdy construction. Easy to clean.',
        image: null
      },
      {
        name: 'Console Table Entryway',
        sku: 'FURN-014',
        price: 229.99,
        inventory: 15,
        status: 'active',
        owner_id: owner.id,
        description: 'Elegant console table for entryway or hallway. Features drawer and open shelf for storage. Perfect for displaying decor and organizing keys. Modern design.',
        image: null
      },
      {
        name: 'Accent Chair',
        sku: 'FURN-015',
        price: 279.99,
        inventory: 18,
        status: 'active',
        owner_id: owner.id,
        description: 'Stylish accent chair with modern design. Perfect for living rooms and offices. Features comfortable padding and elegant upholstery. Available in various colors.',
        image: null
      }
    ];

    console.log(`Creating ${furnitureProducts.length} furniture products...`);

    for (const productData of furnitureProducts) {
      await Product.create(productData);
      console.log(`✓ Created: ${productData.name}`);
    }

    console.log('Product seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
};

// Run seed if called directly
if (require.main === module) {
  (async () => {
    try {
      await sequelize.authenticate();
      console.log('Connected to database for seeding');

      await sequelize.sync({ alter: true });

      await seedProducts();
      process.exit(0);
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  })();
}

export default seedProducts;
