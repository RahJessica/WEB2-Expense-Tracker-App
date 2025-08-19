const { Sequelize } = require('sequelize');
const sequelize = require('./db');
const { User, Category, Income, Receipt } = require('./models/associations'); 

async function testAssociations() {
  try {
    
    await sequelize.sync({ force: true });
    console.log('Tables et associations OK');

    
    const user = await User.create({
      username: 'testuser',
      email: 'test@test.com',
      password: '123456'
    });

    
    const incomeCategory = await Category.create({
      name: 'Salaire',
      description: 'Revenus réguliers',
      type: 'income'
    });

    
    const receiptCategory = await Category.create({
      name: 'Courses',
      description: 'Dépenses quotidiennes',
      type: 'receipt'
    });

    
    const income = await Income.create({
      amount: 100,
      description: 'Salaire test',
      userId: user.id,
      categoryId: incomeCategory.id
    });

    
    const receipt = await Receipt.create({
      amount: 50,
      description: 'Courses test',
      userId: user.id,
      categoryId: receiptCategory.id
    });

    console.log('Insertion test Income et Receipt OK');
    process.exit();
  } catch (err) {
    console.error('Erreur associations :', err);
    process.exit(1);
  }
}

testAssociations();
