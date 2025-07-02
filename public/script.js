
// ==== VARIABLES GLOBALES ====
const gridContainer = document.querySelector(".grid-container");
const searchInput = document.getElementById("searchProfiles");

// ==== FONCTIONS ====

/**
 * Affiche les profils dans la grille selon un tableau donné
 * @param {Array} profilsAafficher 
 */
function afficherProfils(profilsAafficher) {
  gridContainer.innerHTML = ""; // vide la grille

  if(profilsAafficher.length === 0) {
    gridContainer.innerHTML = "<p>Aucun profil trouvé.</p>";
    return;
  }

  profilsAafficher.forEach(profil => {
    const card = document.createElement("article");
    card.classList.add("service-card");

    card.innerHTML = `
      <img src="${profil.photo}" alt="Photo de ${profil.nom}" loading="lazy" />
      <h2>${profil.nom}</h2>
      <p>${profil.description}</p>
      <div class="btn-container">
        <button class="btn contact-btn">Contacter</button>
      </div>
    `;

    // Ajout de l'écouteur de contact
    card.querySelector(".contact-btn").addEventListener("click", () => {
      ouvrirPopupContact(profil);
    });

    gridContainer.appendChild(card);
  });
}

/**
 * Filtre les profils selon la recherche
 * @param {string} recherche 
 */
function filtrerProfils(recherche) {
  const terme = recherche.toLowerCase().trim();
  const profilsFiltres = profils.filter(p =>
    p.nom.toLowerCase().includes(terme) ||
    p.description.toLowerCase().includes(terme) ||
    p.email.toLowerCase().includes(terme) ||
    p.tel.toLowerCase().includes(terme)
  );
  afficherProfils(profilsFiltres);
}

/**
 * Ouvre une popup pour choisir contact email ou téléphone
 * @param {Object} profil 
 */
function ouvrirPopupContact(profil) {
  // Création de la popup
  const popup = document.createElement("div");
  popup.classList.add("popup-contact");

  popup.innerHTML = `
    <div class="popup-content">
      <h3>Contacter ${profil.nom}</h3>
      <button class="btn email-btn">Envoyer un Email</button>
      <button class="btn tel-btn">Voir le Téléphone</button>
      <button class="btn close-btn">Fermer</button>
    </div>
  `;

  // Ajout au body
  document.body.appendChild(popup);

  // Gestion des clics
  popup.querySelector(".email-btn").addEventListener("click", () => {
    window.location.href = `mailto:${profil.email}`;
  });

  popup.querySelector(".tel-btn").addEventListener("click", () => {
    alert(`Téléphone de ${profil.nom} : ${profil.tel}`);
  });

  popup.querySelector(".close-btn").addEventListener("click", () => {
    popup.remove();
  });

  // Fermer popup en cliquant en dehors
  popup.addEventListener("click", e => {
    if(e.target === popup) popup.remove();
  });
}

/**
 * Initialisation du mode sombre
 */
function initDarkMode() {
  const toggleBtn = document.querySelector(".dark-mode-toggle");
  if(!toggleBtn) return;

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if(document.body.classList.contains("dark-mode")) {
      localStorage.setItem("modeSombre", "true");
    } else {
      localStorage.setItem("modeSombre", "false");
    }
  });

  // Appliquer la préférence au chargement
  if(localStorage.getItem("modeSombre") === "true") {
    document.body.classList.add("dark-mode");
  }
}

/**
 * Initialisation de la recherche
 */
function initRecherche() {
  if(!searchInput) return;
  searchInput.addEventListener("input", (e) => {
    filtrerProfils(e.target.value);
  });
}

/**
 * Initialisation globale
 */
function init() {
  initDarkMode();
  initRecherche();
  afficherProfils(profils);
}

// Démarrer quand la page est prête
document.addEventListener("DOMContentLoaded", init);



// ... autres scripts

const user = JSON.parse(localStorage.getItem("currentUser"));

if (user && user.isLoggedIn) {
  document.getElementById("login-link").style.display = "none";
  document.getElementById("profile-link").style.display = "inline-block";

  const avatar = document.getElementById("profile-picture-icon");
  avatar.src = user.photo || "default-avatar.png";
}
