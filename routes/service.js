// Routes pour proposer un service (/proposer), enregistrer dans la base, afficher les profils.
const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');