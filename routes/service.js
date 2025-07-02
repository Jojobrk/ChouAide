// Routes pour proposer un service (/proposer), enregistrer dans la base, afficher les profils.
const express = require('express');
const router = express.Router();

// Exemple de route pour proposer un service
router.get('/proposer', (req, res) => {
  res.render('proposer'); // Affiche la vue pour proposer un service
});