const items = document.querySelectorAll('.carousel-item');
const totalItems = items.length;
let currentIndex = 0;

function updateCarousel() {
    // Si on est sur téléphone (écran < 768px), on ne fait rien (les CSS gèrent l'empilement)
    if (window.innerWidth <= 768) {
        items.forEach(item => {
            item.style.transform = 'none';
            item.style.opacity = '1';
            item.style.zIndex = '1';
            item.style.pointerEvents = 'auto';
        });
        return;
    }

    const spacing = 250;

    items.forEach((item, index) => {
        let offset = (index - currentIndex) % totalItems;
        if (offset > totalItems / 2) offset -= totalItems;
        if (offset < -totalItems / 2) offset += totalItems;

        const xPos = offset * spacing;
        const absOffset = Math.abs(offset);
        const scale = Math.max(0.3, 1 - absOffset * 0.25);
        const opacity = Math.max(0, 1 - absOffset * 0.4);
        const zIndex = 10 - Math.round(absOffset);

        item.style.transform = `translateX(${xPos}px) scale(${scale})`;
        item.style.opacity = opacity;
        item.style.zIndex = zIndex;
        item.style.pointerEvents = absOffset > 1.5 ? 'none' : 'auto';
    });
}

// 1. Roulette de la souris (uniquement sur ordi)
window.addEventListener('wheel', (e) => {
    if (window.innerWidth <= 768) return;
    e.preventDefault();
    if (e.deltaY > 0) {
        currentIndex += 0.15;
    } else {
        currentIndex -= 0.15;
    }
    updateCarousel();
}, { passive: false });

// 2. Flèches du clavier (uniquement sur ordi)
window.addEventListener('keydown', (e) => {
    if (window.innerWidth <= 768) return;
    if (e.key === 'ArrowRight') {
        currentIndex = Math.floor(currentIndex) + 1;
        updateCarousel();
    } else if (e.key === 'ArrowLeft') {
        currentIndex = Math.ceil(currentIndex) - 1;
        updateCarousel();
    }
});

// 3. Réinitialise proprement si on redimensionne la fenêtre
window.addEventListener('resize', () => {
    updateCarousel();
});

// Initialisation au chargement
updateCarousel();
