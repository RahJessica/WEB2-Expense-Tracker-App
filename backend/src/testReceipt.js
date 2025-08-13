const sequelize=require('./db');
const Receipt=require('./models/Receipt');

async function testReceiptModel() {
    try{
        await sequelize.authenticate();
        console.log('Connexion à PostgreSQL OK');

        await sequelize.sync({alter:true});
        console.log('Table Receipt OK');

        process.exit();
    }catch(err){
        console.log('Erreur table Receipt :', err);
        process.exit(1);
        
    }
}

testReceiptModel();