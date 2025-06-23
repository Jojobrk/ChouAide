document.addEventListener("DOMContentLoaded", () => {
  // BOUTONS DE NAVIGATION
  const btnTrouver = document.querySelector("#btn-trouver");
  const btnProposer = document.querySelector("#btn-proposer");

  if (btnTrouver) {
    btnTrouver.addEventListener("click", () => {
      window.location.href = "trouver.html";
    });
  }

  if (btnProposer) {
    btnProposer.addEventListener("click", () => {
      window.location.href = "proposer.html";
    });
  }

  // CARROUSEL (slides d'accueil)
  const slides = document.querySelectorAll(".slide");
  let current = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });
  }

  if (slides.length > 0) {
    setInterval(() => {
      current = (current + 1) % slides.length;
      showSlide(current);
    }, 6000);
  }

  // RECHERCHE DANS LES CARTES
  const input = document.getElementById("searchInput");
  const cards = document.querySelectorAll(".service-card");

  function filterCardsByText(text) {
    cards.forEach(card => {
      const content = card.textContent.toLowerCase();
      card.style.display = content.includes(text) ? "block" : "none";
    });
  }

  if (input) {
    input.addEventListener("input", () => {
      filterCardsByText(input.value.toLowerCase());
    });

    // Si une catégorie est passée dans l'URL, pré-remplir le champ
    const params = new URLSearchParams(window.location.search);
    const categorie = params.get("categorie");

    if (categorie) {
      input.value = categorie;
      filterCardsByText(categorie.toLowerCase());
    }
  }
});

// Définir un "admin" simulé (dans une vraie version ce serait via un login sécurisé)
const estAdmin = localStorage.getItem("admin") === "true";

if (estAdmin) {
  const navLinks = document.getElementById("navLinks");
  const adminLink = document.createElement("li");
  adminLink.innerHTML = `<a href="admin.html">Admin 🔒</a>`;
  navLinks.appendChild(adminLink);
}

// (notification affichée)
  if (estAdmin) {
  const enAttente = JSON.parse(localStorage.getItem("candidaturesEnAttente")) || [];
  const badge = enAttente.length > 0 ? ` <span class="notif-badge">${enAttente.length}</span>` : "";
  const adminLink = document.createElement("li");
  adminLink.innerHTML = `<a href="admin.html">Admin 🔒${badge}</a>`;
  navLinks.appendChild(adminLink);
}