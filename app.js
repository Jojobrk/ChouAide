const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
const path = require("path");

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
app.listen(PORT, () => {
  console.log(`✅ ChouAide fonctionne sur http://localhost:${PORT}`);
});
