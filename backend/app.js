const express = require('express');
const userRoutes = require('./routes/user');

// Création de l'application Express

const app = express();

// Middleware de Express qui analyse requêtes JSON entrantes et met données analysés dans req.body

app.use(express.json());

// Middleware - ajout de headers de contrôle d'accès pour tous les objets de réponse

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Enregistrements des routes

app.use('/api/users', userRoutes);

module.exports = app;