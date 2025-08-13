const sequelize=require('./db');
const Income=require('./models/Income');

async function testIncomeModel() {
    try{
        await sequelize.authenticate();
        console.log('Connexion à PostgreSQL OK');

        await sequelize.sync({alter:true});
        console.log('Table Income OK');

        process.exit();
    }
    catch(err){
        console.error('Erreur table Income :', err);
        process.exit(1);
        
    }
    
}

testIncomeModel();
