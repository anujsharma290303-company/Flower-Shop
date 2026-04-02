require('dotenv').config();
const sequelize = require('../config/database');
const { Category, Product, SiteConfig, FAQ } = require('../models');
const slugify = require('slugify');

const seedCategories = async () => {
  console.log('🌼 Seeding categories...');

  const mainCategories = [
    { name: 'Roses', displayOrder: 1 },
    { name: 'Birthday', displayOrder: 2 },
    { name: 'Anniversary', displayOrder: 3 },
    { name: 'Wedding', displayOrder: 4 },
    { name: 'Sympathy & Funeral', displayOrder: 5 },
    { name: 'Get Well', displayOrder: 6 },
    { name: 'Thank You', displayOrder: 7 },
    { name: 'New Baby', displayOrder: 8 },
    { name: 'Romance', displayOrder: 9 },
    { name: 'Seasonal', displayOrder: 10 },
    { name: 'Plants', displayOrder: 11 },
    { name: 'Fruit Baskets', displayOrder: 12 },
    { name: 'Same Day Delivery', displayOrder: 13 },
    { name: 'Subscriptions', displayOrder: 14 },
  ];

  // Create main categories
  const createdCategories = {};
  for (const cat of mainCategories) {
    const category = await Category.create({
      name: cat.name,
      slug: slugify(cat.name, { lower: true, strict: true }),
      displayOrder: cat.displayOrder,
      isActive: true,
    });
    createdCategories[cat.name] = category;
    console.log(`  ✓ Created: ${cat.name}`);
  }

  // Subcategories under Sympathy & Funeral
  const sympathyParent = createdCategories['Sympathy & Funeral'];
  const subcategories = [
    { name: 'Wreaths', displayOrder: 1 },
    { name: 'Standing Sprays', displayOrder: 2 },
    { name: 'Casket Flowers', displayOrder: 3 },
    { name: 'Sympathy Baskets', displayOrder: 4 },
    { name: 'Memorial Plants', displayOrder: 5 },
    { name: 'Sympathy Bouquets', displayOrder: 6 },
  ];

  for (const subcat of subcategories) {
    const category = await Category.create({
      name: subcat.name,
      slug: slugify(subcat.name, { lower: true, strict: true }),
      displayOrder: subcat.displayOrder,
      parentId: sympathyParent.id,
      isActive: true,
    });
    console.log(`  ✓ Created subcategory: ${subcat.name} (parent: Sympathy & Funeral)`);
  }

  console.log(
    `✅ Successfully seeded ${mainCategories.length + subcategories.length} categories\n`
  );
  return createdCategories;
};

const runSeed = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    // Seed categories
    const categories = await seedCategories();

    await sequelize.close();
    console.log('✅ Database connection closed');
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

// Run if executed directly
if (require.main === module) {
  runSeed();
}

module.exports = { seedCategories, runSeed };
