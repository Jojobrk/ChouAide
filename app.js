const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // <-- Sécurise le chemin vers les vues

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  res.locals.user = req.session.userId ? { id: req.session.userId } : null; // Ajoute l'utilisateur à res.locals pour l'accès dans les vues
  next();
});
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("Apropos");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/proposer", (req, res) => {
  res.render("proposer");
});
app.get("/profils", (req, res) => {
  res.render("profils");
});
app.get("/admin", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  res.render("admin");
});
app.get("/register", (req, res) => {
  if (req.session.userId) {
    return res.redirect("/"); // Redirige vers la page d'accueil si l'utilisateur est déjà connecté
  }
  res.render("register");
});
app.get("/login", (req, res) => {
  if (req.session.userId) {
    return res.redirect("/"); // Redirige vers la page d'accueil si l'utilisateur est déjà connecté
  }
  res.render("login");
});

app.get("/merci", (req, res) => {
  res.render("merci");
});
app.get("/trouver", (req, res) => {
  res.render("trouver");
});
app.get("/profil/:id", (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).send("ID utilisateur manquant");
  }
  res.render("profil", { userId });
});

// Pour l'inscription
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.render("register", { errors: [{ msg: "Tous les champs sont requis" }] });
  }
  try {
    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("register", { errors: [{ msg: "Cet email est déjà utilisé." }] });
    }
    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    // Crée et sauvegarde l'utilisateur
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    req.session.userId = newUser._id;
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.render("register", { errors: [{ msg: "Erreur lors de l'inscription" }] });
  }
});

// Pour la connexion
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // Ajoute ici la logique de vérification de l'utilisateur et du mot de passe
  // Exemple simple :
  if (!email || !password) {
    return res.render("login", { errors: [{ msg: "Tous les champs sont requis" }] });
  }
  // TODO: Vérifier l'utilisateur et le mot de passe
  // Si tout va bien :
  // req.session.userId = utilisateur._id;
  res.redirect("/");
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chouaide', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connecté à MongoDB');
}).catch(err => {
  console.error('Erreur MongoDB :', err);
});

app.listen(PORT, () => {
  console.log(`✅ ChouAide fonctionne sur http://localhost:${PORT}`);
});
