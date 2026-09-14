const items = document.querySelectorAll('.carousel-item');
const totalItems = items.length;
let currentIndex = 0; // Position virtuelle dans le carrousel

function updateCarousel() {
    const spacing = 250; // Espace horizontal entre chaque élément

    items.forEach((item, index) => {
        // Calculer la distance par rapport à l'index courant (effet infini)
        let offset = (index - currentIndex) % totalItems;
        if (offset > totalItems / 2) offset -= totalItems;
        if (offset < -totalItems / 2) offset += totalItems;

        // Position horizontale
        const xPos = offset * spacing;
        
        // Plus on s'éloigne du centre, plus l'élément devient petit et transparent
        const absOffset = Math.abs(offset);
        const scale = Math.max(0.3, 1 - absOffset * 0.25); // Rétrécit sur les côtés
        const opacity = Math.max(0, 1 - absOffset * 0.4); // Devient transparent puis disparaît
        const zIndex = 10 - Math.round(absOffset); // L'élément du centre passe au premier plan

        // Appliquer les transformations
        item.style.transform = `translateX(${xPos}px) scale(${scale})`;
        item.style.opacity = opacity;
        item.style.zIndex = zIndex;
        
        // Désactive les clics sur les images trop éloignées/invisibles pour éviter les clics accidentels
        item.style.pointerEvents = absOffset > 1.5 ? 'none' : 'auto';
    });
}

// 1. Gestion de la roulette de la souris
window.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (e.deltaY > 0) {
        currentIndex += 0.15; // Vitesse de défilement fluide
    } else {
        currentIndex -= 0.15;
    }
    updateCarousel();
}, { passive: false });

// 2. Gestion des flèches du clavier (gauche / droite)
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        currentIndex += 1;
        updateCarousel();
    } else if (e.key === 'ArrowLeft') {
        currentIndex -= 1;
        updateCarousel();
    }
});

// Initialisation au chargement
updateCarousel();
