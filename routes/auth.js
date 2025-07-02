// Gère l’inscription (/auth/register) et la connexion (/auth/login) des utilisateurs.

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Assurez-vous que le modèle User est correctement défini  
const { check, validationResult } = require('express-validator');
const session = require('express-session');
// Route pour l'inscription
router.get('/register', (req, res) => {
  res.render('register');
});
// Route pour traiter l'inscription
router.post('/register', [
  check('username').notEmpty().withMessage('Le nom d’utilisateur est requis'),
  check('email').isEmail().withMessage('L\'email doit être valide'),
  check('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('register', { errors: errors.array() });
  }

  const { username, email, password } = req.body;
  try {
    // Vérifier si l'utilisateur existe déjà
    let user = await User.findOne({ email });
    if (user) {
      return res.render('register', { errors: [{ msg: 'L\'utilisateur existe déjà' }] });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ username, email, password: hashedPassword });
    await user.save();

    req.session.userId = user._id; // Enregistrer l'utilisateur dans la session
    res.redirect('/'); // Rediriger vers la page d'accueil ou une autre page
  } catch (error) {
    console.error(error);
    res.render('register', { errors: [{ msg: 'Erreur lors de l\'inscription' }] });
  }
});
// Route pour la connexion
router.get('/login', (req, res) => {
  res.render('login');
});
// Route pour traiter la connexion
router.post('/login', [
  check('email').isEmail().withMessage('L\'email doit être valide'),
  check('password').notEmpty().withMessage('Le mot de passe est requis'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('login', { errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.render('login', { errors: [{ msg: 'Utilisateur non trouvé' }] });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('login', { errors: [{ msg: 'Mot de passe incorrect' }] });
    }

    req.session.userId = user._id; // Enregistrer l'utilisateur dans la session
    res.redirect('/'); // Rediriger vers la page d'accueil ou une autre page
  } catch (error) {
    console.error(error);
    res.render('login', { errors: [{ msg: 'Erreur lors de la connexion' }] });
  }
});
// Route pour la déconnexion
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
      return res.redirect('/'); // Rediriger vers la page d'accueil en cas d'erreur
    }
    res.clearCookie('connect.sid'); // Effacer le cookie de session
    res.redirect('/'); // Rediriger vers la page d'accueil
  });
});
// Middleware pour vérifier si l'utilisateur est authentifié
const ensureAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next(); // L'utilisateur est authentifié, continuer
  }
  res.redirect('/auth/login'); // Rediriger vers la page de connexion si non authentifié
}

// Route pour accéder à une page protégée (exemple)
