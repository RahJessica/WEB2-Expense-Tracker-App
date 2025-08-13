const {Sequelize}= require('sequelize');
const sequelize = new Sequelize(
    process.env.DB_NAME,    
    process.env.DB_USER,     
    process.env.DB_PASSWORD, 
    {
      host: process.env.DB_HOST || 'localhost', 
      dialect: 'postgres',                     
      logging: false                         
    }
  );

  async function testConnection() {
    try {
      await sequelize.authenticate(); // teste la connexion
      console.log('Connexion à PostgreSQL OK ');
    } catch (err) {
      console.error('Erreur connexion PostgreSQL :', err);
    }
}

testConnection(); 
module.exports = sequelize;