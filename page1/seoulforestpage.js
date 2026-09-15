const cards = document.querySelectorAll('.photo-card');
const totalCards = cards.length;
const overlay = document.getElementById('overlay');

let scrollPosition = 0;

// Animation du flux infini basé sur le scroll de la souris
window.addEventListener('wheel', (e) => {
    // Si une photo est agrandie en plein écran, on bloque le scroll du fond
    if (document.querySelector('.photo-card.active')) return;

    e.preventDefault();
    scrollPosition += e.deltaY * 0.003; // Vitesse de défilement du flux

    updateFlow();
}, { passive: false });

function updateFlow() {
    cards.forEach((card, index) => {
        // Calcul de la position dans la boucle infinie
        let progress = (index / totalCards + scrollPosition) % 1;
        if (progress < 0) progress += 1;

        // Transformation de la progression en effet de profondeur (Z-index, échelle et opacité)
        // progress va de 0 (fond lointain) à 1 (premier plan)
        
        const scale = 0.4 + (progress * 0.9); // De petit à grand
        const opacity = Math.sin(progress * Math.PI); // Fondu enchaîné : transparent aux extrémités, opaque au milieu
        const zIndex = Math.round(progress * 100);
        
        // Espacement de la grille (alignement géométrique propre)
        const col = parseInt(card.style.getPropertyValue('--col')) || 1;
        const row = parseInt(card.style.getPropertyValue('--row')) || 1;
        const offsetX = (col - 2) * 120;
        const offsetY = (row - 1.5) * 120;

        // Effet de zoom progressif vers l'utilisateur
        const translateZ = (progress - 0.5) * 800;

        if (!card.classList.contains('active')) {
            card.style.transform = `translate(${offsetX}px, ${offsetY}px) translateZ(${translateZ}px) scale(${scale})`;
            card.style.opacity = Math.max(0, opacity);
            card.style.zIndex = zIndex;
            card.style.pointerEvents = opacity > 0.3 ? 'auto' : 'none'; // Désactive les clics sur les photos invisibles
        }
    });
}

// Gestion du clic pour agrandir et retourner la photo
cards.forEach(card => {
    card.addEventListener('click', (e) => {
        if (card.classList.contains('active')) {
            // Si déjà grand, on retourne la carte
            card.classList.toggle('flipped');
            return;
        }

        // Réinitialiser les autres cartes
        cards.forEach(c => {
            c.classList.remove('active', 'flipped');
        });

        // Mettre cette carte en avant
        card.classList.add('active');
        card.style.opacity = '1';
        card.style.zIndex = '10000';
        overlay.classList.add('visible');
        e.stopPropagation();
    });
});

// Fermer le mode grand en cliquant sur le fond blanc/sombre
overlay.addEventListener('click', () => {
    cards.forEach(card => {
        card.classList.remove('active', 'flipped');
    });
    overlay.classList.remove('visible');
    updateFlow();
});

// Initialisation au chargement
updateFlow();
