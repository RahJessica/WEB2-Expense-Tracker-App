const sequelize = require('./db');
const { User, Category, Receipt } = require('./models/associations');

async function testReceiptModel() {
  try {
    await sequelize.authenticate();
    console.log('Connexion à PostgreSQL OK');

    
    await sequelize.sync({ alter: true });
    console.log('Tables et associations OK');

    
    const user = await User.findOrCreate({
      where: { email: 'test@test.com' },
      defaults: { username: 'testuser', password: '123456' }
    });

    const category = await Category.findOrCreate({
      where: { name: 'Test Category' },
      defaults: { description: 'Une catégorie test', type: 'expense' }
    });


    const receipt = await Receipt.create({
      amount: 50,
      description: 'Achat test',
      userId: user[0].id,
      categoryId: category[0].id
    });

    console.log('Insertion Receipt test OK');
    process.exit();
  } catch (err) {
    console.error('Erreur Receipt :', err);
    process.exit(1);
  }
}

testReceiptModel();
