const {Sequelize}= require('sequelize');
const sequelize = new Sequelize(
    process.env.DB_NAME,    
    process.env.DB_USER || 'postgres',     
    String(process.env.DB_PASSWORD),
    {
      host: process.env.DB_HOST || 'localhost', 
      dialect: 'postgres',                     
      logging: false                         
    }
  );

  async function testConnection() {
    try {
      await sequelize.authenticate();
      console.log('Connexion à PostgreSQL OK ');
    } catch (err) {
      console.error('Erreur connexion PostgreSQL :', err);
    }
}

testConnection(); 
module.exports = sequelize;
console.log('DB_USER =', process.env.DB_USER);
console.log('DB_PASSWORD =', process.env.DB_PASSWORD);
console.log('DB_NAME =', process.env.DB_NAME);