const sequelize = require('./db');
const { User, Category, Income, Receipt } = require('./models/associations');

async function fullTest() {
  try {
    
    await sequelize.sync({ alter: true });
    console.log('Tables OK');

    
    const user1 = await User.create({
      username: 'Alice',
      email: 'alice@email.com',
      password: 'pass'
    });

    const user2 = await User.create({
      username: 'Bob',
      email: 'bob@email.com',
      password: 'pass'
    });

    
    const salaryCategory = await Category.create({
      name: 'Salary',
      description: 'Income from work',
      type: 'income'
    });

    const groceriesCategory = await Category.create({
      name: 'Groceries',
      description: 'Buying some food items',
      type: 'expense'
    });

    
    await Income.create({
      amount: 2000,
      description: 'August salary',
      userId: user1.id,
      categoryId: salaryCategory.id
    });

    await Income.create({
      amount: 150000,
      description: 'August salary',
      userId: user2.id,
      categoryId: salaryCategory.id
    });

    
    await Receipt.create({
      amount: 200000,
      description: 'Supermarket',
      userId: user1.id,
      categoryId: groceriesCategory.id
    });

    await Receipt.create({
      amount: 100000,
      description: 'Supermarket',
      userId: user2.id,
      categoryId: groceriesCategory.id
    });

    console.log('Full test insertion OK');
    process.exit();
  } catch (error) {
    console.error('Error fullTest :', error);
    process.exit(1);
  }
}

fullTest();
