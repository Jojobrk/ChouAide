// Routes protégées pour l’admin : valider ou refuser les services proposés.

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { ensureAuthenticated, ensureAdmin } = require('../middlewares/authMiddleware');

// Route pour accéder à la page d'administration
router.get('/', ensureAuthenticated, ensureAdmin, adminController.getAdminDashboard);  
// Route pour valider un service proposé
router.post('/valider/:serviceId', ensureAuthenticated, ensureAdmin, adminController.validateService
);
// Route pour refuser un service proposé
router.post('/refuser/:serviceId', ensureAuthenticated, ensureAdmin, adminController.rejectService
);
// Route pour afficher les services proposés
router.get('/services', ensureAuthenticated, ensureAdmin, adminController.getProposedServices
);
// Route pour afficher les utilisateurs
router.get('/utilisateurs', ensureAuthenticated, ensureAdmin, adminController.getUsers
);
// Route pour supprimer un utilisateur
router.post('/utilisateurs/supprimer/:userId', ensureAuthenticated, ensureAdmin, adminController.deleteUser
);
// Route pour afficher les statistiques
router.get('/statistiques', ensureAuthenticated, ensureAdmin, adminController.getStatistics
);
// Route pour gérer les paramètres de l'application
router.get('/parametres', ensureAuthenticated, ensureAdmin, adminController.getSettings
);
// Route pour accéder à la page d'administration (alternative)
// router.get("/admin", requireAdmin, async (req, res) => {
//   const users = await User.find().select('username email isAdmin');
//   res.render("admin", { users });
// });

module.exports = router;