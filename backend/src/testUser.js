//psql -U postgres -h localhost
// \l litser les databases
// \! clear | cls pour clear
// \c permet de se connecter à database
const sequelize = require('./db');
const User = require('./models/User');

async function testUserModel() {
  try {
    await sequelize.authenticate(); 
    console.log('Connexion à PostgreSQL OK');

    await User.sync({ alter: true }); 
    console.log('Table User OK');

    process.exit();
  } catch (err) {
    console.error('Erreur table Users :', err);
    process.exit(1);
  }
}
testUserModel();
