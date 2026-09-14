const items = document.querySelectorAll('.carousel-item');
const totalItems = items.length;
let currentIndex = 0;

function updateCarousel() {
    // Ne s'exécute que sur ordinateur (quand le mode vertical mobile n'est pas actif)
    if (window.innerWidth < 768) return;

    const spacing = 350;

    items.forEach((item, index) => {
        let offset = index - currentIndex;
        const pos = offset * spacing;
        const absOffset = Math.abs(offset);

        const scale = Math.max(0.4, 1 - absOffset * 0.25);
        const opacity = absOffset > 2 ? 0 : Math.max(0, 1 - absOffset * 0.35);
        const zIndex = totalItems - absOffset;

        item.style.transform = `translateX(${pos}px) scale(${scale})`;
        item.style.opacity = opacity;
        item.style.zIndex = zIndex;
        item.style.pointerEvents = absOffset === 0 ? 'auto' : 'none';
    });
}

// 1. Roulette de la souris (Ordinateur uniquement)
window.addEventListener('wheel', (e) => {
    if (window.innerWidth < 768) return; // Laisse le téléphone scroller normalement
    e.preventDefault();
    if (e.deltaY > 0 && currentIndex < totalItems - 1) {
        currentIndex++;
    } else if (e.deltaY < 0 && currentIndex > 0) {
        currentIndex--;
    }
    updateCarousel();
}, { passive: false });

// 2. Navigation au clavier
window.addEventListener('keydown', (e) => {
    if (window.innerWidth < 768) return;
    if ((e.key === 'ArrowDown' || e.key === 'ArrowRight') && currentIndex < totalItems - 1) {
        currentIndex++;
        updateCarousel();
    } else if ((e.key === 'ArrowUp' || e.key === 'ArrowLeft') && currentIndex > 0) {
        currentIndex--;
        updateCarousel();
    }
});

// Lancement initial
window.addEventListener('resize', updateCarousel);
updateCarousel();
