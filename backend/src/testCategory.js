const sequelize=require('./db');
const category=require('./models/Category');

async function testCategoryModel() {
        try{
            await sequelize.authenticate();
            console.log('Connexion à PostgreSQL OK');
            
            await sequelize.sync({alter:true});
            console.log('Table category OK');
            process.exit();
        }catch (err){
            console.log('Erreur table category',err);
        process.exit(1);            
        }
}
testCategoryModel();