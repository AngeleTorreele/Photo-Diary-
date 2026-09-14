const items = document.querySelectorAll('.carousel-item');
const totalItems = items.length;
let currentIndex = 0;

function updateCarousel() {
    // Sur téléphone, le CSS gère l'affichage vertical, pas besoin du JS
    if (window.innerWidth < 768) return;

    const spacing = 350;

    items.forEach((item, index) => {
        // Calcule l'écart en gérant la boucle infinie
        let offset = (index - currentIndex) % totalItems;
        if (offset > totalItems / 2) offset -= totalItems;
        if (offset < -totalItems / 2) offset += totalItems;

        const pos = offset * spacing;
        const absOffset = Math.abs(offset);

        const scale = Math.max(0.4, 1 - absOffset * 0.25);
        const opacity = absOffset > 2 ? 0 : Math.max(0, 1 - absOffset * 0.35);
        const zIndex = totalItems - Math.round(absOffset);

        item.style.transform = `translateX(${pos}px) scale(${scale})`;
        item.style.opacity = opacity;
        item.style.zIndex = zIndex;
        item.style.pointerEvents = absOffset === 0 ? 'auto' : 'none';
    });
}

// 1. Roulette de la souris avec boucle infinie fluide
window.addEventListener('wheel', (e) => {
    if (window.innerWidth < 768) return; 
    e.preventDefault();
    
    if (e.deltaY > 0) {
        currentIndex = (currentIndex + 0.15) % totalItems;
    } else {
        currentIndex = (currentIndex - 0.15 + totalItems) % totalItems;
    }
    updateCarousel();
}, { passive: false });

// 2. Navigation au clavier (Flèches) avec boucle infinie
window.addEventListener('keydown', (e) => {
    if (window.innerWidth < 768) return;
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        currentIndex = (Math.floor(currentIndex) + 1) % totalItems;
        updateCarousel();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        currentIndex = (Math.ceil(currentIndex) - 1 + totalItems) % totalItems;
        updateCarousel();
    }
});

// Lancement initial
window.addEventListener('resize', updateCarousel);
updateCarousel();
