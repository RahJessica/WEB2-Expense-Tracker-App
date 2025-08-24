const express=require("express")
const {sequelize}=require("./models")

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("Connexion à la base de donnée réussie");

        await sequelize.sync({alter:true});
        console.log("Base de données synchronisée");

        app.listen(PORT, () => {
        console.log(` Serveur lancé sur http://localhost:${PORT}`);
        });
    } catch (err) {
        console.log("Erreur au lancement du serveur", err)
    }
}

startServer();