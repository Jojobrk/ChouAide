const mongoose = require('mongoose');
const propositionSchema = new mongoose.Schema({
  nom: String,
  competence: String,
  dispo: String,
  niveau: String,
  email: String,
  titre: String,
  contact: String,
  description: String,
  categorie: String,
  date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Proposition', propositionSchema);