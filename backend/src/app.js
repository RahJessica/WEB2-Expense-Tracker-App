require('dotenv').config();
const express=require("express")
const {sequelize}=require("./models")

const app = express();

const cors = require("cors");
app.use(cors({ origin: "http://localhost:5173" }));

const PORT = process.env.PORT || 8080;

app.use(express.json());

// Implémentation des routes :
const incomeRoutes = require('./routes/income.js');
const authRoutes = require('./routes/auth.js');
const dashboardRoutes = require('./routes/dashboard.js');
const expenseRoutes = require('./routes/expense.js');
const categoryRoutes = require('./routes/categories.js');
const receiptRoutes = require('./routes/receipts.js');
const userRoutes = require('./routes/user.js');

const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/dashboard', dashboardRoutes);
app.use('/categories', categoryRoutes);
app.use('/auth', authRoutes);
app.use('/incomes', incomeRoutes);
app.use('/expense', expenseRoutes);
app.use('/receipts', receiptRoutes);
app.use('/users', userRoutes);

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