const items = document.querySelectorAll('.carousel-item');
const totalItems = items.length;
let currentIndex = 0;

function updateCarousel() {
    const isMobile = window.innerWidth < 768;
    
    // Espacement adapté : horizontal sur PC (350px), vertical sur mobile (240px)
    const spacing = isMobile ? 240 : 350;

    items.forEach((item, index) => {
        // Boucle infinie fluide
        let offset = (index - currentIndex) % totalItems;
        if (offset > totalItems / 2) offset -= totalItems;
        if (offset < -totalItems / 2) offset += totalItems;

        const pos = offset * spacing;
        const absOffset = Math.abs(offset);

        const scale = Math.max(0.4, 1 - absOffset * 0.25);
        const opacity = absOffset > 2 ? 0 : Math.max(0, 1 - absOffset * 0.35);
        const zIndex = totalItems - Math.round(absOffset);

        // Application de l'axe : translateY pour le mobile, translateX pour l'ordi
        if (isMobile) {
            item.style.transform = `translateY(${pos}px) scale(${scale})`;
        } else {
            item.style.transform = `translateX(${pos}px) scale(${scale})`;
        }

        item.style.opacity = opacity;
        item.style.zIndex = zIndex;
        item.style.pointerEvents = absOffset === 0 ? 'auto' : 'none';
    });
}

// 1. Roulette de la souris (Ordinateur)
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

// 2. Navigation au clavier (Ordinateur)
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

// 3. Navigation Tactile Swipe (Téléphone - Vertical)
let touchStartY = 0;

window.addEventListener('touchstart', (e) => {
    if (window.innerWidth >= 768) return;
    touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    if (window.innerWidth >= 768) return;
    e.preventDefault(); // Empêche le scroll de page pour garder le contrôle du carrousel
}, { passive: false });

window.addEventListener('touchend', (e) => {
    if (window.innerWidth >= 768 || !touchStartY) return;
    
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY - touchEndY;

    // Si on glisse le doigt verticalement
    if (Math.abs(diff) > 30) {
        if (diff > 0) {
            // Glissement vers le haut -> photo suivante
            currentIndex = (currentIndex + 1) % totalItems;
        } else {
            // Glissement vers le bas -> photo précédente
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        }
        updateCarousel();
    }
    touchStartY = 0;
}, { passive: true });

// Actualisation au redimensionnement
window.addEventListener('resize', updateCarousel);
updateCarousel();
