const express = require('express');
const app = express(); // création du server express
require('dotenv').config();

app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Démarrage du server express, run
app.listen(8080, () => console.log('Server running on http://localhost:8080'));